namespace API.Servisi.Interfejsi
{
    public interface IPoruka
    {
        public Task<bool> Pratilac(int pratilacID);
        public Task<bool> Pracen(int pracenID);
        public Task<Poruka> NadjiPoslatuPoruku(int porukaID);
        public Task<ICollection<Poruka>> PoslatePoruke();
        public Task<ICollection<Poruka>> PrimljenePoruke();
        public  Task<ICollection<Poruka>> Razgovor(Korisnik korisnik);
        public Task<ICollection<Korisnik>> Sagovornici();
        public Task<ICollection<bool>> AutoriPoruka(Korisnik korisnik);
        public Task<Poruka> PosaljiPoruku(Korisnik korisnik, string tekst);
        public Task<Poruka> PrepraviPoruku(int porukaID, string tekst);
        public Task<string> ObrisiPoruku(int porukaID);
        public Task<string> ObrisiRazgovor(Korisnik korisnik);
        public Task<string> ObrisiRazgovore();
        public Task<string> ObrisiPoslatePoruke();

    }
}
