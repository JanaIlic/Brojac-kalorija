namespace API.Servisi
{
    public class DanServis : IDan
    {
        private DataContext context;
        public PomocneFunkcije funkcije;

        public DanServis(DataContext dc, IHttpContextAccessor hca) 
        {
              context = dc;
              funkcije = new PomocneFunkcije(hca);
        }


        public async Task<ICollection<Dan>> Dani()
        {
              return await context.Dani.Where(d => d.korisnikID == funkcije.PrijavljenID()).OrderByDescending(d => d.Datum).ToListAsync();
        }

        public async Task<Dan> Danas() 
        {
            var danas = await context.Dani.Where(dan => (dan.korisnikID == funkcije.PrijavljenID() && dan.Datum.Date.Equals(DateTime.Today))).FirstOrDefaultAsync();

            if (danas == null)
                return null;

            return danas;
        }

        public async Task<bool> JeLiDanas(int dID) 
        {
            bool jeste = false;
            var dan = await NadjiDan(dID);
            if(dan.Datum.Date == DateTime.Today)
                jeste = true;

            return jeste;
        }

        public async Task<Dan> NadjiDan(int id)
        {
            return await context.Dani.FindAsync(id);
            
        }

        public async Task<Dan> NadjiDanPoDatumu(int godina, int mesec, int dan)
        {
            var  d = await context.Dani.Where(d => d.Datum.Day.Equals(new DateTime(godina, mesec, dan).Day )
                            && (d.korisnikID == funkcije.PrijavljenID())).FirstOrDefaultAsync();
            if (d == null)
                    return null;
            

            return d; 
        }



        public async Task<string> DodajDan()
        {
            if (await Danas() != null)           
                  return "Već je unet dan sa današnjim datumom.";

            Dan d = new Dan();

            var korisnik = await context.Korisnici.FindAsync(funkcije.PrijavljenID());
            d.korisnik = korisnik;
            d.korisnikID = korisnik.ID;

            var prijava = false ;
            var juce = await context.Dani.Where(d => d.korisnikID == korisnik.ID).OrderBy(d => d.Datum).LastOrDefaultAsync();
            if (juce != null)
                prijava = juce.Prijava;

            d.Prijava = prijava;
            var stanja = await context.Stanja.Where(s => s.korisnikID == funkcije.PrijavljenID()).OrderBy(s => s.Datum).ToListAsync() ;
            var stanje = stanja.LastOrDefault();

            if (stanja == null || stanja.Count == 0 || stanje == null)
                d.Rezultat = 0;
            else
                d.Rezultat = -stanje.EnergetskePotrebe;


            await context.Dani.AddAsync(d);
            await context.SaveChangesAsync();
              
            if (d.Prijava)
               await DodajIzvestaj();

            return "Dan je dodat.";            
        }


        

        public async Task<Dan> UpisiRezultat()
        {
            var danas = await Danas();
            var stanje = await context.Stanja.Where(s => s.korisnikID == funkcije.PrijavljenID()).OrderBy(s => s.Datum).LastAsync();
            if (stanje == null)
                return null;

            if(danas.Rezultat == 0)
                danas.Rezultat = -stanje.EnergetskePotrebe;

            await context.SaveChangesAsync();
            return danas;
        } 

        public async Task<string> ObrisiDan(int id)
        {
            var dan = await context.Dani.FindAsync(id);
            if (dan == null)
                return "Izabrani dan ne postoji.";

            var obroci = await context.DaniObroci.Where(d => d.danID == id).ToListAsync();
            if(obroci != null)
                context.DaniObroci.RemoveRange(obroci);

            var treninzi = await context.DaniTreninzi.Where(d => d.danID == id).ToListAsync();
            if(treninzi != null)           
                context.DaniTreninzi.RemoveRange(treninzi);

            var izvestaj = await NadjiIzvestaj(id);
            if (izvestaj != null)
            {
                context.Izvestaji.Remove(izvestaj);
                await context.SaveChangesAsync();
                await DodajIzvestaj();
            }

            context.Dani.Remove(dan);
            await context.SaveChangesAsync();

            await DodajDan();
            await UpisiRezultat();

            return "Dan je resetovan.";
        }

        public string ProveriDatum(int godina, int mesec, int dan)
        {
            return funkcije.ProveriDatum(godina, mesec, dan);
        }

        public async Task<Dan> Iskljuci() 
        {
            var dan = await Danas();
            dan.Prijava = false;

            var izvestaj = await context.Izvestaji.FindAsync(dan.izvestajID);
            if (izvestaj != null)
                context.Izvestaji.Remove(izvestaj);

            await context.SaveChangesAsync();
            return dan;
        }

        public async Task<Dan> Ukljuci() 
        {
            var dan = await Danas();
            dan.Prijava = true;
            await context.SaveChangesAsync();

            var izvestaj = await DodajIzvestaj();
            return dan;
        }

        public async Task<Izvestaj> DodajIzvestaj()
        {
            var danas = await Danas();
            var stanje = await context.Stanja.Where(s => s.korisnikID == funkcije.PrijavljenID()).OrderBy(s => s.Datum).LastAsync();
            if (stanje == null)
                return null;

            Izvestaj i = await NadjiIzvestaj(danas.ID);
            if (i == null)
            {

                Izvestaj izvestaj = new Izvestaj("Izveštaj za " + funkcije.DatumToString(DateTime.Today) + Environment.NewLine + "Energetske potrebe: " + stanje.EnergetskePotrebe + " kcal " + Environment.NewLine);
                izvestaj.danID = danas.ID;
                izvestaj.dan = danas;

                await context.Izvestaji.AddAsync(izvestaj);
                await context.SaveChangesAsync();

                danas.izvestajID = (await context.Izvestaji.Where(i => i.danID == danas.ID).FirstOrDefaultAsync()).ID;
                await context.SaveChangesAsync();

                return izvestaj;
            }
            else
                return i;
        }

        public async Task<ICollection<Izvestaj>> Izvestaji()
        {
            var dani = await context.Dani.Where(d => d.korisnikID == funkcije.PrijavljenID()).OrderByDescending(dan => dan.Datum).ToListAsync();
            if (dani == null)
                return null;

            ICollection<Izvestaj> izvestaji = new List<Izvestaj>();
            foreach (var d in dani)
                izvestaji.Add(await context.Izvestaji.Where(i => i.danID == d.ID ).FirstOrDefaultAsync());

            if (izvestaji == null || izvestaji.Count == 0)
                return null;

            return izvestaji;
        }

        public async Task<ICollection<string>> PrikazIzvestaja() 
        {
            List<string> prikaz = new List<string>();
            var izvestaji = await Izvestaji();
            if (izvestaji == null || izvestaji.Count == 0)
                return null;

            foreach (var i in izvestaji)
            {
                if (i != null)
                  prikaz.Add(i.Poruka);
            }

            return prikaz;
        }


        public async Task<Izvestaj> NadjiIzvestaj(int danID)
        {
            var dan = await NadjiDan(danID);
            if (dan == null)
                return null;

            var izvestaj = await context.Izvestaji.Where(i => i.danID == danID).FirstOrDefaultAsync();
            if (izvestaj == null)
                return null; 

            return izvestaj;
        }

        public async Task<Izvestaj> DanasnjiIzvestaj() 
        {
            var danas = await Danas();
            var danasnji = await context.Izvestaji.Where(i => i.danID == danas.ID).FirstOrDefaultAsync();
            if (danasnji == null)
                return null;

            return (danasnji);
        }


        


    }
}
