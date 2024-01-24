namespace API.Model.Poveznici
{
    public class NamirnicaZahtev
    {
        public NamirnicaZahtev(){ }

        public ZahtevNamirnice zahtev { get; set; } = default!;
        public int zahtevID { get; set; }
        public Namirnica namirnica { get; set; } = default!;
        public int namirnicaID { get; set; }
    }
}
