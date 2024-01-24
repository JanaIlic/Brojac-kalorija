﻿namespace API.Model
{
    public class Trening
    {
        public Trening() { }
        public Trening(string n, int v)
        {
            this.Naziv = n;
            this.Vreme = v;
        }

        [Key]
        public int ID { get; set; }
        public string Naziv { get; set; } = string.Empty;
        public int Vreme { get; set; } = 0;
        public double NivoTezine { get; set; } 

        public Korisnik korisnik { get; set; } = default!;
        public int korisnikID { get; set; }

        public ICollection<TreningAktivnost>? aktivnosti { get; set; } = default!;
        public ICollection<DanTrening>? dani { get; set; } = default!;
    }
}
