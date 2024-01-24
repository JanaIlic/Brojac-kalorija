namespace API.Model
{
    public abstract class Zahtev
    {
        public Zahtev() { }
        public Zahtev(string p) 
        {
            this.Poruka = p;
            this.Stanje = StanjeZahteva.Cekanje;
            this.Podnet = DateTime.Now;
        }

        [Key]
        public int ID { get; set; }
        public TipZahteva Tip { get; set; } 
        public StanjeZahteva Stanje { get; set; } = StanjeZahteva.Cekanje;
        public DateTime Podnet { get; set; }
        public DateTime Prihvacen { get; set; }
        public DateTime Zakljucen { get; set; }
        public string Poruka { get; set; } = string.Empty;
        public bool Prijava { get; set; } = true;
        public Korisnik podnosilac { get; set; } = default!;
        public int podnosilacID { get; set; }
        public RezultatZahteva? rezultat { get; set; }
        public int? rezultatID { get; set; }
    }

    public enum TipZahteva 
    {
        Pracenje,
        Aktivnost, 
        Namirnica
    }

    public enum StanjeZahteva
    {
        Cekanje,
        Obrada,
        Ispunjen,
        Odbijen
    }

}
