namespace API.Servisi
{
    public class AktivnostServis : IAktivnost
    {
        private DataContext context;
        public PomocneFunkcije funkcije;
        public AktivnostServis(DataContext dc, IHttpContextAccessor hca)
        {
            context = dc;
            funkcije = new PomocneFunkcije(hca);
        }

        public async Task<ICollection<Aktivnost>> Aktivnosti()
        {
            return await context.Aktivnosti.ToListAsync();
        }



        public async Task<Aktivnost> AktivnostPoIDu(int id)
        {
            return await context.Aktivnosti.FindAsync(id);
        }

        public async Task<ICollection<Aktivnost>> AktivnostiPoNazivu(string naziv)
        {
            return await context.Aktivnosti.Where(a => ((a.Naziv.Contains(naziv)) || (naziv.Contains(a.Naziv)))).ToListAsync();
        }

        public async Task<string> Potrosnja(Aktivnost aktivnost, int minuti) 
        {
            var stanje = await context.Stanja.Where(s => s.korisnikID == funkcije.PrijavljenID()).OrderBy(s => s.Datum).LastAsync();
            var mirovanje = stanje.BMR  * minuti / 1440 ;
            double proizvod = Math.Floor(mirovanje * aktivnost.NivoTezine);
       
            return "Za " + minuti + " minuta " + aktivnost.Naziv + " potrošićeš " + proizvod + " kcal, što je " + 
                Math.Floor(proizvod - mirovanje) + " više nego što bi za isto vreme u stanju mirovanja." ;
        }

        public async Task<Aktivnost> DodajAktivnost(string naziv, double nt)
        {
            Aktivnost aktivnost = new Aktivnost(naziv, nt);
            aktivnost.admin = await context.AdministratoriAktivnosti.FirstOrDefaultAsync();
            aktivnost.adminID = aktivnost.admin.ID;   
            await context.Aktivnosti.AddAsync(aktivnost);
            await context.SaveChangesAsync();

            return aktivnost;
        }

        public async Task<Aktivnost> PromeniNazivAktivnosti(Aktivnost aktivnost, string naziv)
        {
            aktivnost.Naziv = naziv;
            await context.SaveChangesAsync();

            return aktivnost;
        }

        public async Task<Aktivnost> PromeniTezinuAktivnosti(Aktivnost aktivnost, double nt)
        {
            aktivnost.NivoTezine = nt;
            await context.SaveChangesAsync();

            return aktivnost;
        }

        public async Task<string> ObrisiAktivnost(int id)
        {
            var aktivnost = await AktivnostPoIDu(id);
            if (aktivnost == null)
                return "Ne postoji tražena aktivnost.";

            context.Aktivnosti.Remove(aktivnost);
            await context.SaveChangesAsync();
            return "Aktivnost " + aktivnost.Naziv + " je obrisana.";
        }



        //za logger

        public async Task<Aktivnost> UpisPrveAktivnosti() 
        {
            // Aktivnost a = new Aktivnost("prva aktivnost", 1.5);



            var a = new Aktivnost("hodanje, lagana šetnja", 2.45);

            a.adminID = null;
            a.admin = null;

            await context.Aktivnosti.AddAsync(a);

            a = new Aktivnost("brzo hodanje uzbrdo", 6.6);
            a.adminID = null;
            a.admin = null;
            await context.Aktivnosti.AddAsync(a);

            a = new Aktivnost("čišćenje", 3.2);
            a.adminID = null;
            a.admin = null;
            await context.Aktivnosti.AddAsync(a);

            await context.SaveChangesAsync();

            return a;
        }

        public async Task UpisPrvihAktivnosti()
        {            
            List<Aktivnost> aktivnostiZaUpis = new List<Aktivnost>();

            aktivnostiZaUpis.AddRange(new Aktivnost[] { new Aktivnost("spavanje", 1),
                new Aktivnost("ležanje", 1.2), 
                new Aktivnost("mirno sedenje", 1.2),
                new Aktivnost("hodanje sa teretom", 3.75), 
                new Aktivnost("mirno stajanje", 1.4),
                new Aktivnost("hodanje, lagana šetnja", 2.45),
                new Aktivnost("brzo hodanje uzbrdo", 6.6),
                new Aktivnost("hodanje uzbrdo sa teretom", 6),
                new Aktivnost("čišćenje", 3.2),
                new Aktivnost("pranje suđa", 1.7),
                new Aktivnost("peglanje", 1.4),
                new Aktivnost("kuvanje", 1.8),
                new Aktivnost("kancelarijski rad", 1.6),
                new Aktivnost("rad na računaru", 2),
                new Aktivnost("stolarstvo", 3.5),
                new Aktivnost("cepanje drva", 4.1),
                new Aktivnost("ples", 4.8),
                new Aktivnost("lagana vožnja bicikla", 4.8),
                new Aktivnost("plivanje", 5.5),
                new Aktivnost("boks", 5.4)
                });

            foreach (var a in aktivnostiZaUpis) 
            {
                 a.adminID = null;
                 a.admin = null;
            }

            var prva = await context.Aktivnosti.FirstOrDefaultAsync();
            await ObrisiAktivnost(prva.ID);

            var pocetak = DateTime.Now;
            await context.Aktivnosti.AddRangeAsync(aktivnostiZaUpis);
            await context.SaveChangesAsync();
            var kraj = DateTime.Now;
            var t = (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Aktivnosti su upisane za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme upisa jedne aktivnosti iznosi "
                         + Math.Round((double)t / 20, 2) + " milisekundi." + Environment.NewLine);
        }


        public async Task PromenaPrvihAktivnosti()
        {
            var sve = await context.Aktivnosti.ToListAsync();
            var zaPromenuNaziva = sve.Take(10);

            foreach (var a in sve) 
            {
                if(zaPromenuNaziva.Contains(a))
                    a.Naziv += " - promenjen naziv";
                else a.NivoTezine = Math.Round(a.NivoTezine * 1.2, 2);
            }

            var pocetak = DateTime.Now;
            await context.SaveChangesAsync();
            var kraj = DateTime.Now;
            var t = (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Aktivnosti su promenjene za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme promene jedne aktivnosti iznosi "
                         + Math.Round((double)t / 20, 2) + " milisekundi." + Environment.NewLine);
        }

        public async Task BrisanjePrvihAktivnosti() 
        {
            var aktivnostiZaBrisanje = await context.Aktivnosti.ToListAsync();

            var pocetak = DateTime.Now;
            context.Aktivnosti.RemoveRange(aktivnostiZaBrisanje);
            await context.SaveChangesAsync();
            var kraj = DateTime.Now;
            var t = (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Aktivnosti su obrisane za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme brisanja jedne aktivnosti iznosi "
                         + Math.Round((double)t / 20, 2) + " milisekundi." + Environment.NewLine);
        }



    }
}
