namespace API.Servisi
{
    public class ObrokServis : IObrok
    {
        private DataContext context;
        public PomocneFunkcije funkcije;

        public ObrokServis(DataContext dc, IHttpContextAccessor hca) 
        {
            context = dc;
            funkcije = new PomocneFunkcije(hca);
        }


        public async Task<ICollection<Obrok>> Obroci()
        {
            return await context.Obroci.Where(o => o.korisnikID == funkcije.PrijavljenID()).ToListAsync();
        }


        public async Task<Obrok> ObrokPoIDu(int id) 
        {
            var obrok = await context.Obroci.Where(o => ((o.korisnikID == funkcije.PrijavljenID()) && (o.ID == id))).FirstOrDefaultAsync();
            if(obrok == null)
                return null;

            return obrok;
        }


        public async Task<Obrok> ObrokPoNazivu(string naziv)
        {
            var obrok = await context.Obroci.Where(o => o.korisnikID == funkcije.PrijavljenID() && o.Naziv.Equals(naziv) ).FirstOrDefaultAsync();
            if (obrok == null)
                return null;

            return obrok;
        }


        public async Task<ICollection<Obrok>> ObrociPoNazivu(string naziv)
        {
            return await context.Obroci.Where(o => ( ( (o.Naziv.Contains(naziv)) || (naziv.Contains(o.Naziv))) 
            && (o.korisnikID == funkcije.PrijavljenID())) ).ToListAsync();
        }


        public async Task<ICollection<Obrok>> ObrociDana(Dan d)
        {
            var sviObrociDana = await context.DaniObroci.Where(o => o.danID == d.ID).ToListAsync();
            List<int> obrociIDs = new List<int>();
            foreach (var o in sviObrociDana)
                obrociIDs.Add(o.obrokID);

            var obroci = new List<Obrok>();
            foreach (var obrokID in obrociIDs)
                obroci.Add(await context.Obroci.FindAsync(obrokID));

            return obroci;
        }


        public async Task<bool> ObrokVecDodatDanas(Obrok obrok) 
        {
            var dodat = false;
            var danas = await context.Dani.Where(dan => (dan.Datum.Date.Equals(DateTime.Today) &&
                  (dan.korisnikID == funkcije.PrijavljenID()))).FirstOrDefaultAsync();
            var danasnjiObroci = await context.DaniObroci.Where(o => o.danID == danas.ID && o.obrokID == obrok.ID).FirstOrDefaultAsync();
            if (danasnjiObroci != null)
                dodat = true;

            return dodat;
        }

        public async Task<ICollection<Obrok>> DanasnjiObroci() 
        {
            var danas = await context.Dani.Where(dan => dan.Datum.Date.Equals(DateTime.Today) && dan.korisnikID == funkcije.PrijavljenID()).FirstOrDefaultAsync();

            List<Obrok> obroci = new List<Obrok>();
            var danasnjiObroci = await context.DaniObroci.Where(o => o.danID == danas.ID).ToListAsync();
            foreach (var d in danasnjiObroci)
                obroci.Add(await context.Obroci.FindAsync(d.obrokID));


            return obroci;
        }

        public async Task<Jelo> JeloObroka(Obrok o, Jelo j) 
        {
            Jelo jelo = new Jelo();
            var jo = await context.ObrociJela.Where(oj => oj.obrokID == o.ID && oj.jeloID == j.ID).FirstOrDefaultAsync();

            jelo.ID = j.ID;
            jelo.Naziv = j.Naziv;
            jelo.Masa = jo.masa;
            jelo.EnergetskaVrednost = Math.Ceiling(j.EnergetskaVrednost * jo.masa / j.Masa);
            jelo.UgljeniHidrati = Math.Ceiling(j.UgljeniHidrati * jo.masa / j.Masa);
            jelo.Protein = Math.Ceiling(j.Protein * jo.masa / j.Masa);
            jelo.Mast = Math.Ceiling(j.Mast * jo.masa / j.Masa);
            jelo.Recept = j.Recept;

            return jelo;
        }


        public async Task<ICollection<Jelo>> JelaObroka(Obrok o) 
        {
            List<Jelo> jela = new List<Jelo>();
            var jelaO = await context.ObrociJela.Where(oj => oj.obrokID == o.ID).ToListAsync();
            foreach (var oj in jelaO)
                jela.Add(await context.Jela.FindAsync(oj.jeloID));


            return jela;
        }

        public async Task<ICollection<double>> MaseJela(Obrok o) 
        {
            List<double> mase = new List<double>();
            foreach (var j in await context.ObrociJela.Where(oj => oj.obrokID == o.ID).ToListAsync())
                mase.Add((int)j.masa);

            return mase;
        }

