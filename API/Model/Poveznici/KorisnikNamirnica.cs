namespace API.Model
{
    public class KorisnikNamirnica
    {
        public KorisnikNamirnica() { }

        public Korisnik korisnik { get; set; } = default!;
        public int korisnikID { get; set; }
        public Namirnica namirnica { get; set; } = default!;
        public int namirnicaID { get; set; }

    }
}
