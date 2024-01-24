namespace API.Model
{
    public abstract class Obavestenje
    {
        public Obavestenje() { }
        public Obavestenje(string p)
        {
            this.Poruka = p;
        }

        [Key]
        public int ID { get; set; }
        public TipObavestenja Tip { get; set; }
        public string Poruka { get; set; } = string.Empty;
    }

    public enum TipObavestenja
    {
        Izvestaj,
        RezultatZahteva
    }

}
