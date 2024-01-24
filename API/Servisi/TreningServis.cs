namespace API.Servisi
{
    public class TreningServis : ITrening
    {
        private DataContext context;
        public PomocneFunkcije funkcije;
        public TreningServis(DataContext dc, IHttpContextAccessor hca) 
        { 
            context = dc; 
            funkcije = new PomocneFunkcije(hca);
        }

        public async Task<ICollection<Trening>> Treninzi()
        {   var treninzi = await context.Treninzi.Where(t => t.korisnikID == funkcije.PrijavljenID()).ToListAsync();
            foreach (Trening t in treninzi)
                t.aktivnosti = await context.TreninziAktivnosti.Where(ta => ta.treningID == t.ID).ToListAsync();

            return treninzi;
        }

        public async Task<Trening> TreningPoIDu(int id)
        {
            return await context.Treninzi.Where(t => ((t.korisnikID == funkcije.PrijavljenID()) && (t.ID == id))).FirstOrDefaultAsync();
        }

        public async Task<Trening> TreningPoNazivu(string naziv)
        {
            return await context.Treninzi.Where(t => ((t.korisnikID == funkcije.PrijavljenID()) && (t.Naziv.Equals(naziv)))).FirstOrDefaultAsync();
        }

        public async Task<ICollection<Trening>> TreninziPoNazivu(string naziv)
        {
            return await context.Treninzi.Where(t => ((t.korisnikID == funkcije.PrijavljenID()) &&
                ((t.Naziv.Contains(naziv)) || (naziv.Contains(t.Naziv))))).ToListAsync();
        }

        public async Task<double> VremeAktivnosti(Trening trening, Aktivnost aktivnost) 
        {
            var tAktivnost = await context.TreninziAktivnosti.Where(ta => ta.treningID == trening.ID && ta.aktivnostID == aktivnost.ID).FirstOrDefaultAsync();
            return tAktivnost.vreme;
        }

        public async Task<ICollection<Aktivnost>> AktivnostiTreninga(Trening trening) 
        {
            List<Aktivnost> aktivnosti = new List<Aktivnost>();
            var tAktivnosti = await context.TreninziAktivnosti.Where(ta => ta.treningID == trening.ID).ToListAsync();
            foreach (var t in tAktivnosti)
                aktivnosti.Add(await context.Aktivnosti.FindAsync(t.aktivnostID));

            return aktivnosti;
        }


        public async Task<ICollection<double>> VremenaAktivnosti(Trening trening)
        {
            List<double> vremena = new List<double>();
            var tAktivnosti = await context.TreninziAktivnosti.Where(ta => ta.treningID == trening.ID).ToListAsync();
            foreach (var t in tAktivnosti)
                vremena.Add(t.vreme);

            return vremena;
        }

        public async Task<ICollection<double>> PotrosnjePriAktivnostima(Trening trening) 
        {
            List<double> potrosnje = new List<double>();
            var stanje = await context.Stanja.Where(s => s.korisnikID == funkcije.PrijavljenID()).OrderBy(s => s.Datum).LastAsync();
            
            var tAktivnosti = (await VremenaAktivnosti(trening)).ToList();
            var aktivnosti = (await AktivnostiTreninga(trening)).ToList();

            for (int i = 0; i < aktivnosti.Count; i++)
            {
                var mirovanje = stanje.EnergetskePotrebe * tAktivnosti[i] / 1440;
                double proizvod = Math.Floor(mirovanje * aktivnosti[i].NivoTezine);
                potrosnje.Add(proizvod);
            }

            return potrosnje;
        }


        public async Task<bool> TreningVecDodatDanas(Trening trening) 
        {
            var dodat = false;
            var danas = await context.Dani.Where(dan => (dan.Datum.Date.Equals(DateTime.Today) &&
                    (dan.korisnikID == funkcije.PrijavljenID()))).FirstOrDefaultAsync();

            var danasnjiTreninzi = await context.DaniTreninzi.Where(t => t.danID == danas.ID && t.treningID == trening.ID).FirstOrDefaultAsync();
            if (danasnjiTreninzi != null)
                dodat = true;

            return dodat;
        }

        public async Task<ICollection<Trening>> DanasnjiTreninzi() 
        {
            var danas = await context.Dani.Where(dan =>  dan.Datum.Date.Equals(DateTime.Today) && dan.korisnikID == funkcije.PrijavljenID() ).FirstOrDefaultAsync();

            List<Trening> treninzi = new List<Trening>();
            var danasnjiTreninzi = await context.DaniTreninzi.Where(t => t.danID == danas.ID).ToListAsync();
            foreach (var dt in danasnjiTreninzi)
                treninzi.Add(await context.Treninzi.FindAsync(dt.treningID));


            return treninzi;
        }

        public async Task<ICollection<Trening>> TreninziDana(Dan d) 
        {
            var sviTreninziDana = await context.DaniTreninzi.Where(t => t.danID == d.ID).ToListAsync();
            List<int> treninzi = new List<int>();
            foreach (var t in sviTreninziDana)
                treninzi.Add(t.treningID);

            return await context.Treninzi.Where(t => treninzi.Contains(t.ID)).ToListAsync();
        }

        public async Task<Trening> DodajTrening(string naziv)
        {
            Trening trening = new Trening(naziv, 0);
            trening.NivoTezine = 0;
            trening.korisnikID = funkcije.PrijavljenID();
            trening.korisnik = await context.Korisnici.FindAsync(trening.korisnikID);
            await context.Treninzi.AddAsync(trening);
            await context.SaveChangesAsync();

            return trening;
        }

        public async Task<Trening> DodajDnevniTrening(Trening trening) 
        {
           var danas = await context.Dani.Where(dan => (dan.Datum.Date.Equals(DateTime.Today) &&
           (dan.korisnikID == funkcije.PrijavljenID()))).FirstOrDefaultAsync();
            if (danas == null)
                return null;

            DanTrening dt = new DanTrening();
            dt.dan = danas;
            dt.danID = danas.ID;
            dt.trening = trening;
            dt.treningID = trening.ID;       
            
            await context.DaniTreninzi.AddAsync(dt);    
            await context.SaveChangesAsync();

            var stanje = await context.Stanja.Where(s => s.korisnikID == funkcije.PrijavljenID()).OrderBy(s => s.Datum).LastAsync();
            if (stanje == null)
                return null;

            var potrosenje = await  PotrosnjePriAktivnostima(trening);
            double potroseno = 0;
            foreach (var p in potrosenje)
                potroseno += p;

            danas.Rezultat = Math.Round(danas.Rezultat - potroseno, 3);

            if (danas.Prijava)
            {
                var izvestaj = await context.Izvestaji.FindAsync(danas.izvestajID);
                izvestaj.Poruka += " · " + trening.Vreme + " min " + trening.Naziv + " = - " + potroseno + " kcal " + Environment.NewLine;
            }

            await context.SaveChangesAsync();


            return trening;
        }


        public async Task<Objava> ObjaviTrening(Trening trening)
        {
            Objava objava = new Objava();
            objava.Vreme = DateTime.Now;
            objava.autorID = funkcije.PrijavljenID();
            objava.autor = await context.Korisnici.FindAsync(objava.autorID);
            objava.Tekst = await OpisiTrening(trening);

            await context.AddAsync(objava);
            await context.SaveChangesAsync();
            return objava;
        }


        public async Task<Trening> PromeniNaziv(Trening trening, string naziv) 
        {
            trening.Naziv = naziv;
            await context.SaveChangesAsync();

            return trening;
        }

        public async Task<Trening> DodajAktivnostTreningu(Trening trening, Aktivnost aktivnost, int vreme)
        {
            if (await context.TreninziAktivnosti.Where(t => (t.treningID == trening.ID && t.aktivnostID == aktivnost.ID))
                .FirstOrDefaultAsync() != null)
                return null;

            double proizvod = trening.NivoTezine * trening.Vreme;
            proizvod += vreme * aktivnost.NivoTezine;
            trening.Vreme += vreme;
            trening.NivoTezine = Math.Round(proizvod / trening.Vreme, 3);

            TreningAktivnost ta = new TreningAktivnost();
            ta.trening = trening;
            ta.treningID = trening.ID;
            ta.aktivnost = aktivnost;
            ta.aktivnostID = aktivnost.ID;
            ta.vreme = vreme;

            await context.TreninziAktivnosti.AddAsync(ta);
            await context.SaveChangesAsync();

            return trening;
        }

        public async Task<Trening> PromeniVremeAktivnosti(Trening trening, Aktivnost aktivnost, int vreme)
        {
            var ta = await context.TreninziAktivnosti.Where(ta => (ta.treningID == trening.ID) && (ta.aktivnostID == aktivnost.ID)).FirstOrDefaultAsync();
            if (ta == null)
                return null;

            double proizvod = trening.NivoTezine * trening.Vreme;
            proizvod -= ta.vreme * aktivnost.NivoTezine;
            trening.Vreme -= ta.vreme;
            ta.vreme = vreme;
            trening.Vreme += vreme;
            proizvod += vreme * aktivnost.NivoTezine;
            trening.NivoTezine = Math.Round(proizvod / trening.Vreme, 3);

            await context.SaveChangesAsync();
            return trening;
        }


        public async Task<string> OpisiTrening(Trening trening) 
        {
            var stanje = await context.Stanja.Where(s => s.korisnikID == funkcije.PrijavljenID()).OrderBy(s => s.Datum).LastAsync();
            string opis = "Trening: " + trening.Naziv + " 🔥" + Environment.NewLine;

            var aktivnosti = await context.TreninziAktivnosti.Where(ta => ta.treningID == trening.ID).ToListAsync();
            if (aktivnosti.Count == 0)
                return "Niste dodali aktivnosti za ovaj trening.";

            foreach (var a in aktivnosti)
                opis += " - " + a.vreme + " minuta " + (await context.Aktivnosti.FindAsync(a.aktivnostID)).Naziv + Environment.NewLine;

            double potroseno = 0;
            foreach (var p in await PotrosnjePriAktivnostima(trening))
                potroseno += p;
            
            opis += " - Za " + trening.Vreme + " minuta biste potrošili " + potroseno + 
                " kcal više nego što biste u stanju mirovanja. " + Environment.NewLine;

            return opis;
        }


        public async Task<Trening> ObrisiAktivnostIzTreninga(Trening trening, Aktivnost aktivnost)
        {
            var ta = await context.TreninziAktivnosti.Where(ta => ((ta.treningID == trening.ID) && (ta.aktivnostID == aktivnost.ID))).FirstOrDefaultAsync();
            if (ta == null)
                return null;

            double proizvod = trening.NivoTezine * trening.Vreme; 
            proizvod -= ta.vreme * aktivnost.NivoTezine;
            trening.Vreme -= ta.vreme;
            trening.NivoTezine = Math.Round(proizvod / trening.Vreme, 3);

            context.TreninziAktivnosti.Remove(ta);
            await context.SaveChangesAsync();
            return trening;
        }

        public async Task<string> ObrisiTrening(int id)
        {
            var trening = await context.Treninzi.FindAsync(id);
            if (trening == null)
                return "Ne postoji traženi trening.";

            var aktivnosti = await context.TreninziAktivnosti.Where(ta => ta.treningID == id).ToListAsync();


            context.TreninziAktivnosti.RemoveRange(aktivnosti);
            await ObrisiDanasnjiTrening(id);
            context.Treninzi.Remove(trening);
            await context.SaveChangesAsync();

            return "Trening " + trening.Naziv + " je obrisan.";
        }


        public async Task<string> ObrisiDanasnjiTrening(int id) 
        {
            var trening = await context.Treninzi.FindAsync(id);
            if (trening == null)
                return "Ne postoji trening sa ID-em " + id + ".";


            var danas = await context.Dani.Where(dan => (dan.Datum.Date.Equals(DateTime.Today) &&
                        (dan.korisnikID == funkcije.PrijavljenID()))).FirstOrDefaultAsync();
            if (danas == null)
                return null;

            var dt = await context.DaniTreninzi.Where(dt => dt.danID == danas.ID && dt.treningID == id).FirstOrDefaultAsync();
            context.DaniTreninzi.Remove(dt);
            await context.SaveChangesAsync();

            var stanje = await context.Stanja.Where(s => s.korisnikID == funkcije.PrijavljenID()).OrderBy(s => s.Datum).LastAsync();
            if (stanje == null)
                return null;

            var potrosenje = await PotrosnjePriAktivnostima(trening);
            double potroseno = 0;
            foreach (var p in potrosenje)
                potroseno += p;

            danas.Rezultat = Math.Round(danas.Rezultat + potroseno, 3);

            if (danas.Prijava)
            {
                var izvestaj = await context.Izvestaji.FindAsync(danas.izvestajID);
                string izbaciti = " · " + trening.Vreme + " min " + trening.Naziv + " = - " + potroseno + " kcal " + Environment.NewLine;
                izvestaj.Poruka =  izvestaj.Poruka.Replace(izbaciti, "");
            }

            await context.SaveChangesAsync();



            return "Uklonili ste trening " + trening.Naziv + " iz današnjih treninga.";
        }



    }
}