        public async Task<ICollection<double>> EvJela(Obrok o) 
        {
            List<double> ev = new List<double>();
            var jela =  (await JelaObroka(o)).ToList();
            var mase = (await MaseJela(o)).ToList();
            for(int i = 0; i< jela.Count; i++)
                    ev.Add( Math.Round(jela[i].EnergetskaVrednost * mase[i] / jela[i].Masa, 2) );

            return ev;
        }

        public async Task<string> OpisiObrok(Obrok obrok) 
        {
            string opis = "Obrok " + obrok.Naziv + " sadrži: " + Environment.NewLine;
            var jela = (await JelaObroka(obrok)).ToList();
            var mase = (await MaseJela(obrok)).ToList();
            var vrednosti = (await EvJela(obrok)).ToList();

            for (int i = 0; i < jela.Count; i++)
                opis += "- " + mase[i] + " g " + jela[i].Naziv + " = " + vrednosti[i] + " kcal " + Environment.NewLine;

            opis += "- Ukupna masa: " + obrok.Masa + " g, od čega su: " + Environment.NewLine;
            opis +=  "  " + obrok.Protein + "g protein, " + obrok.UgljeniHidrati + " g ugljeni hidrati i " + obrok.Mast + " g masti." + Environment.NewLine;
            opis += "- Energetska vrednost iznosi: " + obrok.EnergetskaVrednost + " kcal.";

            return opis;
        }

        public async Task<Obrok> DodajObrok(string naziv)
        {
            Obrok obrok = new Obrok();
            obrok.Naziv = naziv;
            obrok.korisnikID = funkcije.PrijavljenID();
            obrok.korisnik = await context.Korisnici.FindAsync(obrok.korisnikID);

            await context.Obroci.AddAsync(obrok);
            await context.SaveChangesAsync();

            return obrok;
        }



        public async Task<Obrok> DodajObrokDanas(Obrok obrok)
        {
            var danas = await context.Dani.Where(dan => (dan.korisnikID == funkcije.PrijavljenID() && dan.Datum.Date.Equals(DateTime.Today))).FirstOrDefaultAsync();
            if (danas == null)
                return null;

            DanObrok danObroka = new DanObrok();
            danObroka.obrok = obrok;
            danObroka.obrokID = obrok.ID;
            danObroka.dan = danas;
            danObroka.danID = danas.ID;

            danas.Rezultat = Math.Round(danas.Rezultat + obrok.EnergetskaVrednost, 3);
            if (danas.Prijava)
            {
                var izvestaj = await context.Izvestaji.FindAsync(danas.izvestajID);
                izvestaj.Poruka += " · " + obrok.Masa + " g " + obrok.Naziv + " = " + obrok.EnergetskaVrednost + " kcal " + Environment.NewLine;
            }

            await context.DaniObroci.AddAsync(danObroka);
            await context.SaveChangesAsync();
            return obrok;
        }


        public async Task<Objava> ObjaviObrok(Obrok obrok)
        {
            Objava objava = new Objava();
            objava.Vreme = DateTime.Now;
            objava.autorID = funkcije.PrijavljenID();
            objava.autor = await context.Korisnici.FindAsync(objava.autorID);
            objava.Tekst = await OpisiObrok(obrok);

            await context.Objave.AddAsync(objava);
            await context.SaveChangesAsync();
            return objava;
        }

        public async Task<Obrok> PromeniNaziv(Obrok obrok, string naziv)
        {
            obrok.Naziv = naziv;
            await context.SaveChangesAsync();

            return obrok;
        }


        public async Task<Obrok> PromeniMasuObroka(Obrok obrok, double masa)
        {
            double koef = masa / obrok.Masa;
            obrok.Masa = Math.Round(masa, 3);
            obrok.EnergetskaVrednost = Math.Round(obrok.EnergetskaVrednost * koef, 3);
            obrok.Protein = Math.Round(obrok.Protein * koef, 3);
            obrok.Mast = Math.Round(obrok.Mast * koef, 3);
            obrok.UgljeniHidrati = Math.Round(obrok.UgljeniHidrati * koef, 3);

            await context.SaveChangesAsync();
            return obrok;
        }


        public async Task<Obrok> DodajJeloObroku(Obrok obrok, Jelo jelo, double masa)
        {
            if (await context.ObrociJela.Where(oj => ((obrok.ID == oj.obrokID) && (jelo.ID == oj.jeloID))).FirstOrDefaultAsync() != null)
                return null;  

            double koef = masa / jelo.Masa;
            obrok.Masa = Math.Round(obrok.Masa + masa, 3);
            obrok.EnergetskaVrednost = Math.Round( obrok.EnergetskaVrednost + jelo.EnergetskaVrednost * koef, 3);
            obrok.Protein = Math.Round( obrok.Protein + jelo.Protein * koef, 3);
            obrok.Mast = Math.Round(obrok.Mast + jelo.Mast * koef, 3);
            obrok.UgljeniHidrati = Math.Round(obrok.UgljeniHidrati + jelo.UgljeniHidrati * koef, 3);

            ObrokJelo oj = new ObrokJelo();
            oj.obrokID = obrok.ID;
            oj.obrok = obrok;
            oj.jeloID = jelo.ID;
            oj.jelo = jelo;
            oj.masa = masa;

            await context.ObrociJela.AddAsync(oj);
            await context.SaveChangesAsync();

            return obrok;   
        }


