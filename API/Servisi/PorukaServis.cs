namespace API.Servisi
{
    public class PorukaServis  : IPoruka
    {
        private DataContext context;
        public PomocneFunkcije funkcije;
        public PorukaServis(DataContext dc, IHttpContextAccessor hca) 
        {  
            context = dc;
            funkcije = new PomocneFunkcije(hca);
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

        public async Task<Poruka> NadjiPoslatuPoruku(int porukaID) 
        {
            var poruka = await context.Poruke.Where(p => p.autorID == funkcije.PrijavljenID() && p.ID == porukaID).FirstOrDefaultAsync();
            if (poruka == null)
                return null;

            return poruka;
        }


        public async Task<ICollection<Poruka>> PrimljenePoruke()
        {
              return await context.Poruke.Where(p => p.primalacID == funkcije.PrijavljenID()).ToListAsync();
        }

        public async Task<ICollection<Poruka>> PoslatePoruke()
        {
            return await context.Poruke.Where(p => p.autorID == funkcije.PrijavljenID()).ToListAsync();
        }

        public async Task<ICollection<Poruka>> Razgovor(Korisnik korisnik)
        {
            return await context.Poruke.Where(p => (p.primalacID == funkcije.PrijavljenID() && p.autorID == korisnik.ID )
            ||(p.autorID == funkcije.PrijavljenID() && p.primalacID == korisnik.ID ) ).OrderBy(p => p.Vreme).ToListAsync();
        }

        public async Task<ICollection<bool>> AutoriPoruka(Korisnik korisnik) 
        {
            List<bool>redosled = new List<bool>();
            var razgovor = await Razgovor(korisnik);
            if (razgovor != null)
                foreach (var r in razgovor)
                    if (r.autorID == funkcije.PrijavljenID())
                        redosled.Add(true);
                    else redosled.Add(false);

            return redosled;
        }


        public async Task<ICollection<Korisnik>> Sagovornici() 
        {
            List<Korisnik> sagovornici = new List<Korisnik>();
            var razgovori = await context.Poruke.Where(p => p.autorID == funkcije.PrijavljenID() 
                            || p.primalacID == funkcije.PrijavljenID()).OrderBy(p => p.Vreme).ToListAsync();

            foreach (var r in razgovori) 
            {
                var korisnik = new Korisnik();
                if (r.autorID == funkcije.PrijavljenID())
                    korisnik = await context.Korisnici.FindAsync(r.primalacID);
                else korisnik = await context.Korisnici.FindAsync(r.autorID);

                if (!sagovornici.Contains(korisnik))
                    sagovornici.Add(korisnik);
            }

            return sagovornici;
        }

        public async Task<Poruka> PosaljiPoruku(Korisnik korisnik, string tekst)
        {
            Poruka poruka = new Poruka(funkcije.ParsirajUnos(tekst) , DateTime.Now);
            poruka.autorID = funkcije.PrijavljenID();
            poruka.autor = await context.Korisnici.FindAsync(poruka.autorID);
            poruka.primalac = korisnik;
            poruka.primalacID = korisnik.ID;
            
            await context.Poruke.AddAsync(poruka);
            await context.SaveChangesAsync();
            return poruka;
        }

        public async Task<Poruka> PrepraviPoruku(int porukaID, string tekst) 
        {
            var poruka = await NadjiPoslatuPoruku(porukaID);
            if (poruka == null)
                return null;

            poruka.Tekst = funkcije.ParsirajUnos(tekst);
            await context.SaveChangesAsync();
            return poruka;
        }


        public async Task<string> ObrisiPoruku(int porukaID)
        {
            var poruka = await NadjiPoslatuPoruku(porukaID);
            if (poruka == null)
                return "Tražena poruka nije poslata.";

            context.Poruke.Remove(poruka);
            await context.SaveChangesAsync();
            return "Poruka je obrisana.";
        }

        public async Task<string> ObrisiRazgovor(Korisnik korisnik)
        {
            var razgovor = await Razgovor(korisnik);
            if(razgovor.Count == 0)
                return "Nema poruka razmenjenih sa korisnikom " + korisnik.Ime + ".";

            context.Poruke.RemoveRange(razgovor);
            await context.SaveChangesAsync();
            return "Razgovor sa korisnikom " + korisnik.Ime + " je obrisan.";
        }

        public async Task<string> ObrisiRazgovore() 
        {
            var sagovornici = await Sagovornici();
            foreach (var s in sagovornici)
                await ObrisiRazgovor(s);

            return "Svi razgovori su obrisani.";
        }
        public async Task<string> ObrisiPoslatePoruke() 
        {
            var poruke = await PoslatePoruke();
             context.Poruke.RemoveRange(poruke);
            await context.SaveChangesAsync();
            return "Sve poslate poruke su obrisane.";
        }


    }
}
