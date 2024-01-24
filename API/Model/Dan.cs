namespace API.Model
{
    public class Dan
    {
        public Dan() { }
        public Dan(DateTime d, double r)
        {
            this.Datum = d;
            this.Rezultat = r;
        }

        [Key]
        public int ID { get; set; }
        public DateTime Datum { get; set; } = DateTime.Now;
        public double Rezultat { get; set; } = 0;
        public bool Prijava { get; set; } 

        public Korisnik korisnik { get; set; } = default!;
        public int korisnikID { get; set; }

        public Izvestaj? izvestaj { get; set; }
        public int? izvestajID { get; set; }
        public ICollection<DanObrok>? obroci { get; set; } = default!;
        public ICollection<DanTrening>? treninzi { get; set; } = default!;

    }
}
