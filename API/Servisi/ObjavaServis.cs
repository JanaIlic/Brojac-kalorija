namespace API.Servisi
{
    public class ObjavaServis : IObjava
    {
        private DataContext context;
        public PomocneFunkcije funkcije;
        public ObjavaServis(DataContext dc, IHttpContextAccessor hca)
        {
            context = dc;
            funkcije = new PomocneFunkcije(hca);
        }


        public async Task<ICollection<Objava>> Objave()
        {
            return await context.Objave.Where(o => o.autorID == funkcije.PrijavljenID() && o.glavnaID == null).OrderByDescending(o => o.Vreme).ToListAsync();
        }

        public async Task<ICollection<Objava>> VidljiveObjave()
        {
            var praceni = new List<int>();
            foreach (var pracen in await context.ParoviKorisnika.Where(par => par.pratilacID == funkcije.PrijavljenID()).ToListAsync())
                praceni.Add((int)pracen.pracenID);

            return await context.Objave.Where(o => (o.autorID == funkcije.PrijavljenID() || praceni.Contains(o.autorID)) && o.glavnaID == null).
                OrderByDescending(o => o.Vreme).ToListAsync();
        }

        public async Task<Objava> ObjavaPoIDu(int objavaID)
        {
            var objava = await context.Objave.Where(o => o.autorID == funkcije.PrijavljenID() && o.ID == objavaID).FirstOrDefaultAsync();
            if (objava == null)
                return null;

            return objava;
        }

        public async Task<Objava> ObjavaPracenog(int objavaID)
        {
            var objava = (await VidljiveObjave()).Where(o => o.ID == objavaID && o.glavnaID == null &&
                                                        o.autorID != funkcije.PrijavljenID()).FirstOrDefault();
            if (objava == null)
                return null;

            return objava;

        }

        public async Task<ICollection<Objava>> SveObjavePracenog(int korisnikID)
        {
            return (await VidljiveObjave()).Where(o => o.autorID == korisnikID).ToList();
        }

        public async Task<ICollection<Objava>> ObjavePoTekstu(string tekst) 
        {
            return await context.Objave.Where(o => o.autorID == funkcije.PrijavljenID() &&  
            (o.Tekst.Contains(tekst) || tekst.Contains(o.Tekst))).OrderBy(o => o.Vreme).ToListAsync();
        }


        public async Task<ICollection<Objava>> Komentari(Objava objava) 
        {
            return await context.Objave.Where(k => k.glavnaID == objava.ID).OrderBy(k => k.Vreme).ToListAsync();
        }


        public async Task<Objava> KomentarPratiocaNaObjavu(int objavaID) 
        {
            var komentar = await context.Objave.FindAsync(objavaID);
            if (komentar == null)
                return null;

            var glavna = await context.Objave.FindAsync(komentar.glavnaID);
            if (glavna == null)
                return null;

            if (glavna.autorID == funkcije.PrijavljenID())
                return komentar;

            else return null;
        }

        public async Task<Objava> KomentarPrijavljenog(int objavaID) 
        {
            var komentar = await context.Objave.FindAsync(objavaID);
            if (komentar == null )
                return null;

            if (komentar.autorID != funkcije.PrijavljenID())
                return null;

            return komentar;
        }


        public async Task<Ocena> OcenaNaObjavu(Objava objava) 
        {
            var ocena = await context.Ocene.Where(o => o.objavaID == objava.ID && o.korisnikID == funkcije.PrijavljenID()).FirstOrDefaultAsync();
            if (ocena == null)
                return null;

            return ocena;
        }

        public async Task<ICollection<Ocena>> Ocene(Objava objava) 
        {
            return await context.Ocene.Where(o => o.objavaID == objava.ID).ToListAsync();
        }

        public async Task<double> Prosek(Objava objava) 
        {
            double suma = 0;
            var ocene = await Ocene(objava);
            foreach (var o in ocene)
                suma += o.Vrednost;

            if(suma == 0)
                return 0;

            return Math.Round(suma/ocene.Count, 2);
        }

        public async Task<bool> ObjavaPrijavljenogKorisnika(Objava objava) 
        {
            var jeste = false;
            if(objava.autorID == funkcije.PrijavljenID())
                jeste = true;

            return jeste;
        }

        public async Task<ICollection<Korisnik>> AutoriObjava() 
        {
            var objave = await VidljiveObjave();
            List<Korisnik> autori = new List<Korisnik>();
            foreach (var objava in objave)
                autori.Add(await context.Korisnici.FindAsync(objava.autorID));

            return autori;
        }


        public async Task<ICollection<Korisnik>> AutoriKomentara(Objava objava) 
        {
            List<Korisnik> autori = new List<Korisnik>();
            foreach (var komentar in await Komentari(objava))
                autori.Add(await context.Korisnici.FindAsync(komentar.autorID));

            return autori;
        }

        public async Task<ICollection<Korisnik>> AutoriOcena(Objava objava) 
        {
            List<Korisnik> autori = new List<Korisnik>();
            foreach (var ocena in await Ocene(objava))
                autori.Add(await context.Korisnici.FindAsync(ocena.korisnikID));

            return autori;
        }

        public async Task<Objava> Objavi(string tekst) 
        {
            Objava objava = new Objava();
            objava.Tekst = funkcije.ParsirajUnos(tekst);
            objava.Vreme = DateTime.Now;
            objava.autorID = funkcije.PrijavljenID();
            objava.autor = await context.Korisnici.FindAsync(objava.autorID);

            await context.Objave.AddAsync(objava);
            await context.SaveChangesAsync();
            return objava;
        }


        public async Task<Objava> ObjaviSaSlikom(string tekst, string slika) 
        {
            Objava objava = new Objava();
            objava.Tekst = funkcije.ParsirajUnos(tekst);
            objava.Vreme = DateTime.Now;
            objava.autorID = funkcije.PrijavljenID();
            objava.autor = await context.Korisnici.FindAsync(objava.autorID);

            await context.Objave.AddAsync(objava);
            await context.SaveChangesAsync();

            if (!slika.Equals(String.IsNullOrEmpty))
                this.funkcije.UbaciSlikuObjave(slika, objava);
            objava.Slika = objava.ID.ToString() + Path.GetExtension(slika);
            await context.SaveChangesAsync();

            return objava;
        }

        public async Task<Objava> Komentarisi(Objava glavna, string tekst) 
        {
            Objava komentar = await Objavi(tekst);
            komentar.glavna = glavna;
            komentar.glavnaID = glavna.ID;

            await context.SaveChangesAsync();
            return komentar.glavna;
        }


        public async Task<Objava> Oceni(Objava objava, int vrednost) 
        {
            if (await OcenaNaObjavu(objava) != null) 
                await PromeniOcenu(objava, vrednost);
            
            else{
                Ocena ocena = new Ocena(vrednost, DateTime.Now);
                ocena.objava = objava;
                ocena.objavaID = objava.ID;
                ocena.korisnik = await context.Korisnici.FindAsync(funkcije.PrijavljenID());
                ocena.korisnikID = ocena.korisnik.ID;
                await context.Ocene.AddAsync(ocena);
            }

            await context.SaveChangesAsync();
            return objava;
        }

        public async Task<Objava> PrepraviObjavu(Objava objava, string tekst) 
        {
            objava.Tekst = funkcije.ParsirajUnos(tekst); 
            await context.SaveChangesAsync();

            return objava;
        }


        public async Task<Objava> PromeniOcenu(Objava objava, int vrednost)
        {
            var ocena = await OcenaNaObjavu(objava);
            if(ocena == null)
                return null;
            
            ocena.Vrednost = vrednost;
            await context.SaveChangesAsync();
            return objava;
        }


        public async Task<Objava> PovuciOcenu(Objava objava) 
        {
            var ocena = await OcenaNaObjavu(objava);
            if (ocena == null)
                return null; 

            context.Ocene.Remove(ocena);
            await context.SaveChangesAsync();
            return objava; 
        }

        public async Task<string> ObrisiObjavu(int objavaID) 
        {
            var objava = await ObjavaPoIDu(objavaID);
            if (objava == null)
                return string.Empty;


            if(objava.Slika != String.Empty)
                this.funkcije.ObrisiSLiku(@"..\..\Brojač Kalorija\Brojac\src\assets\slike-objava\" + objavaID.ToString());

            var komentari = await Komentari(objava);
            if (komentari.Count > 0)
                context.Objave.RemoveRange(komentari);

            var ocene = await Ocene(objava);
            if (ocene.Count > 0)
                context.Ocene.RemoveRange(ocene);

            context.Objave.Remove(objava);
            await context.SaveChangesAsync();
            return "Objava je obrisana.";
        }

        public async Task<ICollection<Objava>> ObrisiKomentar(int komentarID) 
        {
            var komentar = await KomentarPratiocaNaObjavu(komentarID);
            if (komentar == null) 
                komentar = await KomentarPrijavljenog(komentarID);

            var objava = await context.Objave.FindAsync(komentar.glavnaID);
            context.Objave.Remove(komentar);
            await context.SaveChangesAsync();

            return await Komentari(objava);
        }

        public async Task<string> ObrisiObjave() 
        {
            var objave = await Objave();
            if (objave.Count == 0)
                return "Ništa nije objavljeno.";

            foreach (var objava in objave) 
            {
                var komentari = await Komentari(objava);
                if (komentari.Count > 0)
                    context.Objave.RemoveRange(komentari);

                var ocene = await Ocene(objava);
                if (ocene.Count > 0)
                    context.Ocene.RemoveRange(ocene);
            }

            context.Objave.RemoveRange(objave);
            await context.SaveChangesAsync();
            return "Objave su obrisane.";
        }






    }
}
