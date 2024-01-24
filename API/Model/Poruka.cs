namespace API.Model
{
    public class Poruka
    {
        public Poruka() { }
        public Poruka(string txt, DateTime dt)
        {
            this.Tekst = txt;
            this.Vreme = dt;
        }

        [Key]
        public int ID { get; set; }
        public string Tekst { get; set; } = string.Empty;
        public DateTime Vreme { get; set; } 

        public Korisnik autor { get; set; } = default!;
        public int autorID { get; set; }

        public Korisnik primalac { get; set; } = default!;
        public int primalacID { get; set; }



    }
}
