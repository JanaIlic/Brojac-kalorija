using NuGet.Packaging;

namespace API.Servisi
{
    public class NamirnicaServis : INamirnica
    {
        private DataContext context;
        public NamirnicaServis(DataContext dc )
        {
            context = dc;
        }

        public async Task<Namirnica> DodajNamirnicu(Namirnica namirnica)
        {
            namirnica.admin = await context.AdministratoriNamirnica.FirstOrDefaultAsync();
            namirnica.adminID = namirnica.admin.ID;
            await context.Namirnice.AddAsync(namirnica);
            await context.SaveChangesAsync();

            return namirnica;
        }

        public async Task<ICollection<Namirnica>> NadjiNamirnicePoNazivu(string naziv)
        {
            return await context.Namirnice.Where(n => ((n.Naziv.Contains(naziv)) || (naziv.Contains(n.Naziv)))).ToListAsync();
        }

        public async Task<Namirnica> NadjiNamirnicuPoNazivu(string naziv)
        {
            return await context.Namirnice.Where(n => n.Naziv.Equals(naziv)).FirstOrDefaultAsync();
        }

        public async Task<Namirnica> NadjiNamirnicu(int id)
        {
            return await context.Namirnice.FindAsync(id);      
        }

        public async Task<ICollection<Namirnica>> Namirnice()
        {
            return await context.Namirnice.ToListAsync();
        }

        public async Task<string> ObrisiNamirnicu(int id)
        {
            var namirnica = await NadjiNamirnicu(id);
            if (namirnica == null)
                return "Ne postoji tražena namirnica.";

            context.Namirnice.Remove(namirnica);
            await context.SaveChangesAsync();

            return namirnica.Naziv + " je obrisana.";
        }

