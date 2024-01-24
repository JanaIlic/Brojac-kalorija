namespace API.Model
{
    public class ZahtevNamirnice : Zahtev
    {
        public ZahtevNamirnice() { }

        public ZahtevNamirnice(string n)
        {
            this.Tip = TipZahteva.Namirnica;
            this.NazivNamirnice = n;
        }

        public string NazivNamirnice { get; set; } = string.Empty;
        public AdministratorNamirnica admin { get; set; } = default!;
        public int adminID { get; set; }

        public ICollection<NamirnicaZahtev> namirnice { get; set; } = default!;

    }
}