        public async Task<Obrok> PromeniMasuJela(Obrok obrok, Jelo jelo, double masa)
        {
            var oj = await context.ObrociJela.Where(j => ((obrok.ID == j.obrokID) && (jelo.ID == j.jeloID))).FirstOrDefaultAsync();
            if (oj == null)
                return null;

            obrok.Masa = Math.Round(obrok.Masa - oj.masa, 3);
            double koef = oj.masa / jelo.Masa;
            obrok.EnergetskaVrednost = Math.Round(obrok.EnergetskaVrednost - jelo.EnergetskaVrednost * koef, 3);
            obrok.Protein = Math.Round(obrok.Protein - jelo.Protein * koef, 3);
            obrok.Mast = Math.Round(obrok.Mast - jelo.Mast * koef, 3);
            obrok.UgljeniHidrati = Math.Round(obrok.UgljeniHidrati - jelo.UgljeniHidrati * koef, 3);

            koef = masa / jelo.Masa;
            obrok.Masa = Math.Round(obrok.Masa + masa, 3);
            obrok.EnergetskaVrednost = Math.Round(obrok.EnergetskaVrednost + jelo.EnergetskaVrednost * koef, 3);
            obrok.Protein = Math.Round(obrok.Protein + jelo.Protein * koef, 3);
            obrok.Mast = Math.Round(obrok.Mast + jelo.Mast * koef, 3);
            obrok.UgljeniHidrati = Math.Round(obrok.UgljeniHidrati + jelo.UgljeniHidrati * koef, 3);

            oj.masa = Math.Round(masa, 3);

            await context.SaveChangesAsync();
            return obrok;
        }


        public async Task<Obrok> ObrisiJeloIzObroka(Obrok obrok, Jelo jelo)
        {
            var oj = await context.ObrociJela.Where(j => (obrok.ID == j.obrokID && jelo.ID == j.jeloID)).FirstOrDefaultAsync();
            if (oj == null)
                return null;

            obrok.Masa = Math.Round(obrok.Masa - oj.masa, 3);
            double koef = oj.masa / jelo.Masa;
            obrok.EnergetskaVrednost = Math.Round(obrok.EnergetskaVrednost - jelo.EnergetskaVrednost * koef, 3);
            obrok.Protein = Math.Round(obrok.Protein - jelo.Protein * koef, 3);
            obrok.Mast = Math.Round(obrok.Mast - jelo.Mast * koef, 3);
            obrok.UgljeniHidrati = Math.Round(obrok.UgljeniHidrati - jelo.UgljeniHidrati * koef, 3);

            context.ObrociJela.Remove(oj);
            await context.SaveChangesAsync();
            return obrok;
        }


        public async Task<string> ObrisiObrok(int id)
        {
            var obrok = await context.Obroci.FindAsync(id);
            if (obrok == null)
                return "Ne postoji traženi obrok.";

            var jela = await context.ObrociJela.Where(j => j.obrokID == id).ToListAsync();
            var dani = await context.DaniObroci.Where(d => d.obrokID == id).ToListAsync();

            context.ObrociJela.RemoveRange(jela);
            context.DaniObroci.RemoveRange(dani);
            context.Obroci.Remove(obrok);
            await context.SaveChangesAsync();

            return "Obrok " + obrok.Naziv + " je obrisan.";
        }


        public async Task<string> ObrisiObrokDanas(int id) 
        {
            var obrok = await context.Obroci.FindAsync(id);
            if (obrok == null)
                return "Ne postoji traženi obrok.";

            var danas = await context.Dani.Where(dan => (dan.korisnikID == funkcije.PrijavljenID() && dan.Datum.Date.Equals(DateTime.Today))).FirstOrDefaultAsync();
            if (danas == null)
                return null;

            DanObrok danObroka = await context.DaniObroci.Where(dob => dob.danID == danas.ID && dob.obrokID == id).FirstOrDefaultAsync();

            context.DaniObroci.Remove(danObroka);
            await context.SaveChangesAsync();

            danas.Rezultat -= obrok.EnergetskaVrednost;
            if (danas.Prijava)
            {
                var izvestaj = await context.Izvestaji.FindAsync(danas.izvestajID);
                var izbaciti = " · " + obrok.Masa + " g " + obrok.Naziv + " = " + obrok.EnergetskaVrednost + " kcal " + Environment.NewLine;
                izvestaj.Poruka = izvestaj.Poruka.Replace(izbaciti, "");
            }

            await context.SaveChangesAsync();

            return "Obrok " + obrok.Naziv + " je uklonjen iz današnjih obroka." ;
        }





    }
}