        public async Task<Namirnica> PromeniKoeficijentPromeneMase(Namirnica namirnica, double koeficijent)
        {
            namirnica.PromenaMase = koeficijent;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniEnergetskuVrednost(Namirnica namirnica, double energetskaVrednost)
        {
            namirnica.EnergetskaVrednost = energetskaVrednost;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniKolicinuBrasna(Namirnica namirnica, KolicinaBrasna brasno)
        {
            namirnica.DodatoBrasno = brasno;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniKolicinuMasti(Namirnica namirnica, KolicinaMasti dodataMast)
        {
            namirnica.DodataMast = dodataMast;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniMast(Namirnica namirnica, double m)
        {
            namirnica.Mast = m;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniNaziv(Namirnica namirnica, string naziv)
        {
            namirnica.Naziv = naziv;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniProtein(Namirnica namirnica, double protein)
        {
            namirnica.Protein = protein;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniTipObrade(Namirnica namirnica, TipObrade tip)
        {
            namirnica.Tip = tip;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniUgljeneHidrate(Namirnica namirnica, double uh)
        {
            namirnica.UgljeniHidrati = uh;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniVrstu(Namirnica namirnica, VrstaNamirnice vrsta)
        {
            namirnica.Vrsta = vrsta;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> PromeniOpis(Namirnica namirnica, string opis)
        {
            namirnica.Opis = opis;
            await context.SaveChangesAsync();
            return namirnica;
        }

        public async Task<Namirnica> SkalirajNamirnicu(Namirnica namirnica, double m) 
        {
            Namirnica n = namirnica;
            double koef = m / 100;

            n.EnergetskaVrednost = Math.Ceiling(namirnica.EnergetskaVrednost * koef);
            n.Protein = Math.Ceiling(namirnica.Protein * koef);
            n.UgljeniHidrati = Math.Ceiling(namirnica.UgljeniHidrati * koef);
            n.Mast = Math.Ceiling(namirnica.Mast * koef);
            return n;
        }

        public async Task<ICollection<Namirnica>> Filtriraj(int vrsta, int tip, int mast, int brasno)
        {
            ICollection<Namirnica> filter = await context.Namirnice.ToListAsync();

            if (vrsta != 9)
                filter = filter.Where(n => n.Vrsta == (VrstaNamirnice)vrsta).ToList();

            if (tip != 6)
                filter = filter.Where(n => n.Tip == (TipObrade)tip).ToList();

            if (mast != 3)
                filter = filter.Where(n => n.DodataMast == (KolicinaMasti)mast).ToList();

            if (brasno != 3)
                filter = filter.Where(n => n.DodatoBrasno == (KolicinaBrasna)brasno).ToList();

            return filter;
        }




        //za logger
        public async Task<Namirnica> UpisPrveNamirnice() 
        {
            var n = new Namirnica("prva namirnica", VrstaNamirnice.Meso, TipObrade.Pecena, 
                KolicinaBrasna.Bez, KolicinaMasti.Duboko, 350, 75, 4, 20, 0.75, "prva namirnica, za probu");

            n.admin = null;
            n.adminID  = null;

            await context.Namirnice.AddAsync(n);
            await context.SaveChangesAsync();

            return n;
        }


        public async Task UpisPrvihNamirnica()
        {
            var prva = await context.Namirnice.FirstOrDefaultAsync();
            await ObrisiNamirnicu(prva.ID);

            var namirniceZaUpis = new List<Namirnica>();

            namirniceZaUpis.AddRange(new Namirnica[] { new Namirnica("paprika", VrstaNamirnice.Povrce, TipObrade.Sveza,
                                            KolicinaBrasna.Bez, KolicinaMasti.Bez, 30, 2, 10, 0, 1, "somborka"),
                                    new Namirnica("jabuka", VrstaNamirnice.Voce, TipObrade.Sveza,
                                            KolicinaBrasna.Bez, KolicinaMasti.Bez, 52.1, 0.3, 14, 0.2, 1, "petrovača"),
                                    new Namirnica("pržena piletina", VrstaNamirnice.Meso, TipObrade.Przena,
                                                KolicinaBrasna.Pohovano, KolicinaMasti.Duboko, 262, 26.75, 3.18, 14.98, 0.67, "pileći batak pržen u tiganju"),
                                    new Namirnica("karfiol", VrstaNamirnice.Povrce, TipObrade.Kuvana,
                                                KolicinaBrasna.Bez, KolicinaMasti.Bez, 40, 1.9, 5, 0.3, 0.92, "kuvan karfiol"),
                                    new Namirnica("pečeno jaje", VrstaNamirnice.Meso, TipObrade.Pecena,
                                                KolicinaBrasna.Bez, KolicinaMasti.Bez, 143, 12.6, 0.9, 8.7, 0.91, "jaje na oko pečeno bez masti"),
                                    new Namirnica("banana", VrstaNamirnice.Voce, TipObrade.Sveza,
                                                KolicinaBrasna.Bez, KolicinaMasti.Bez, 88.7, 0.2, 17, 0.5, 1, "sveža banana"),
                                    new Namirnica("pljeskavica", VrstaNamirnice.Meso, TipObrade.Pecena,
                                                KolicinaBrasna.Bez, KolicinaMasti.Plitko, 350, 20, 10, 30, 0.78, "pljeskavica od mlevenog mesa pečena na malo ulja"),
                                    new Namirnica("kukuruz", VrstaNamirnice.Zitarica, TipObrade.Kuvana, KolicinaBrasna.Bez,
                                                KolicinaMasti.Bez, 112, 3.3, 22.6, 1.4, 1, "kuvani kukuruz šećerac"),
                                    new Namirnica("mandarina", VrstaNamirnice.Voce, TipObrade.Sveza, KolicinaBrasna.Bez,
                                                KolicinaMasti.Bez, 47, 0.7, 12, 0, 1, "sveža mandarina"),
                                    new Namirnica("kupus", VrstaNamirnice.Povrce, TipObrade.Sveza, KolicinaBrasna.Bez,
                                                KolicinaMasti.Bez, 24, 1.3, 6, 0.1, 1, "svež kupus, salata"),
                                    new Namirnica("kuvana šargarepa", VrstaNamirnice.Povrce, TipObrade.Kuvana, KolicinaBrasna.Bez,
                                                 KolicinaMasti.Bez, 17.6, 0.4, 4.1, 0.1, 0.89, "šagrarepa, obarena u slanoj vodi"),
                                    new Namirnica("pržen crni luk", VrstaNamirnice.Povrce, TipObrade.Przena, KolicinaBrasna.Bez,
                                                  KolicinaMasti.Plitko, 251, 4.5, 27.5, 13.5, 0.65, "crni luk, pržen u ulju"),
                                    new Namirnica("kuvan brokoli", VrstaNamirnice.Povrce, TipObrade.Kuvana, KolicinaBrasna.Bez,
                                                  KolicinaMasti.Bez, 21, 2.9, 2, 0.2, 1.11, "brokoli, skuvan u slanoj vodi"),
                                    new Namirnica("kuvana boranija", VrstaNamirnice.Povrce, TipObrade.Kuvana, KolicinaBrasna.Bez,
                                                    KolicinaMasti.Bez, 65.9, 0.8, 4.7, 5, 0.93, "boranija, skuvana u slanoj vodi"),
                                    new Namirnica("dinstane pečurke", VrstaNamirnice.Ostalo, TipObrade.Dinstana, KolicinaBrasna.Bez,
                                                    KolicinaMasti.Plitko, 121.2, 5.8, 8.7, 7.1, 0.81, "pečurke izdinstane na ulju"),
                                    new Namirnica("pomfrit", VrstaNamirnice.Povrce, TipObrade.Przena, KolicinaBrasna.Bez,
                                                KolicinaMasti.Duboko, 298.3, 3.3, 39, 14.9, 0.56, "pomfrit, krompir pržen u dubukom ulju ili na masti"),
                                    new Namirnica("pržena pastrmka", VrstaNamirnice.Meso, TipObrade.Przena, KolicinaBrasna.Sa,
                                                KolicinaMasti.Plitko, 195, 19.3, 0.5, 13, 0.58, "pastrmka, riba uvaljana u brašno, pa pržena na ulju"),
                                    new Namirnica("kuvan goveđi jezik", VrstaNamirnice.Meso, TipObrade.Kuvana, KolicinaBrasna.Bez,
                                                KolicinaMasti.Bez, 90, 16, 2, 12, 0.8, "goveđi jezik, kuvan u slanoj vodi, bez masti"),
                                    new Namirnica("pohovana piletina", VrstaNamirnice.Meso, TipObrade.Przena, KolicinaBrasna.Pohovano,
                                                KolicinaMasti.Duboko, 253, 16.6, 17.3, 12.6, 0.82, "pileće belo meso, pohovano u brašnu i jajima, pa prženo"),
                                    new Namirnica("kuvani krompir", VrstaNamirnice.Povrce, TipObrade.Kuvana, KolicinaBrasna.Bez, KolicinaMasti.Bez, 89, 2, 23, 0, 0.95, 
                                                "krompir skuvan u slanoj vodi")
                                     });

            foreach (var n in namirniceZaUpis) 
            {
                 n.admin = null;
                 n.adminID = null;
            }

            var pocetak = DateTime.Now;
            await context.Namirnice.AddRangeAsync(namirniceZaUpis);
            await context.SaveChangesAsync();
            var kraj = DateTime.Now;
            var t = (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Namirnice su upisane za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme upisa jedne namirnice iznosi "
                         + Math.Round((double)t / 20, 2) + " milisekundi." + Environment.NewLine);
        }




        public async Task PromenaPrvihNamirnica()
        {
            var sve = await context.Namirnice.ToListAsync();
            var zaPromenuOpisa = sve.Take(10);

            foreach (var n in sve) 
            {
                if(zaPromenuOpisa.Contains(n))
                    n.Opis += " - promenjen opis.";
                else n.PromenaMase = Math.Round(n.PromenaMase * 1.2, 2);
            }            

            var pocetak = DateTime.Now;
            await context.SaveChangesAsync();
            var kraj = DateTime.Now;
            var t = (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Namirnice su promenjene za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme promene jedne namirnice iznosi "
                         + Math.Round((double)t / 20, 2) + " milisekundi." + Environment.NewLine);
        }


        public async Task BrisanjePrvihNamirnica()
        {
            var namirniceZaBrisanje = await context.Namirnice.ToListAsync();

            var pocetak = DateTime.Now;
            context.Namirnice.RemoveRange(namirniceZaBrisanje);
            await context.SaveChangesAsync();
            var kraj = DateTime.Now;
            var t = (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Namirnice su obrisane za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme brisanja jedne namirnice iznosi "
                         + Math.Round((double)t / 20, 2) + " milisekundi." + Environment.NewLine);
        }

        
    }
}
