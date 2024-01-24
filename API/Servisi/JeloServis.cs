namespace API.Servisi
{
    public class JeloServis : IJelo
    {
        private DataContext context;
        public PomocneFunkcije funkcije;
        public JeloServis(DataContext dc, IHttpContextAccessor hca) 
        {
            context = dc; 
            funkcije = new PomocneFunkcije(hca);
        }

        public async Task<ICollection<Jelo>> Jela()
        {
            var jela =  await context.Jela.Where(j => j.korisnikID == funkcije.PrijavljenID()).ToListAsync();
            foreach (var jelo in jela) 
                jelo.namirnice = await context.JelaNamirnice.Where(jn => jn.jeloID == jelo.ID).ToListAsync();

            return jela;
        }

        public async Task<ICollection<Jelo>> JelaPoNazivu(string naziv)
        {
            return await context.Jela.Where(j => ((j.korisnikID == funkcije.PrijavljenID()) && 
            ((j.Naziv.Contains(naziv)) || (naziv.Contains(j.Naziv)))) ).ToListAsync();
        }

        public async Task<Jelo> JeloPoNazivu(string naziv)
        {
            return await context.Jela.Where(j => j.Naziv.Equals(naziv)).Where(j => j.korisnikID == funkcije.PrijavljenID()).FirstOrDefaultAsync();
        }

        public async Task<Jelo> JeloPoIDu(int id)
        {
            return await context.Jela.Where(j => (( j.korisnikID == funkcije.PrijavljenID()) && (j.ID == id) )).FirstOrDefaultAsync();
        }

        public async Task<Jelo> SkalirajJelo(Jelo j, double masa) 
        {
            Jelo jelo = new Jelo();

            jelo.ID = j.ID;
            jelo.Naziv = j.Naziv;
            jelo.Masa = masa;
            jelo.EnergetskaVrednost = Math.Round(j.EnergetskaVrednost * masa / j.Masa, 2);
            jelo.UgljeniHidrati = Math.Round(j.UgljeniHidrati * masa / j.Masa, 2);
            jelo.Protein = Math.Round(j.Protein * masa / j.Masa, 2);
            jelo.Mast = Math.Round(j.Mast * masa / j.Masa, 2);
            jelo.Recept = j.Recept;

            return jelo;
        }

        public async Task<ICollection<Namirnica>> NamirniceJela(Jelo jelo) 
        {
            List<Namirnica> namirnice = new List<Namirnica>();
            var jNamirnice = await context.JelaNamirnice.Where(jn => jn.jeloID == jelo.ID).ToListAsync();

            foreach (var jn in jNamirnice) 
            {
                var n = await context.Namirnice.FindAsync(jn.namirnicaID);

                double koef = jn.masa / 100;

                n.EnergetskaVrednost = Math.Ceiling(n.EnergetskaVrednost * koef);
                n.Protein = Math.Ceiling(n.Protein * koef);
                n.UgljeniHidrati = Math.Ceiling(n.UgljeniHidrati * koef);
                n.Mast = Math.Ceiling(n.Mast * koef);

                namirnice.Add(n);
            }



            return namirnice;
        }

        public async Task<double> MasaNamirniceUJelu(Jelo jelo, Namirnica namirnica) 
        {
            double masa = 0;
            var jn = await context.JelaNamirnice.Where(jn => jn.jeloID == jelo.ID && jn.namirnicaID == namirnica.ID).FirstOrDefaultAsync();
            if(jn != null)
                masa = jn.masa;

            return masa; 
        }

        public async Task<ICollection<double>> MaseNamirnicaUJelu(Jelo jelo) 
        {
            var jNamirnice = await context.JelaNamirnice.Where(jn => jn.jeloID == jelo.ID).ToListAsync();
            List<double> mase = new List<double>();
            foreach (var jn in jNamirnice)
                mase.Add(jn.masa);

            return mase;
        }


        public async Task<Jelo> DodajNovoJelo(string naziv)
        {
            Jelo jelo = new Jelo();
            jelo.Naziv = naziv;
            jelo.korisnikID = funkcije.PrijavljenID();
            jelo.korisnik = await context.Korisnici.FindAsync(funkcije.PrijavljenID());

            await context.Jela.AddAsync(jelo);
            await context.SaveChangesAsync();
            return jelo;
        }

        public async Task<Objava> ObjaviJelo(Jelo jelo)
        {
            Objava objava = new Objava();
            await NapisiRecept(jelo);
            objava.Tekst = jelo.Recept;
            objava.Vreme = DateTime.Now;
            objava.autorID = funkcije.PrijavljenID();
            objava.autor = await context.Korisnici.FindAsync(objava.autorID);

            await context.Objave.AddAsync(objava);
            await context.SaveChangesAsync();

            return objava;
        }



        public async Task<Jelo> PromeniNazivJela(Jelo jelo, string noviNaziv)
        {
            jelo.Naziv = noviNaziv;
            await context.SaveChangesAsync();
            return jelo;
        }

        public async Task<Jelo> DodajJeluNamirnicu(Jelo jelo, Namirnica namirnica, double masa, bool pre)
        {
            double koef = masa;
            if (pre)
                koef *= namirnica.PromenaMase;

            JeloNamirnica jn = new JeloNamirnica();
            jn.jelo = jelo;
            jn.jeloID = jelo.ID;
            jn.namirnica = namirnica;
            jn.namirnicaID = namirnica.ID;
            jn.masa = koef;

            jelo.Masa += Math.Ceiling(koef);
            koef = koef / 100;
            jelo.EnergetskaVrednost = Math.Round(jelo.EnergetskaVrednost + namirnica.EnergetskaVrednost * koef, 3);
            jelo.Protein = Math.Round(jelo.Protein + namirnica.Protein * koef, 3);
            jelo.UgljeniHidrati = Math.Round(jelo.UgljeniHidrati + namirnica.UgljeniHidrati * koef, 3);
            jelo.Mast = Math.Round(jelo.Mast + namirnica.Mast * koef, 3);

            await context.JelaNamirnice.AddAsync(jn);
            await context.SaveChangesAsync();

            return jelo;
        }


        public async Task<Jelo> PromeniMasuNamirnice(Jelo jelo, Namirnica namirnica, double masa)
        {
            var jn = await context.JelaNamirnice.Where(j => ((j.namirnicaID == namirnica.ID) && (j.jeloID == jelo.ID))).FirstOrDefaultAsync();
            if (jn == null) 
                return null;

             double koef =  (masa - jn.masa) / 100;

               jelo.EnergetskaVrednost = Math.Round(jelo.EnergetskaVrednost + namirnica.EnergetskaVrednost * koef, 3);
               jelo.Protein = Math.Round(jelo.Protein + namirnica.Protein * koef, 3);
               jelo.UgljeniHidrati = Math.Round(jelo.UgljeniHidrati + namirnica.UgljeniHidrati * koef, 3);
               jelo.Mast = Math.Round(jelo.Mast + namirnica.Mast * koef, 3);
               jelo.Masa = Math.Round(jelo.Masa + masa - jn.masa, 3);
               jn.masa = Math.Round(masa);

            await context.SaveChangesAsync();
            return jelo;
        }


        public async Task<Jelo> NapisiRecept(Jelo jelo) 
        {
            jelo.Recept = "Recept: " + jelo.Naziv + Environment.NewLine;

            var namirniceJela = await context.JelaNamirnice.Where(j => j.jeloID == jelo.ID).ToListAsync();
            if (namirniceJela.Count == 0)
                return null;

            foreach (var n in namirniceJela) 
            {
                var namirnica = await context.Namirnice.FindAsync(n.namirnicaID);
                var kcal = n.masa * namirnica.EnergetskaVrednost / 100;
                jelo.Recept += " - " + n.masa + " g " + namirnica.Naziv + " = " + kcal + " kcal" + Environment.NewLine;
            }

            jelo.Recept += "U " + jelo.Masa + " g ovog jela ima ukupno " + jelo.EnergetskaVrednost + " kcal.";

            await context.SaveChangesAsync();
            return jelo;
        }

        public async Task<Jelo> ObrisiNamirnicuIzJela(Jelo jelo, Namirnica namirnica)
        {
            var jn = await context.JelaNamirnice.Where(j => ((j.namirnicaID == namirnica.ID) && (j.jeloID == jelo.ID))).FirstOrDefaultAsync();
            if (jn == null)
                return null;

            double koef = jn.masa / 100;
            jelo.EnergetskaVrednost = Math.Round(jelo.EnergetskaVrednost - namirnica.EnergetskaVrednost * koef, 3);
            jelo.Protein = Math.Round(jelo.Protein - namirnica.Protein*koef, 3);
            jelo.UgljeniHidrati = Math.Round(jelo.UgljeniHidrati - namirnica.UgljeniHidrati, 3);
            jelo.Mast = Math.Round(jelo.Mast - namirnica.Mast, 3);
            jelo.Masa = Math.Round(jelo.Masa - jn.masa, 3);

            context.JelaNamirnice.Remove(jn);
            await context.SaveChangesAsync();
            return jelo;
        }

        public async Task<string> ObrisiJelo(int id)
        {
            var jelo = await context.Jela.FindAsync(id);
            if (jelo == null)
                return "Ne postoji traženo jelo.";

            var povezaneNamirnice = await context.JelaNamirnice.Where(jn => jn.jeloID == id).ToListAsync();
            context.JelaNamirnice.RemoveRange(povezaneNamirnice);

            var povezaniObroci = await context.ObrociJela.Where(o => o.jeloID == id).ToListAsync();
            context.ObrociJela.RemoveRange(povezaniObroci);

            context.Jela.Remove(jelo);
            await context.SaveChangesAsync();

            return "Jelo " + jelo.Naziv + " je obrisano.";
        }


    }
}
