namespace API.Servisi
{
    public class NalogServis : INalog
    {
        private DataContext context;
        private readonly IConfiguration configuration;
        public PomocneFunkcije funkcije;
        public NalogServis(DataContext dc, IConfiguration c, IHttpContextAccessor hca) 
        {
            context = dc;
            configuration = c;
            funkcije = new PomocneFunkcije(hca);
        }


        public string NapraviToken(Nalog nalog)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, nalog.Ime),
                new Claim(ClaimTypes.NameIdentifier, nalog.ID.ToString()),
                new Claim(ClaimTypes.Role, nalog.Uloga.ToString())
            };

            var kljuc = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings:Token").Value));
            var cred = new SigningCredentials(kljuc, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: cred);
         
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }


        public async Task<string> Prijava(string ime, string sifra)
        {
            string token = string.Empty;
            Korisnik nalog = await KorisnikPoImenu(ime);

            if (nalog == null)
                return("Uneto je pogrešno ime. Ne postoji korisnik sa imenom " + ime + ".");

            if (!funkcije.ProveriSifru(sifra, nalog.Sifra, nalog.Kljuc))
                return("Uneta je pogrešna šifra.");

            token = NapraviToken(nalog);
            return token;
        }

        public async Task<string> PrijavaAdminaAA(string ime, string sifra) 
        {
            Nalog nalog = null;
            string token = string.Empty;

            if ((await AdministratorAktivnosti()).Ime == ime)
                nalog = await AdministratorAktivnosti();

            if (nalog == null)
                return ("Ne postoji administrator aktivnosti sa imenom " + ime + ".");

            if (!funkcije.ProveriSifru(sifra, nalog.Sifra, nalog.Kljuc))
                return ("Uneta je pogrešna šifra.");

            token = NapraviToken(nalog);

            return token;
        }

        public async Task<string> PrijavaAdminaAN(string ime, string sifra)
        {
            Nalog nalog = null;
            string token = string.Empty;

            if ((await AdministratorNamirnica()).Ime == ime)
                nalog = await AdministratorNamirnica();
     

            if (nalog == null)
                return ("Ne postoji administrator namirnica sa imenom " + ime + ".");

            if (!funkcije.ProveriSifru(sifra, nalog.Sifra, nalog.Kljuc))
                return ("Uneta je pogrešna šifra.");

            token = NapraviToken(nalog);

            return token;
        }



        public int PrijavljenID()
        {
            return funkcije.PrijavljenID();
        }

        public string Prijavljen() 
        {
            return funkcije.Prijavljen();
        }


        public async Task<string> PrijavljenUloga() 
        {
            return funkcije.PrijavljenUloga();
        }
        public async Task<ICollection<Korisnik>> Korisnici()
        {         
            var korisnici = await context.Korisnici.ToListAsync();
            if (korisnici.Count() == 0)
                return null;

            return korisnici;
        }

        public async Task<AdministratorNamirnica> AdministratorNamirnica() 
        {          
            var admin = await context.AdministratoriNamirnica.FirstOrDefaultAsync();           
            if (admin == null)
                return null;

            return admin;
        }

        public async Task<AdministratorAktivnosti> AdministratorAktivnosti()
        {
            var admin = await context.AdministratoriAktivnosti.FirstOrDefaultAsync();
            if (admin == null)
                return null;

            return admin;
        }

        public async Task<string> Registracija(string ime, string unetaSifra, int godina, int mesec, int dan, PolKorisnika pol, string slika)
        {
            if ((await KorisnikPoImenu(ime) != null) || ((await AdministratorAktivnosti()).Ime.Equals(ime))
            || ((await AdministratorNamirnica()).Ime.Equals(ime)))
                    return "Ime " + ime + " je već zauzeto. Izaberi drugo."; 


            byte[] kljuc;
            byte[] sifra;
            funkcije.SifraHash(unetaSifra, out sifra, out kljuc);

            string info = funkcije.ProveriDatumRodjenja(godina, mesec, dan);
            if (info != String.Empty)
                return (info);

            DateTime dr = new DateTime(godina, mesec, dan);               
           
            Korisnik korisnik = new Korisnik(ime, sifra, kljuc, dr, pol, slika);
            await context.Korisnici.AddAsync(korisnik);
            await context.SaveChangesAsync();

            if (slika != String.Empty && slika != "*")
                this.funkcije.UbaciProfilnuSliku(slika, korisnik);
            await context.SaveChangesAsync();
           
            return "Korisnik " + korisnik.Ime + " je uspešno registrovan.";
        }

        public int PonudiBrDana(int mesec)
        {
            return this.funkcije.PonudiBrDana(mesec);
        }

        /*  public async Task<string> RegistracijaAdmina(string ime, string unetaSifra, UlogaNaloga uloga)
          {

              byte[] kljuc;
              byte[] sifra;
              funkcije.SifraHash(unetaSifra, out sifra, out kljuc);

              if (uloga == UlogaNaloga.AdministratorAktivnosti)
              {
                  AdministratorAktivnosti aa = new AdministratorAktivnosti(ime, sifra, kljuc);
                  aa.Uloga = UlogaNaloga.AdministratorAktivnosti;
                  await context.AdministratoriAktivnosti.AddAsync(aa);
                  await context.SaveChangesAsync();
                  return("Administrator aktivnosti, "+ aa.Ime + " je uspešno registrovan.");
              }
              else
              {
                  AdministratorNamirnica an = new AdministratorNamirnica(ime, sifra, kljuc);
                  an.Uloga = UlogaNaloga.AdministratorNamirnica;
                  await context.AdministratoriNamirnica.AddAsync(an);
                  await context.SaveChangesAsync();
                  return ("Administrator namirnica, " + an.Ime + " je uspešno registrovan.");
              }
          } */

        public async Task<Korisnik> KorisnikPoID(int id)
        {
            var korisnik = await context.Korisnici.FindAsync(id);

            if (korisnik == null)
                return null;

            return korisnik;
        }

        public async Task<Korisnik> KorisnikPoImenu(string ime) 
        {
            var korisnici = await context.Korisnici.Where(k => k.Ime.Equals(ime)).ToListAsync();

            if (korisnici.Count() == 0)
                return null;
            else return  korisnici.FirstOrDefault();            
        }
        public async Task<ICollection<Korisnik>> KorisniciPoImenu(string ime)
        {
            ICollection<Korisnik> korisnici = await context.Korisnici.Where(k => ( k.Ime.Contains(ime) || ime.Contains(k.Ime))
                                                                                && k.ID != PrijavljenID()).ToListAsync(); 
            if (korisnici == null)
                return null;

            return korisnici;
        }


        public async Task<ICollection<Korisnik>> Pratioci() 
        {
            var parovi = await context.ParoviKorisnika.Where(par => par.pracenID == PrijavljenID()).ToListAsync();
            ICollection<Korisnik> pratioci = new List<Korisnik>();
            foreach (var par in parovi)
                pratioci.Add(await KorisnikPoID((int)par.pratilacID));

            return pratioci;
        }

        public async Task<ICollection<Korisnik>> Praceni()
        {
            var parovi = await context.ParoviKorisnika.Where(par => par.pratilacID== PrijavljenID()).ToListAsync();
            ICollection<Korisnik> praceni = new List<Korisnik>();
            foreach (var par in parovi)
                praceni.Add(await KorisnikPoID((int)par.pracenID));

            return praceni;
        }

        public async Task<bool> Pracen(Korisnik k) 
        {
            bool pratim = false;
            var par = await context.ParoviKorisnika.Where(par => par.pratilacID == PrijavljenID() && par.pracenID == k.ID).FirstOrDefaultAsync();
            if (par != null)
                pratim = true;

            return pratim;
        }

        public async Task<bool> Pratilac(Korisnik k)
        {
            bool prati = false;
            var par = await context.ParoviKorisnika.Where(par => par.pracenID == PrijavljenID() && par.pratilacID == k.ID).FirstOrDefaultAsync();
            if (par != null)
                prati = true;

            return prati;
        }

        public async Task<Korisnik> PromeniIme(string novoIme)
        {
            Korisnik korisnik = await context.Korisnici.FindAsync(funkcije.PrijavljenID());

            korisnik.Ime = novoIme;
            await context.SaveChangesAsync();           

            return korisnik;
        }

        public async Task<Nalog> PromeniImeAdmina(string novoIme) 
        {
            Nalog admin;

                if (funkcije.PrijavljenUloga().Equals(UlogaNaloga.AdministratorAktivnosti.ToString()))
                    admin = await AdministratorAktivnosti();
                else 
                    admin = await AdministratorNamirnica();

            admin.Ime = novoIme;
            await context.SaveChangesAsync();

            return admin;
        }


        public async Task<Korisnik> PromeniSifru(string novaSifra)
        {
             if (String.IsNullOrEmpty(novaSifra))
                    return null;

             byte[] kljuc;
             byte[] sifra;
             funkcije.SifraHash(novaSifra, out sifra, out kljuc);

             Korisnik korisnik = await context.Korisnici.FindAsync(funkcije.PrijavljenID());
             korisnik.Sifra = sifra;
             korisnik.Kljuc = kljuc;
             await context.SaveChangesAsync();

            return korisnik;
        }

        public async Task<Nalog> PromeniSifruAdmina(string novaSifra) 
        {
            Nalog admin;

            if (funkcije.PrijavljenUloga().Equals(UlogaNaloga.AdministratorNamirnica.ToString()))
                admin = await AdministratorNamirnica();
            else
                admin = await AdministratorAktivnosti();

            byte[] kljuc;
            byte[] sifra;
            funkcije.SifraHash(novaSifra, out sifra, out kljuc);
            admin.Sifra = sifra;
            admin.Kljuc = kljuc;
            await context.SaveChangesAsync();

            return admin;
        }



        public async Task<Korisnik> PromeniSliku(string slika)
        {
            Korisnik korisnik = await context.Korisnici.FindAsync(funkcije.PrijavljenID()) ;
            funkcije.UbaciProfilnuSliku(slika, korisnik);

            await context.SaveChangesAsync();
            return korisnik;
        }



        public async Task<string> PromeniDatumRodjenja( int godina, int mesec, int dan)
        {
             string info = funkcije.ProveriDatumRodjenja(godina, mesec, dan);
             if (info != String.Empty)
                return info;

             DateTime dr = new DateTime(godina, mesec, dan);
             var korisnik = await context.Korisnici.FindAsync(funkcije.PrijavljenID());
             korisnik.DatumRodjenja = dr;
             await context.SaveChangesAsync();

             return "Datum rođenja je uspešno promenjen na " + dr.ToString();
        }

        public async Task<string> ObrisiKorisnika()
        {
            var korisnik = await context.Korisnici.FindAsync(funkcije.PrijavljenID());
            if (korisnik == null)
                return "Korisnik ne postoji.";

            this.funkcije.ObrisiSLiku(@"..\..\Brojač Kalorija\Brojac\src\assets\" + korisnik.ID.ToString());

            var stanja = await context.Stanja.Where(s => s.korisnikID == korisnik.ID).ToListAsync();
            var dani = await context.Dani.Where(dan => dan.korisnikID == korisnik.ID).ToListAsync();
            var jela = await context.Jela.Where(j => j.korisnikID == korisnik.ID).ToListAsync();
            var obroci = await context.Obroci.Where(o => o.korisnikID == korisnik.ID).ToListAsync();
            var treninzi = await context.Treninzi.Where(t => t.korisnikID == korisnik.ID).ToListAsync();
            var objave = await context.Objave.Where(o => o.autorID == korisnik.ID).ToListAsync();
            var ocene = await context.Ocene.Where(o => o.korisnikID == korisnik.ID).ToListAsync();
            var poruke = await context.Poruke.Where(p => p.autorID == korisnik.ID || p.primalacID == korisnik.ID ).ToListAsync();

            var zahteviA = await context.ZahteviAktivnosti.Where(z => z.podnosilacID == korisnik.ID).ToListAsync();
            foreach (var z in zahteviA) 
            {
                var zA = await context.ZahtevaneAktivnosti.Where(za => za.zahtevID == z.ID).FirstOrDefaultAsync();
                if (zA != null)
                    context.ZahtevaneAktivnosti.Remove(zA);

                await context.SaveChangesAsync();
            }

            var zahteviN = await context.ZahteviNamirnica.Where(z => z.podnosilacID == korisnik.ID).ToListAsync();
            foreach (var z in zahteviN)
            {
                var zN = await context.ZahtevaneNamirnice.Where(zn => zn.zahtevID == z.ID).FirstOrDefaultAsync();
                if (zN != null)
                    context.ZahtevaneNamirnice.Remove(zN);

                await context.SaveChangesAsync();
            }

            var zahteviP = await context.ZahteviZaPracenje.Where(z => z.podnosilacID == korisnik.ID || z.pracenID == korisnik.ID).ToListAsync();
           


            if (jela != null && jela.Count > 0) 
            {
                await ObrisiVezeJeloNamirnica(jela);
                context.Jela.RemoveRange(jela);
            }

            if (treninzi != null && treninzi.Count > 0)
                await ObrisiVezeTreningAktivnost(treninzi);


            if (dani != null && dani.Count > 0)
            {
                await ObrisiIzvestaje(dani);
                await ObrisiVezeDanObrok(dani);
                await ObrisiVezeDanTrening(dani);
                context.Dani.RemoveRange(dani);
            }


            if (obroci != null && obroci.Count > 0)
            {
                await ObrisiVezeJeloObrok(obroci);
                context.Obroci.RemoveRange(obroci);
            }
           
           
            if(treninzi != null && treninzi.Count > 0)
                 context.Treninzi.RemoveRange(treninzi);

            if (zahteviA != null && zahteviA.Count > 0) 
            {
                await ObrisiRZ(zahteviP as ICollection<Zahtev>);
                context.ZahteviAktivnosti.RemoveRange(zahteviA);               
            }

            if (zahteviN != null && zahteviN.Count > 0)
            {               
                await ObrisiRZ(zahteviN as ICollection<Zahtev>);
                context.ZahteviNamirnica.RemoveRange(zahteviN);
            }

            if (zahteviP != null && zahteviP.Count > 0)
            {
                await ObrisiRZ(zahteviP as ICollection<Zahtev>);
                context.ZahteviZaPracenje.RemoveRange(zahteviP);              
            }


            if(ocene != null && ocene.Count > 0)
                context.Ocene.RemoveRange(ocene);
           
            if(objave != null && objave.Count > 0)
                context.Objave.RemoveRange(objave);

            if(poruke != null && poruke.Count > 0)
                 context.Poruke.RemoveRange(poruke);

            if(stanja != null && stanja.Count > 0)
                 context.Stanja.RemoveRange(stanja);


            context.Korisnici.Remove(korisnik);
            await context.SaveChangesAsync();

            return "Korisnik je obrisan.";
        }


        public async Task<string> ObrisiVezeJeloNamirnica(ICollection<Jelo> jela)
        {
            ICollection <JeloNamirnica> jNamirnice = new List<JeloNamirnica>();

            foreach (Jelo j in jela) 
            {
                var jn = await context.JelaNamirnice.Where(jn => jn.jeloID == j.ID).FirstOrDefaultAsync();
                if(jn != null)
                    jNamirnice.Add(jn);
            }

            if (jNamirnice != null && jNamirnice.Count > 0)
                context.JelaNamirnice.RemoveRange(jNamirnice);

            await context.SaveChangesAsync();
            return "Obrisane su veze jela i namirnica.";
        }

        public async Task<string> ObrisiVezeJeloObrok(ICollection<Obrok>obroci) 
        {
            ICollection<ObrokJelo> oJela = new List<ObrokJelo>();
            foreach (Obrok o in obroci) 
            {
                var oJelo = await context.ObrociJela.Where(j => j.obrokID == o.ID).FirstOrDefaultAsync();
                if(oJelo != null)
                    oJela.Add(oJelo);
            }

            if (oJela != null && oJela.Count > 0)
                context.ObrociJela.RemoveRange(oJela);

            await context.SaveChangesAsync();
            return "Obrisane su veze jela i obroka.";
        }

        public async Task<string> ObrisiVezeDanObrok(ICollection<Dan>dani)
        {
            ICollection<DanObrok> dObroci = new List<DanObrok>();
            foreach (Dan dan in dani) 
            {
                var d = await context.DaniObroci.Where(d => d.danID == dan.ID).FirstOrDefaultAsync();
                if(d != null)
                    dObroci.Add(d);
            }


            if (dObroci != null && dObroci.Count > 0)
                context.DaniObroci.RemoveRange(dObroci);

            await context.SaveChangesAsync();
            return "Obrisane su veze obroka i dana.";
        }

        public async Task<string> ObrisiVezeDanTrening(ICollection<Dan>dani)
        {
            ICollection<DanTrening> dTreninzi = new List<DanTrening>();
            foreach (Dan dan in dani) 
            {
                var dTrening = await context.DaniTreninzi.Where(dt => dt.danID == dan.ID).FirstOrDefaultAsync();
                if(dTrening != null)
                   dTreninzi.Add(dTrening);
            }

            if (dTreninzi != null && dTreninzi.Count > 0 )
                context.DaniTreninzi.RemoveRange(dTreninzi);

            await context.SaveChangesAsync();
            return "Obrisane su veze treninga i dana.";
        }
        public async Task<string> ObrisiVezeTreningAktivnost(ICollection<Trening>treninzi)
        {
            ICollection<TreningAktivnost> tAktivnosti = new List<TreningAktivnost>();
            foreach (Trening t in treninzi) 
            {
                var tAktivnost = await context.TreninziAktivnosti.Where(ta => ta.treningID == t.ID).FirstOrDefaultAsync();
                if(tAktivnost != null)
                    tAktivnosti.Add(tAktivnost);
            }

            if (tAktivnosti != null && tAktivnosti.Count > 0)
                context.TreninziAktivnosti.RemoveRange(tAktivnosti);

            await context.SaveChangesAsync();
            return "Obrisane su veze treninga i aktivnosti.";
        }

        public async Task<string> ObrisiIzvestaje(ICollection<Dan>dani)
        {
            ICollection<Izvestaj> izvestaji = new List<Izvestaj>();
            foreach (Dan dan in dani)
                if(dan.izvestajID != null)
                izvestaji.Add(await context.Izvestaji.FindAsync(dan.izvestajID));

            if (izvestaji != null && izvestaji.Count > 0)
                context.Izvestaji.RemoveRange(izvestaji);

            await context.SaveChangesAsync();
            return "Obrisani su dnevni izveštaji.";
        }

        public async Task<string> ObrisiRZ(ICollection<Zahtev> zahtevi) 
        {
            ICollection<RezultatZahteva> rezultati = new List<RezultatZahteva>();
            if (zahtevi != null) 
            {
                foreach (var zahtev in zahtevi)
                    if (zahtev.rezultatID != null)
                        rezultati.Add(await context.RezultatiZahteva.FindAsync(zahtev.rezultatID));

                if (rezultati != null && rezultati.Count > 0)
                    context.RezultatiZahteva.RemoveRange(rezultati);

                await context.SaveChangesAsync();
            }

            return "Obrisani su rezultati poslatih zahteva.";
        }


        public async Task<ICollection<Aktivnost>> DodateAktivnosti()
        {
            var aktivnosti = await context.Aktivnosti.Where(a => a.adminID == 1).ToListAsync();
            if (aktivnosti.Count == 0)
                return null;

            return aktivnosti;
        }

        public async Task<ICollection<Namirnica>> DodateNamirnice()
        {
            var namirnice = await context.Namirnice.Where(n => n.adminID == 1).ToListAsync();
            if (namirnice.Count == 0)
                return null;

            return namirnice; 
        }







        //funkcije za logger logger

        public async Task RegistracijaAdmina()
        {
            byte[] kljuc1;
            byte[] sifra1;

            byte[] kljuc2;
            byte[] sifra2;
            
            funkcije.SifraHash("78907890", out sifra1, out kljuc1);
            funkcije.SifraHash("88888888", out sifra2, out kljuc2);

            var pocetak = DateTime.Now;

            await context.AdministratoriAktivnosti.AddAsync(new AdministratorAktivnosti("Sandy", sifra1, kljuc1));
            await context.AdministratoriNamirnica.AddAsync(new AdministratorNamirnica("KebaKraba", sifra2, kljuc2));
            await context.SaveChangesAsync();

            var kraj = DateTime.Now;
            var t =  (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Administratori su registrovani za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme upisa jednog administratora iznosi "
                         + Math.Round((double)t / 2, 2) + " milisekundi." + Environment.NewLine);
        }

        public async Task PromenaAdmina()
        {
            byte[] kljuc;
            byte[] sifra;
            funkcije.SifraHash("78907899", out sifra, out kljuc);

            var aa = await AdministratorNamirnica();
            aa.Ime = "Keba Kraba";

            var an = await AdministratorAktivnosti();
            an.Sifra = sifra;
            an.Kljuc = kljuc;

            var pocetak = DateTime.Now;
            await context.SaveChangesAsync();
            var kraj = DateTime.Now;
            var t = (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Administratori su promenjeni za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme promene jednog administratora iznosi "
                         + Math.Round((double)t / 2, 2) + " milisekundi." + Environment.NewLine);
        }

        public async Task<int> Registruj(Korisnik k, string slika, double v, double t, double c, double nt)
        {
            k.Slika = slika;

            var pocetak = DateTime.Now;           
            await context.Korisnici.AddAsync(k);
            await context.SaveChangesAsync();
            var kraj = DateTime.Now;
            var vreme = (kraj - pocetak).Milliseconds;

            Stanje s = new Stanje(v, t);
            s.CiljnaKilaza = c;
            s.Bmi = funkcije.Kategorija(v, t);
            s.korisnik = await KorisnikPoImenu(k.Ime);
            s.korisnikID = s.korisnik.ID;
            var bmr = funkcije.IzracunajBMR(s.korisnik, v, t);
            s.BMR = bmr;
            s.EnergetskePotrebe = Math.Ceiling(bmr * nt);
            s.UgljeniHidrati = Math.Ceiling(s.EnergetskePotrebe * 0.65 / 4.1);
            s.Protein = Math.Ceiling(s.EnergetskePotrebe * 0.125 / 4.1);
            s.Mast = Math.Ceiling(s.EnergetskePotrebe * 0.225 / 9.3);
            s.Datum = DateTime.UtcNow;

            double doCiljneTezine = (t - c) * 7700;

            if ((c < t) && ((doCiljneTezine / 30) > (s.EnergetskePotrebe - 1000)))
                s.CiljniUnos = s.EnergetskePotrebe - 500;
            else if (s.Bmi == BMI.NormalnaUhranjenost && (c > t) && (doCiljneTezine / 30 > 500))
                s.CiljniUnos = s.EnergetskePotrebe + 500;

            else if (s.Bmi == BMI.Neuhranjenost && (-doCiljneTezine / 30 > 1000))
                s.CiljniUnos = s.EnergetskePotrebe + 1000;

            else s.CiljniUnos = Math.Floor(s.EnergetskePotrebe - doCiljneTezine / 30);


            pocetak = DateTime.Now;     
            await context.Stanja.AddAsync(s);
            await context.SaveChangesAsync();
            kraj = DateTime.Now;
            vreme += (kraj - pocetak).Milliseconds;

            return vreme;
        }
        public async Task RegistracijaPrvihKorisnika()
        {
            byte[] kljuc;
            byte[] sifra;

            var d = new DateTime(1995, 3, 29);
            d = DateTime.SpecifyKind(d, DateTimeKind.Utc);
            funkcije.SifraHash("12341234", out sifra, out kljuc);
            Korisnik k1 = new Korisnik("Patrick", sifra, kljuc, d, PolKorisnika.Muski, "*");

            d = new DateTime(1990, 9, 1);
            d = DateTime.SpecifyKind(d, DateTimeKind.Utc);
            funkcije.SifraHash("56785678", out sifra, out kljuc);
            Korisnik k2 = new Korisnik("Lignjoslav", sifra, kljuc, d, PolKorisnika.Muski, "*");

            d = new DateTime(1963, 7, 28);
            d = DateTime.SpecifyKind(d, DateTimeKind.Utc);
            funkcije.SifraHash("77777799", out sifra, out kljuc);
            Korisnik k3 = new Korisnik("Mardž", sifra, kljuc, d, PolKorisnika.Zenski, "*");

            d = new DateTime(1991, 11, 19);
            d = DateTime.SpecifyKind(d, DateTimeKind.Utc);
            funkcije.SifraHash("99999977", out sifra, out kljuc);
            Korisnik k4 = new Korisnik("Bart", sifra, kljuc, d, PolKorisnika.Muski, "*");

            var t = await Registruj(k1, "slika1.png", 175, 70, 65, 1.6);
            t += await Registruj(k2, "slika2.png", 195, 90, 93, 1.9);
            t += await Registruj(k3, "slika3.png", 162, 60, 55, 1.75);
            t += await Registruj(k4, "slika4.png", 180, 65, 70, 2);


            Log.Information(Environment.NewLine + "Korisnici su registrovani za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme upisa jednog korisnika iznosi "
                         + Math.Round((double)t / 4, 2) + " milisekundi." + Environment.NewLine);
        }


        public async Task PromenaPrvihKorisnika() 
        {
            byte[] kljuc;
            byte[] sifra;
            funkcije.SifraHash("99997777", out sifra, out kljuc);

            Korisnik k1 = await KorisnikPoImenu("Patrick");           
            Korisnik k2 = await KorisnikPoImenu("Lignjoslav");
            Korisnik k3 = await KorisnikPoImenu("Mardž");
            Korisnik k4 = await KorisnikPoImenu("Bart");

            k1.Ime = "Patrik";
            k2.Slika = "slika4.png";
            k3.Sifra = sifra;
            k3.Kljuc = kljuc;
            var d = new DateTime(1991, 9, 8);
            k4.DatumRodjenja = DateTime.SpecifyKind(d, DateTimeKind.Utc);

            var pocetak = DateTime.Now;
            await context.SaveChangesAsync();
            var  kraj = DateTime.Now;
            var t = (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Korisnici su promenjeni za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme promene jednog korisnika iznosi "
                         + Math.Round((double)t / 4, 2) + " milisekundi." + Environment.NewLine);
        }

        public async Task BrisanjePrvihKorisnika() 
        {
            var korisnici = await context.Korisnici.ToListAsync();
            var stanja = await context.Stanja.ToListAsync();

            var pocetak = DateTime.Now;            
            context.Stanja.RemoveRange(stanja);
            context.Korisnici.RemoveRange(korisnici);
            await context.SaveChangesAsync();
            var kraj = DateTime.Now;
            var t = (kraj - pocetak).Milliseconds;

            Log.Information(Environment.NewLine + "Korisnici su obrisani za " + t + " milisekundi."
                         + Environment.NewLine + "Prosečno vreme brisanja jednog korisnika iznosi "
                         + Math.Round((double)t / 4, 2) + " milisekundi." + Environment.NewLine);

        }



    }
}
