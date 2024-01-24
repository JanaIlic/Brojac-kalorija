namespace API.Model
{
    public class KorisnikAktivnost
    {
        public KorisnikAktivnost() { }

        public Korisnik korisnik { get; set; } = default!;
        public int korisnikID { get; set; }

        public Aktivnost aktivnost { get; set; } = default!;
        public int aktivnostID { get; set; }
    }
}
