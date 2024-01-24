using API.Model;
using API.Model.Poveznici;

namespace API.Data
{ 
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) { }


        public DbSet<AdministratorAktivnosti> AdministratoriAktivnosti { get; set; } = default!;
        public DbSet<AdministratorNamirnica> AdministratoriNamirnica { get; set; } = default!;
        public DbSet<Korisnik> Korisnici { get; set; } = default!;
        public DbSet<Stanje> Stanja { get; set; } = default!;
        public DbSet<Dan> Dani { get; set; } = default!;
        public DbSet<Namirnica> Namirnice { get; set; } = default!;
        public DbSet<Jelo> Jela { get; set; } = default!;
        public DbSet<Aktivnost> Aktivnosti { get; set; } = default!;
        public DbSet<Obrok> Obroci { get; set; } = default!;
        public DbSet<Poruka> Poruke { get; set; } = default!;
        public DbSet<Objava> Objave { get; set; } = default!;
        public DbSet<Ocena> Ocene { get; set; } = default!;
        public DbSet<ZahtevZaPracenje> ZahteviZaPracenje { get; set; } = default!;
        public DbSet<ZahtevAktivnosti> ZahteviAktivnosti { get; set; } = default!;
        public DbSet<ZahtevNamirnice> ZahteviNamirnica { get; set; } = default!;
        public DbSet<Izvestaj> Izvestaji { get; set; } = default!;
        public DbSet<RezultatZahteva> RezultatiZahteva { get; set; } = default!;
        public DbSet<Trening> Treninzi { get; set; } = default!;


        public DbSet<KorisnikNamirnica> KorisniciNamirnice { get; set; } = default!; 
        public DbSet<JeloNamirnica> JelaNamirnice { get; set; } = default!;
        public DbSet<ObrokJelo> ObrociJela { get; set; } = default!;
        public DbSet<KorisnikAktivnost> KorisniciAktivnosti { get; set; } = default!;
        public DbSet<TreningAktivnost> TreninziAktivnosti { get; set; } = default!;
        public DbSet<DanTrening> DaniTreninzi { get; set; } = default!;
        public DbSet<DanObrok> DaniObroci { get; set; } = default!;
        public DbSet<DvaKorisnika> ParoviKorisnika { get; set; } = default!;
        public DbSet<NamirnicaZahtev> ZahtevaneNamirnice { get; set; } = default!;
        public DbSet<AktivnostZahtev> ZahtevaneAktivnosti  { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Stanje>().HasOne<Korisnik>(s => s.korisnik).WithMany(k => k.stanja).HasForeignKey(s => s.korisnikID);

            builder.Entity<KorisnikNamirnica>().HasKey(kn => new { kn.korisnikID, kn.namirnicaID });
            builder.Entity<KorisnikNamirnica>().HasOne<Korisnik>(kn => kn.korisnik).WithMany(k => k.namirnice).HasForeignKey(kn => kn.korisnikID);
            builder.Entity<KorisnikNamirnica>().HasOne<Namirnica>(kn => kn.namirnica).WithMany(n => n.korisnici).HasForeignKey(kn => kn.namirnicaID);

            builder.Entity<Namirnica>().HasOne<AdministratorNamirnica>(n => n.admin).WithMany(a => a.namirnice).HasForeignKey(n => n.adminID);

            builder.Entity<Jelo>().HasOne<Korisnik>(j => j.korisnik).WithMany(k => k.jela).HasForeignKey(j => j.korisnikID);

            builder.Entity<JeloNamirnica>().HasKey(jn => new { jn.jeloID, jn.namirnicaID });
            builder.Entity<JeloNamirnica>().HasOne<Jelo>(jn => jn.jelo).WithMany(j => j.namirnice).HasForeignKey(jn => jn.jeloID);
            builder.Entity<JeloNamirnica>().HasOne<Namirnica>(jn => jn.namirnica).WithMany(n => n.jela).HasForeignKey(jn => jn.namirnicaID);

            builder.Entity<ObrokJelo>().HasKey(oj => new { oj.obrokID, oj.jeloID });
            builder.Entity<ObrokJelo>().HasOne<Obrok>(oj => oj.obrok).WithMany(o => o.jela).HasForeignKey(oj => oj.obrokID);
            builder.Entity<ObrokJelo>().HasOne<Jelo>(oj => oj.jelo).WithMany(j => j.obroci).HasForeignKey(oj => oj.jeloID);

            builder.Entity<Obrok>().HasOne<Korisnik>(o => o.korisnik).WithMany(k => k.obroci).HasForeignKey(o => o.korisnikID);

            builder.Entity<KorisnikAktivnost>().HasKey(ka => new { ka.korisnikID, ka.aktivnostID });
            builder.Entity<KorisnikAktivnost>().HasOne<Korisnik>(ka => ka.korisnik).WithMany(k => k.aktivnosti).HasForeignKey(ka => ka.korisnikID);
            builder.Entity<KorisnikAktivnost>().HasOne<Aktivnost>(ka => ka.aktivnost).WithMany(a => a.korisnici).HasForeignKey(ka => ka.aktivnostID);

            builder.Entity<Aktivnost>().HasOne<AdministratorAktivnosti>(a => a.admin).WithMany(ad => ad.aktivnosti).HasForeignKey(a => a.adminID);

            builder.Entity<Trening>().HasOne<Korisnik>(t => t.korisnik).WithMany(k => k.treninzi).HasForeignKey(t => t.korisnikID);

            builder.Entity<TreningAktivnost>().HasKey(ta => new { ta.treningID, ta.aktivnostID });
            builder.Entity<TreningAktivnost>().HasOne<Trening>(ta => ta.trening).WithMany(t => t.aktivnosti).HasForeignKey(ta => ta.treningID);
            builder.Entity<TreningAktivnost>().HasOne<Aktivnost>(ta => ta.aktivnost).WithMany(a => a.treninzi).HasForeignKey(ta => ta.aktivnostID);

            builder.Entity<Dan>().HasOne<Korisnik>(d => d.korisnik).WithMany(k => k.dani).HasForeignKey(d => d.korisnikID);

            builder.Entity<Izvestaj>().HasOne<Dan>(i => i.dan).WithOne(d => d.izvestaj).HasForeignKey<Izvestaj>(i => i.danID);

            builder.Entity<DanTrening>().HasKey(dt => new { dt.danID, dt.treningID });
            builder.Entity<DanTrening>().HasOne<Dan>(dt => dt.dan).WithMany(d => d.treninzi).HasForeignKey(dt => dt.danID);
            builder.Entity<DanTrening>().HasOne<Trening>(dt => dt.trening).WithMany(t => t.dani).HasForeignKey(dt => dt.treningID);

            builder.Entity<DanObrok>().HasKey(d => new { d.danID, d.obrokID });
            builder.Entity<DanObrok>().HasOne<Dan>(d => d.dan).WithMany(d => d.obroci).HasForeignKey(d => d.danID);
            builder.Entity<DanObrok>().HasOne<Obrok>(d => d.obrok).WithMany(o => o.dani).HasForeignKey(d => d.obrokID);

            builder.Entity<DvaKorisnika>().HasKey(dk => new { dk.pracenID, dk.pratilacID });
            builder.Entity<DvaKorisnika>().HasOne<Korisnik>(dk => dk.pracen).WithMany(k => k.pratioci).HasForeignKey(dk => dk.pracenID);
            builder.Entity<DvaKorisnika>().HasOne<Korisnik>(dk => dk.pratilac).WithMany(k => k.prati).HasForeignKey(dk => dk.pratilacID);


            builder.Entity<Poruka>().HasOne<Korisnik>(p => p.autor).WithMany(k => k.poslatePoruke).HasForeignKey(p => p.autorID);

            builder.Entity<Poruka>().HasOne<Korisnik>(p => p.primalac).WithMany(dk => dk.primljenePoruke).HasForeignKey(p => p.primalacID);

            builder.Entity<Objava>().HasOne<Korisnik>(o => o.autor).WithMany(k => k.objave).HasForeignKey(o => o.autorID);
            builder.Entity<Objava>().HasMany<Objava>(o => o.komentari).WithOne(o => o.glavna).HasForeignKey(o => o.glavnaID);

            builder.Entity<Ocena>().HasOne<Objava>(o => o.objava).WithMany(o => o.ocene).HasForeignKey(o => o.objavaID);

            builder.Entity<Ocena>().HasOne<Korisnik>(o => o.korisnik).WithMany(k => k.ocene).HasForeignKey(o => o.korisnikID);

            builder.Entity<NamirnicaZahtev>().HasKey(nz => new { nz.zahtevID, nz.namirnicaID });
            builder.Entity<NamirnicaZahtev>().HasOne<ZahtevNamirnice>(nz => nz.zahtev).WithMany(z => z.namirnice).HasForeignKey(nz => nz.zahtevID);
            builder.Entity<NamirnicaZahtev>().HasOne<Namirnica>(nz => nz.namirnica).WithMany(n => n.zahtevi).HasForeignKey(nz => nz.namirnicaID);

            builder.Entity<AktivnostZahtev>().HasKey(az => new { az.zahtevID, az.aktivnostID });
            builder.Entity<AktivnostZahtev>().HasOne<Aktivnost>(az => az.aktivnost).WithMany(a => a.zahtevi).HasForeignKey(az => az.zahtevID);
            builder.Entity<AktivnostZahtev>().HasOne<ZahtevAktivnosti>(az => az.zahtev).WithMany(z => z.aktivnosti).HasForeignKey(az => az.aktivnostID);

            builder.Entity<ZahtevAktivnosti>().HasOne<AdministratorAktivnosti>(z => z.admin).WithMany(a => a.zahtevi).HasForeignKey(z => z.adminID);
            builder.Entity<ZahtevNamirnice>().HasOne<AdministratorNamirnica>(z => z.admin).WithMany(a => a.zahtevi).HasForeignKey(z => z.adminID);
            builder.Entity<ZahtevZaPracenje>().HasOne<Korisnik>(z => z.pracen).WithMany(k => k.dobijeniZahteviZaPracenje).HasForeignKey(z => z.pracenID);

            builder.Entity<ZahtevZaPracenje>().HasOne<Korisnik>(z => z.podnosilac).WithMany(k => k.poslatiZahteviZaPracenje).HasForeignKey(z => z.podnosilacID);          
            builder.Entity<RezultatZahteva>().HasOne<ZahtevZaPracenje>(rz => rz.zPracenja).WithOne(p => p.rezultat).HasForeignKey<ZahtevZaPracenje>(p => p.rezultatID);

            builder.Entity<ZahtevAktivnosti>().HasOne<Korisnik>(z => z.podnosilac).WithMany(k => k.zahteviAktivnosti).HasForeignKey(z => z.podnosilacID);     
            builder.Entity<RezultatZahteva>().HasOne<ZahtevAktivnosti>(rz => rz.zAktivnosti).WithOne(p => p.rezultat).HasForeignKey<ZahtevAktivnosti>(p => p.rezultatID);

            builder.Entity<ZahtevNamirnice>().HasOne<Korisnik>(z => z.podnosilac).WithMany(k => k.zahteviNamirnica).HasForeignKey(z => z.podnosilacID);            
            builder.Entity<RezultatZahteva>().HasOne<ZahtevNamirnice>(rz => rz.zNamirnice).WithOne(p => p.rezultat).HasForeignKey<ZahtevNamirnice>(p => p.rezultatID);


            builder.Entity<Korisnik>().HasIndex(k => k.Ime).IsUnique();
            builder.Entity<Namirnica>().HasIndex(n => n.Naziv).IsUnique();
            builder.Entity<Aktivnost>().HasIndex(a => a.Naziv).IsUnique();            
        }



    }
}
