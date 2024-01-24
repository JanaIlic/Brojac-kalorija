namespace API.Servisi
{
    public class ZahtevAktivnostiServis : IZahtevAktivnosti
    {
        private DataContext context;
        public PomocneFunkcije funkcije;
        public ZahtevAktivnostiServis(DataContext dc, IHttpContextAccessor hca) 
        { 
            context = dc; 
            funkcije = new PomocneFunkcije(hca);
        }

        public async Task<ICollection<ZahtevAktivnosti>> PrimljeniZahtevi()
        {
            return await context.ZahteviAktivnosti.ToListAsync();   
        }

        public async Task<ICollection<ZahtevAktivnosti>> NoviPrimljeniZahtevi() 
        {
            return await context.ZahteviAktivnosti.Where(z => z.Stanje == StanjeZahteva.Cekanje || z.Stanje == StanjeZahteva.Obrada).ToListAsync();   
        }
        public async Task<ICollection<ZahtevAktivnosti>> ZakljuceniPrimljeniZahtevi() 
        {
            return await context.ZahteviAktivnosti.Where(z => z.Stanje == StanjeZahteva.Odbijen || z.Stanje == StanjeZahteva.Ispunjen).ToListAsync();
        }

        public async Task<ICollection<ZahtevAktivnosti>> PoslatiZahtevi()
        {
            return await context.ZahteviAktivnosti.Where(z => z.podnosilacID == funkcije.PrijavljenID()).ToListAsync();
        }

        public async Task<ZahtevAktivnosti> NadjiPoslatZahtev(int zahtevID)
        {
            var zahtev = await context.ZahteviAktivnosti.Where(z => z.podnosilacID == funkcije.PrijavljenID() && z.ID == zahtevID).FirstOrDefaultAsync();
            if(zahtev == null)
                return null;

            return zahtev;
        }

        public async Task<ZahtevAktivnosti> NadjiPrimljenZahtev(int zahtevID)
        {
            var zahtev = await context.ZahteviAktivnosti.FindAsync(zahtevID);
            if (zahtev == null)
                return null;

            return zahtev;
        }

        public async Task<ICollection<ZahtevAktivnosti>> NadjiPoslateZahteve(string naziv)
        {
            return await context.ZahteviAktivnosti.Where(z => z.podnosilacID == funkcije.PrijavljenID() && (z.NazivAktivnosti.Contains(naziv) ||
            naziv.Contains(z.NazivAktivnosti) )).ToListAsync();
        }

        public async Task<ICollection<ZahtevAktivnosti>> NadjiPrimljeneZahteve(string naziv)
        {
            return await context.ZahteviAktivnosti.Where(z => (z.NazivAktivnosti.Contains(naziv) || naziv.Contains(z.NazivAktivnosti))).ToListAsync();          
        }

        public async Task<bool> PrijavaPoslednjeg()
        {
            var zahtev = await context.ZahteviAktivnosti.Where(z => z.podnosilacID == funkcije.PrijavljenID())
                    .OrderBy(z => z.Podnet).LastOrDefaultAsync();
            if (zahtev == null)
                return true;

            return zahtev.Prijava;
        }

        public async Task<ZahtevAktivnosti> PosaljiZahtev(string naziv, bool prijava, string napomena) 
        {
            ZahtevAktivnosti zahtev = new ZahtevAktivnosti(naziv);
            zahtev.podnosilacID = funkcije.PrijavljenID();

            if (await context.ZahteviAktivnosti.Where(z => z.podnosilacID == zahtev.podnosilacID && z.NazivAktivnosti.Equals(naziv)).FirstOrDefaultAsync() != null)
                return null;

            zahtev.podnosilac = await context.Korisnici.FindAsync(zahtev.podnosilacID);
            zahtev.admin = await context.AdministratoriAktivnosti.FirstOrDefaultAsync();
            zahtev.adminID = zahtev.admin.ID;
            zahtev.Podnet = DateTime.Now;

            if (!napomena.Trim().Equals(string.Empty) || !napomena.Equals("*"))
                zahtev.Poruka = napomena;

            await context.ZahteviAktivnosti.AddAsync(zahtev);
            await context.SaveChangesAsync();

            if (prijava)
            {
                zahtev.Prijava = true;
                zahtev.rezultat = await DodajRezultat(zahtev.ID);
                zahtev.rezultatID = zahtev.rezultat.ID;
            }
            else zahtev.Prijava = false;

            await context.SaveChangesAsync();

            return zahtev;
        }



        public async Task<string> PovuciZahtev(int zahtevID)
        {
            var zahtev = await NadjiPoslatZahtev(zahtevID);
            if (zahtev == null)
                return "Traženi zahtev ne postoji, ili je uklonjen.";

            if (zahtev.Stanje != StanjeZahteva.Cekanje)
                return "Admin je prihvatio zahtev i više se ne može povući.";

            context.ZahteviAktivnosti.Remove(zahtev);
            await context.SaveChangesAsync();

            return "Zahtev je povučen.";
        }

        public async Task<ZahtevAktivnosti> PrihvatiZahtev(ZahtevAktivnosti zahtev)
        {
            if (zahtev.Stanje > StanjeZahteva.Cekanje)
                return null;

            zahtev.Prihvacen = DateTime.Now;
            zahtev.Stanje = StanjeZahteva.Obrada;

            if (zahtev.Prijava) 
            {
                var rezultat = await RezultatZahteva(zahtev);
                rezultat.Poruka += " Zahtev je prihvaćen i nalazi se u stanju obrade " + funkcije.DatumVremeToString(zahtev.Prihvacen) + " ." + Environment.NewLine;
            }

            await context.SaveChangesAsync();
            return zahtev;
        }

        public async Task<ZahtevAktivnosti> IspuniZahtev(ZahtevAktivnosti zahtev, ICollection<Aktivnost>aktivnosti)
        {
            if (zahtev.Stanje > StanjeZahteva.Obrada)
                return null;


            foreach (Aktivnost a in aktivnosti) 
            {
                AktivnostZahtev az = new AktivnostZahtev();
                az.aktivnost = a;
                az.aktivnostID = a.ID;
                az.zahtev = zahtev;
                az.zahtevID = zahtev.ID;
                await context.ZahtevaneAktivnosti.AddAsync(az);
            }

            zahtev.Stanje = StanjeZahteva.Ispunjen;
            zahtev.Zakljucen = DateTime.Now;

            if (zahtev.Prijava)
            {
                var rezultat = await RezultatZahteva(zahtev);
                rezultat.Poruka += " Zahtev je ispunjen " + funkcije.DatumVremeToString(zahtev.Zakljucen) + 
                    " . Dodate aktivnosti: " + Environment.NewLine;
                foreach (var a in aktivnosti)
                    rezultat.Poruka += a.Naziv + Environment.NewLine;
            }

            await context.SaveChangesAsync();
            return zahtev;
        }

        public async Task<ZahtevAktivnosti> OdbijZahtev(ZahtevAktivnosti zahtev)
        {
            if (zahtev.Stanje > StanjeZahteva.Obrada )
                return null; 

            zahtev.Stanje = StanjeZahteva.Odbijen;
            zahtev.Zakljucen = DateTime.Now;

            if (zahtev.Prijava)
            {
                var rezultat = await RezultatZahteva(zahtev);
                rezultat.Poruka += " Administrator je odbio zahtev " + funkcije.DatumVremeToString(zahtev.Zakljucen) +
                    " jer nije pronašao aktivnosti slične " + zahtev.NazivAktivnosti + Environment.NewLine;
            } 

            await context.SaveChangesAsync();
            return zahtev;
        }



        public async Task<ICollection<RezultatZahteva>> RezultatiZahteva()
        {
            var zahtevi = await context.ZahteviAktivnosti.Where(z => z.podnosilacID == funkcije.PrijavljenID()).OrderByDescending(d=>d.Podnet).ToListAsync();
            if (zahtevi.Count == 0)
                return null;

            ICollection<RezultatZahteva> rezultati = new List<RezultatZahteva>();
            foreach (var z in zahtevi)
                rezultati.Add(await context.RezultatiZahteva.Where(r => r.zahtevID == z.ID).FirstOrDefaultAsync());

            return rezultati;
        }

        public async Task<RezultatZahteva> RezultatZahteva(ZahtevAktivnosti zahtev) 
        {
            var rezultat = await context.RezultatiZahteva.FindAsync(zahtev.rezultatID);
            if (rezultat == null)
                return null;

            return rezultat;
        }



        public async Task<RezultatZahteva> DodajRezultat(int zahtevID)
        {

            RezultatZahteva rezultat = new RezultatZahteva();
            rezultat.zahtevID = zahtevID;
            var zahtev = await NadjiPoslatZahtev(zahtevID);
            var podnosilac = await context.Korisnici.FindAsync(zahtev.podnosilacID);
            rezultat.podnosilacID = zahtev.podnosilacID;
            rezultat.zAktivnosti = zahtev;

            string napomena = String.Empty;
             napomena = zahtev.Poruka.Trim();
            if (!napomena.Equals(String.IsNullOrEmpty) && !napomena.Equals("*"))
                napomena = ","+ Environment.NewLine +" uz napomenu: " + napomena + Environment.NewLine;
            else napomena = "." + Environment.NewLine;

                rezultat.Poruka = podnosilac.Ime + " podneo je zahtev za " + zahtev.NazivAktivnosti + " " + funkcije.DatumVremeToString(zahtev.Podnet) 
                    + napomena + Environment.NewLine + " Zahtev je na čekanju." + Environment.NewLine;


            await context.RezultatiZahteva.AddAsync(rezultat);
            await context.SaveChangesAsync();

            return rezultat;
        }

    }
}
