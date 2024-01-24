namespace API.Servisi
{
    public class ZahtevZaPracenjeServis : IZahtevZaPracenje
    {
        private DataContext context;
        public PomocneFunkcije funkcije;
        public ZahtevZaPracenjeServis(DataContext dc, IHttpContextAccessor hca)
        {
            context = dc;
            funkcije = new PomocneFunkcije(hca);
        }

        public async Task<ICollection<ZahtevZaPracenje>> PrimljeniZahtevi()
        {
            return await context.ZahteviZaPracenje.Where(z => z.pracenID == funkcije.PrijavljenID()).OrderByDescending(z => z.Podnet).ToListAsync();
        }

        public async Task<ICollection<ZahtevZaPracenje>> PoslatiZahtevi()
        {
            return await context.ZahteviZaPracenje.Where(z => z.podnosilacID == funkcije.PrijavljenID()).OrderByDescending(z => z.Podnet).ToListAsync();
        }

        public async Task<ZahtevZaPracenje> NadjiPoslatZahtev(int zahtevID)
        {
            return await context.ZahteviZaPracenje.Where(z => z.podnosilacID == funkcije.PrijavljenID() && z.ID == zahtevID).FirstOrDefaultAsync();
        }

        public async Task<ZahtevZaPracenje> NadjiPrimljenZahtev(int zahtevID)
        {
            return await context.ZahteviZaPracenje.Where(z => z.pracenID == funkcije.PrijavljenID() && z.ID == zahtevID).FirstOrDefaultAsync();
        }

        public async Task<ICollection<ZahtevZaPracenje>> NadjiPoslateZahteve(string ime)
        {
            var korisnici = await context.Korisnici.Where(k => k.Ime.Contains(ime) && ime.Contains(k.Ime)).ToListAsync();
            ICollection<ZahtevZaPracenje> poslatiZahtevi = new List<ZahtevZaPracenje>();

            foreach (var k in korisnici)
                foreach (var z in await PoslatiZahtevi())
                    if (k.ID == z.pracenID)
                        poslatiZahtevi.Add(z);

            return poslatiZahtevi;
        }

        public async Task<ICollection<ZahtevZaPracenje>> NadjiPrimljeneZahteve(string ime)
        {
            var korisnici = await context.Korisnici.Where(k => k.Ime.Contains(ime) && ime.Contains(k.Ime)).ToListAsync();
            ICollection<ZahtevZaPracenje> primljeniZahtevi = new List<ZahtevZaPracenje>();

            foreach (var k in korisnici)
                foreach (var z in await PrimljeniZahtevi())
                    if (k.ID == z.podnosilacID)
                        primljeniZahtevi.Add(z);

            return primljeniZahtevi;
        }

        public async Task<ICollection<string>> Primaoci() 
        {
            List<string> primaoci = new List<string>();
            var poslatiZahtevi = await PoslatiZahtevi();
            foreach (var z in poslatiZahtevi)
                primaoci.Add((await context.Korisnici.FindAsync(z.pracenID)).Ime);

            return primaoci;
        }
        public async Task<ICollection<string>> Podnosioci() 
        {
            List<string> podnosioci = new List<string>();
            var primljeniZahtevi = await PrimljeniZahtevi();
            foreach (var z in primljeniZahtevi)
                podnosioci.Add((await context.Korisnici.FindAsync(z.podnosilacID)).Ime);

            return podnosioci;
        }

        public async Task<bool> Pratilac(int pratilacID)
        {
            var pratilac = await context.ParoviKorisnika.Where(par => par.pracenID == funkcije.PrijavljenID() && par.pratilacID == pratilacID).FirstOrDefaultAsync();
            if (pratilac == null)
                return false;
            else return true;
        }

        public async Task<bool> Pracen(int pracenID) 
        {
            var pracen = await context.ParoviKorisnika.Where(par => par.pratilacID == funkcije.PrijavljenID() && par.pracenID == pracenID).FirstOrDefaultAsync();
            if (pracen == null)
                return false;
            else return true;           
        }

        public async Task<bool> PrijavaPoslednjeg()
        {
            var zahtev = await context.ZahteviZaPracenje.Where(z => z.podnosilacID == funkcije.PrijavljenID())
                    .OrderBy(z => z.Podnet).LastOrDefaultAsync();
            if (zahtev == null)
                return true;

            return zahtev.Prijava;
        }

        public async Task<bool> ZahtevPoslatKorisniku(Korisnik primalac) 
        {
            var poslat = false;
            var poslati = await PoslatiZahtevi();
            foreach(var z in poslati)
                if(z.pracenID == primalac.ID && z.Stanje.Equals(StanjeZahteva.Cekanje))
                    poslat = true;

            return poslat;
        }

        public async Task<ZahtevZaPracenje> PosaljiZahtev(Korisnik korisnik, bool prijava, string pozdrav)
        {
            ZahtevZaPracenje zahtev = new ZahtevZaPracenje();
            zahtev.podnosilac = await context.Korisnici.FindAsync(funkcije.PrijavljenID());
            zahtev.podnosilacID = funkcije.PrijavljenID();
            zahtev.pracen = korisnik;
            zahtev.pracenID = korisnik.ID;

            if (await context.ZahteviZaPracenje.Where(z => z.podnosilacID == zahtev.podnosilacID && z.pracenID == zahtev.pracenID 
                        && (z.Stanje == StanjeZahteva.Cekanje || z.Stanje == StanjeZahteva.Obrada)).FirstOrDefaultAsync() != null )
                return null;

            zahtev.Stanje = StanjeZahteva.Cekanje;
            zahtev.Podnet = DateTime.Now;

            if (!pozdrav.Trim().Equals(string.Empty) || !pozdrav.Equals("*"))
                zahtev.Poruka = pozdrav;

            await context.ZahteviZaPracenje.AddAsync(zahtev);
            await context.SaveChangesAsync();

            
            if (prijava)
            {
                zahtev.Prijava = true;
                zahtev.rezultat = await DodajRezultat(zahtev.ID);
                zahtev.rezultatID = zahtev.rezultatID;
            }
            else zahtev.Prijava = false;

            await context.SaveChangesAsync();
            return zahtev;
        }


        public async Task<string> PovuciZahtev(int zahtevID)
        {
            var zahtev = await NadjiPoslatZahtev(zahtevID);
            if (zahtev == null)
                return "Ne postoji zahtev sa ID-em " + zahtevID + ".";

            if (zahtev.Stanje != StanjeZahteva.Cekanje)
                return "Korisnik je već prihvatio zahtev i više se ne može povući. Možeš otpratiti korisnika. ";

            context.ZahteviZaPracenje.Remove(zahtev);
            await context.SaveChangesAsync();

            return "Zahtev je povučen.";
        }

        public async Task<ZahtevZaPracenje> PrihvatiZahtev(ZahtevZaPracenje zahtev)
        {
            if (zahtev.Stanje != StanjeZahteva.Cekanje)
                return null;

            zahtev.Stanje = StanjeZahteva.Ispunjen;
            zahtev.Zakljucen = DateTime.Now;

            DvaKorisnika par = new DvaKorisnika();
            par.pratilac = await context.Korisnici.FindAsync(zahtev.podnosilacID);
            par.pratilacID = zahtev.podnosilacID;
            par.pracen = await context.Korisnici.FindAsync(zahtev.pracenID);
            par.pracenID = zahtev.pracenID;
            await context.ParoviKorisnika.AddAsync(par);

            if (zahtev.Prijava) 
            {
                var rezultat = await RezultatPrimljenogZahteva(zahtev);
                rezultat.Poruka += "Zahtev za praćenje je prihvaćen "+ funkcije.DatumVremeToString(zahtev.Zakljucen) + 
                    ". Korisnik " + par.pratilac.Ime + " sada prati korisnika " + par.pracen.Ime + "." ;
            }

            await context.SaveChangesAsync();
            return zahtev;
        }

        public async Task<ZahtevZaPracenje> OdbijZahtev(ZahtevZaPracenje zahtev)
        {
            if (zahtev.Stanje != StanjeZahteva.Cekanje)
                return null;

            zahtev.Stanje = StanjeZahteva.Odbijen;
            zahtev.Zakljucen = DateTime.Now;

            if (zahtev.Prijava)
            {
                var rezultat = await RezultatPrimljenogZahteva(zahtev);
                var pracen = await context.Korisnici.FindAsync(zahtev.pracenID);
                var podnosilac = await context.Korisnici.FindAsync(zahtev.podnosilacID);
                rezultat.Poruka +=  "Korisnik " + pracen.Ime + " je " + funkcije.DatumVremeToString(zahtev.Zakljucen)
                    + " odbio zahtev za praćenje koji je poslao korisnik " + podnosilac.Ime + Environment.NewLine;
            }

            await context.SaveChangesAsync();
            return zahtev;
        }

        public async Task<string> Otrprati(int pracenID) 
        {
        
            if (! await Pracen(pracenID))
                return "Ne pratiš ovog korisnika.";

            var pracenje = await context.ParoviKorisnika.Where(par => par.pracenID == pracenID && par.pratilacID == funkcije.PrijavljenID()).FirstOrDefaultAsync();
            context.ParoviKorisnika.Remove(pracenje);
            await context.SaveChangesAsync();

            var pracen = await context.Korisnici.FindAsync(pracenje.pracenID);
            return "Više ne pratiš korisnika " + pracen.Ime + ".";
        }

        public async Task<string> ObrisiPratioca(int pratilacID) 
        {
            if (! await Pracen(pratilacID))
                return "Korisnik te ne prati.";

            var pracenje = await context.ParoviKorisnika.Where(par => par.pratilacID == pratilacID && par.pracenID == funkcije.PrijavljenID()).FirstOrDefaultAsync();
            context.ParoviKorisnika.Remove(pracenje);
            await context.SaveChangesAsync();

            var pratilac = await context.Korisnici.FindAsync(pracenje.pratilacID);
            return "Korisnik "+ pratilac.Ime + " te više ne prati.";
        }



        public async Task<ICollection<RezultatZahteva>> RezultatiZahteva()
        {
            var zahtevi = await context.ZahteviZaPracenje.Where(z => z.podnosilacID == funkcije.PrijavljenID()).OrderByDescending(d => d.Podnet).ToListAsync();
            if (zahtevi.Count == 0)
                return null;

            ICollection<RezultatZahteva> rezultati = new List<RezultatZahteva>();
            foreach (var z in zahtevi)
                rezultati.Add(await context.RezultatiZahteva.Where(r => r.zahtevID == z.ID).FirstOrDefaultAsync());

            return rezultati;
        }

        public async Task<RezultatZahteva> RezultatPoslatogZahteva(ZahtevZaPracenje zahtev)
        {
            var rezultat = await context.RezultatiZahteva.FindAsync(zahtev.rezultatID);
            if (rezultat == null)
                return null;

            return rezultat;
        }

        public async Task<RezultatZahteva> RezultatPrimljenogZahteva(ZahtevZaPracenje zahtev)
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
            rezultat.zPracenja = zahtev;
           
            var podnosilac = await context.Korisnici.FindAsync(zahtev.podnosilacID);
            var pracen = await context.Korisnici.FindAsync(zahtev.pracenID);

            string pozdrav = "";
            pozdrav = zahtev.Poruka.Trim();
            if (!pozdrav.Trim().Equals(String.IsNullOrEmpty) && !pozdrav.Equals("*"))
                pozdrav = "," + Environment.NewLine + " uz poruku: " + pozdrav + Environment.NewLine;
            else pozdrav = "." + Environment.NewLine;

            rezultat.Poruka = podnosilac.Ime + " podneo je zahtev za praćenje " + pracen.Ime + " " + funkcije.DatumVremeToString(zahtev.Podnet) 
                     + pozdrav + "Zahtev je na čekanju." + Environment.NewLine;

            await context.RezultatiZahteva.AddAsync(rezultat);
            await context.SaveChangesAsync();

            return rezultat;
        }

    }
}
