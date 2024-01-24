namespace API.Servisi
{
    public class ZahtevNamirniceServis : IZahtevNamirnice
    {
        private DataContext context;
        public PomocneFunkcije funkcije;
        public ZahtevNamirniceServis(DataContext dc, IHttpContextAccessor hca) 
        { 
            context = dc; 
            funkcije = new PomocneFunkcije(hca);
        }


        public async Task<ICollection<ZahtevNamirnice>> PrimljeniZahtevi()
        {
            return await context.ZahteviNamirnica.ToListAsync();
        }

        public async Task<ICollection<ZahtevNamirnice>> NoviPrimljeniZahtevi()
        {
            return await context.ZahteviNamirnica.Where(z => z.Stanje == StanjeZahteva.Cekanje || z.Stanje == StanjeZahteva.Obrada).ToListAsync();
        }
        public async Task<ICollection<ZahtevNamirnice>> ZakljuceniPrimljeniZahtevi()
        {
            return await context.ZahteviNamirnica.Where(z => z.Stanje == StanjeZahteva.Odbijen || z.Stanje == StanjeZahteva.Ispunjen).ToListAsync();
        }

        public async Task<ICollection<ZahtevNamirnice>> PoslatiZahtevi()
        {
            return await context.ZahteviNamirnica.Where(z => z.podnosilacID == funkcije.PrijavljenID()).ToListAsync();
        }

        public async Task<ZahtevNamirnice> NadjiPoslatZahtev(int zahtevID)
        {
            var zahtev = await context.ZahteviNamirnica.Where(z => z.podnosilacID == funkcije.PrijavljenID() && z.ID == zahtevID).FirstOrDefaultAsync();
            if (zahtev == null)
                return null;

            return zahtev;
        }

        public async Task<ZahtevNamirnice> NadjiPrimljenZahtev(int zahtevID)
        {
            var zahtev = await context.ZahteviNamirnica.FindAsync(zahtevID);
            if (zahtev == null)
                return null;

            return zahtev;
        }

        public async Task<ICollection<ZahtevNamirnice>> NadjiPoslateZahteve(string naziv)
        {
            return await context.ZahteviNamirnica.Where(z => z.podnosilacID == funkcije.PrijavljenID() && (z.NazivNamirnice.Contains(naziv) ||
            naziv.Contains(z.NazivNamirnice))).ToListAsync();
        }

        public async Task<ICollection<ZahtevNamirnice>> NadjiPrimljeneZahteve(string naziv)
        {
            return await context.ZahteviNamirnica.Where(z => (z.NazivNamirnice.Contains(naziv) || naziv.Contains(z.NazivNamirnice))).ToListAsync();
        }

        public async Task<bool> PrijavaPoslednjeg() 
        {
            var zahtev = await context.ZahteviNamirnica.Where(z => z.podnosilacID == funkcije.PrijavljenID())
                    .OrderBy(z => z.Podnet).LastOrDefaultAsync();
            if (zahtev == null)
                return true;

            return zahtev.Prijava;
        }

        public async Task<ZahtevNamirnice> PosaljiZahtev(string naziv, bool prijava, string napomena)
        {
            ZahtevNamirnice zahtev = new ZahtevNamirnice(naziv);
            zahtev.podnosilacID = funkcije.PrijavljenID();

            if (await context.ZahteviNamirnica.Where(z => z.podnosilacID == zahtev.podnosilacID && z.NazivNamirnice.Equals(naziv)).FirstOrDefaultAsync() != null)
                return null;

            zahtev.podnosilac = await context.Korisnici.FindAsync(zahtev.podnosilacID);
            zahtev.admin = await context.AdministratoriNamirnica.FirstOrDefaultAsync();
            zahtev.adminID = zahtev.admin.ID;
            zahtev.Podnet = DateTime.Now;

            if (!napomena.Trim().Equals(string.Empty) || !napomena.Equals("*"))
                zahtev.Poruka = napomena;

            await context.ZahteviNamirnica.AddAsync(zahtev);
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
                return "Ne postoji traženi zahtev.";

            if (zahtev.Stanje != StanjeZahteva.Cekanje)
                return "Admin je prihvatio zahtev i više se ne može povući.";

            context.ZahteviNamirnica.Remove(zahtev);
            await context.SaveChangesAsync();

            return "Zahtev je povučen.";
        }

        public async Task<ZahtevNamirnice> PrihvatiZahtev(ZahtevNamirnice zahtev)
        {
            if (zahtev.Stanje > StanjeZahteva.Cekanje)
                return null;

            zahtev.Prihvacen = DateTime.Now;
            zahtev.Stanje = StanjeZahteva.Obrada;

            if (zahtev.Prijava)
            {
                var rezultat = await RezultatZahteva(zahtev);
                rezultat.Poruka += "Zahtev je prihvaćen i nalazi se u stanju obrade " + funkcije.DatumVremeToString(zahtev.Prihvacen) + " ." + Environment.NewLine;
            }

            await context.SaveChangesAsync();
            return zahtev;
        }

        public async Task<ZahtevNamirnice> IspuniZahtev(ZahtevNamirnice zahtev, ICollection<Namirnica> namirnice)
        {
            if (zahtev.Stanje > StanjeZahteva.Obrada)
                return null;

            foreach (Namirnica n in namirnice)
            {
                NamirnicaZahtev nz = new NamirnicaZahtev();
                nz.namirnica = n;
                nz.namirnicaID = n.ID;
                nz.zahtev = zahtev;
                nz.zahtevID = zahtev.ID;
    
                await context.ZahtevaneNamirnice.AddAsync(nz);
            }

            zahtev.Stanje = StanjeZahteva.Ispunjen;
            zahtev.Zakljucen = DateTime.Now;

            if (zahtev.Prijava)
            {
                var rezultat = await RezultatZahteva(zahtev);
                rezultat.Poruka += "Zahtev je ispunjen " + funkcije.DatumVremeToString(zahtev.Zakljucen) +
                    " . Dodate namirnice: " + Environment.NewLine;
                foreach (var n in namirnice)
                    rezultat.Poruka += n.Naziv + Environment.NewLine;
            }

            await context.SaveChangesAsync();
            return zahtev;
        }

        public async Task<ZahtevNamirnice> OdbijZahtev(ZahtevNamirnice zahtev)
        {
            if (zahtev.Stanje > StanjeZahteva.Obrada)
                return null;

            zahtev.Stanje = StanjeZahteva.Odbijen;
            zahtev.Zakljucen = DateTime.Now;

            if (zahtev.Prijava)
            {
                var rezultat = await RezultatZahteva(zahtev);
                rezultat.Poruka += "Administrator je odbio zahtev " + funkcije.DatumVremeToString(zahtev.Zakljucen) +
                    " jer nije pronašao namirnice slične " + zahtev.NazivNamirnice + Environment.NewLine;
            }

            await context.SaveChangesAsync();
            return zahtev;
        }


        public async Task<ICollection<RezultatZahteva>> RezultatiZahteva()
        {
            var zahtevi = await context.ZahteviNamirnica.Where(z => z.podnosilacID == funkcije.PrijavljenID()).OrderByDescending(d => d.Podnet).ToListAsync();
            if (zahtevi.Count == 0)
                return null;

            ICollection<RezultatZahteva> rezultati = new List<RezultatZahteva>();
            foreach (var z in zahtevi)
                rezultati.Add(await context.RezultatiZahteva.Where(r => r.zahtevID == z.ID).FirstOrDefaultAsync());

            return rezultati;
        }



        public async Task<RezultatZahteva> RezultatZahteva(ZahtevNamirnice zahtev)
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
            rezultat.zNamirnice = await NadjiPoslatZahtev(zahtevID);

            var zahtev = await NadjiPoslatZahtev(zahtevID);
            var podnosilac = await context.Korisnici.FindAsync(zahtev.podnosilacID);
            rezultat.zNamirnice = zahtev;

            string napomena = String.Empty;
            napomena = zahtev.Poruka.Trim();
            if (!napomena.Equals(String.IsNullOrEmpty) && !napomena.Equals("*"))
                napomena = "," + Environment.NewLine + " uz napomenu: " + napomena + Environment.NewLine;
            else napomena = "." + Environment.NewLine;

            rezultat.Poruka = podnosilac.Ime + " podneo je zahtev za " + zahtev.NazivNamirnice + " " + funkcije.DatumVremeToString(zahtev.Podnet)
                    + napomena + "Zahtev je na čekanju." + Environment.NewLine;



            await context.RezultatiZahteva.AddAsync(rezultat);
            await context.SaveChangesAsync();

            return rezultat;
        }


    }
}
