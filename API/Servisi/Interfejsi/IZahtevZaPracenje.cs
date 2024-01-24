namespace API.Servisi.Interfejsi
{
    public interface IZahtevZaPracenje
    {
        public Task<ICollection<ZahtevZaPracenje>> PrimljeniZahtevi();
        public Task<ICollection<ZahtevZaPracenje>> PoslatiZahtevi();
        public Task<ZahtevZaPracenje> NadjiPoslatZahtev(int zahtevID);
        public Task<ZahtevZaPracenje> NadjiPrimljenZahtev(int zahtevID);
        public Task<ICollection<ZahtevZaPracenje>> NadjiPoslateZahteve(string ime);
        public Task<ICollection<ZahtevZaPracenje>> NadjiPrimljeneZahteve(string ime);
        public Task<ICollection<string>> Primaoci();
        public Task<ICollection<string>> Podnosioci();
        public Task<bool> PrijavaPoslednjeg();
        public Task<bool> ZahtevPoslatKorisniku(Korisnik primalac);
        public Task<ZahtevZaPracenje> PosaljiZahtev(Korisnik korisnik, bool prijava, string pozdrav);
        public Task<string> PovuciZahtev(int zahtevID);
        public Task<string> Otrprati(int pracenID);
        public Task<bool> Pratilac(int pratilacID);
        public Task<bool> Pracen(int pracenID);
        public Task<string> ObrisiPratioca(int pratilacID);
        public Task<ZahtevZaPracenje> PrihvatiZahtev(ZahtevZaPracenje zahtev);
        public Task<ZahtevZaPracenje> OdbijZahtev(ZahtevZaPracenje zahtev);
        public Task<ICollection<RezultatZahteva>> RezultatiZahteva();
        public Task<RezultatZahteva> RezultatPoslatogZahteva(ZahtevZaPracenje zahtev);
        public Task<RezultatZahteva> RezultatPrimljenogZahteva(ZahtevZaPracenje zahtev);
        public Task<RezultatZahteva> DodajRezultat(int zahtevID);

    }
}
