namespace API.Model
{
    public class TreningAktivnost
    {
        public TreningAktivnost() { }

        public Trening trening { get; set; } = default!;
        public int treningID { get; set; }
        public Aktivnost aktivnost { get; set; } = default!;
        public int aktivnostID { get; set; }

        public int vreme { get; set; }

    }
}
