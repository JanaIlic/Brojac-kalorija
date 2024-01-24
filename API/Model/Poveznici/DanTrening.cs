namespace API.Model
{
    public class DanTrening
    {
        public DanTrening() { }

        public Dan dan { get; set; } = default!;
        public int danID { get; set; }
        public Trening trening { get; set; } = default!;
        public int treningID { get; set; }
    }
}
