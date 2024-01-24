namespace API.Model
{
    public class Ocena
    {
        public Ocena() { }

        public Ocena(int v, DateTime dt) 
        {
            this.Vrednost = v;
            this.Vreme = dt;
        }

        [Key]
        public int ID { get; set; }
        public int Vrednost { get; set; } = 0;
        public DateTime Vreme { get; set; }
        public Objava objava { get; set; } = default!;
        public int objavaID { get; set; }

        public Korisnik korisnik { get; set; } = default!;
        public int korisnikID { get; set; }


    }
}
