namespace API.Model
{
    public class Objava
    {
        public Objava() { }
        public Objava(string txt, string s)
        {
            this.Tekst = txt;
            this.Slika = s;
            this.Vreme = DateTime.Now;
        }


        [Key]
        public int ID { get; set; }
        public string Tekst { get; set; } = string.Empty;
        public string Slika  { get; set; } = string.Empty;
        public DateTime Vreme { get; set; }

        public Korisnik autor { get; set; } = default!;
        public int autorID { get; set; }

        public Objava? glavna { get; set; }
        public int? glavnaID { get; set; }
        public ICollection<Objava>? komentari { get; set; } = default!;
        public ICollection<Ocena>? ocene { get; set; } = default!;

    }
}
