using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class PopunjavanjeController : ControllerBase
    {
        private INalog inalog;
        private INamirnica inamirnica;
        private IAktivnost iaktivnost;
        public PopunjavanjeController(INalog nalog, INamirnica namirnica, IAktivnost aktivnost)
        {
            this.inalog = nalog;
            this.iaktivnost = aktivnost;
            this.inamirnica = namirnica;
        }

        [HttpPost("prvaAktivnost")]
        public async Task<ActionResult> UbaciPrvuAktivnost() 
        {           
            return Ok(await iaktivnost.UpisPrveAktivnosti());
        }

        [HttpPost("prvaNamirnica")]
        public async Task<ActionResult> UbaciPrvuNamirnicu()
        {
            return Ok(await inamirnica.UpisPrveNamirnice());
        }

        [HttpPost]
        public async Task<ActionResult> Popuni()
        {
            await inalog.RegistracijaAdmina();
            await inalog.RegistracijaPrvihKorisnika();
            await inamirnica.UpisPrvihNamirnica();
            await iaktivnost.UpisPrvihAktivnosti();

            return Ok("popunjeno");
        }

        [HttpPut]
        public async Task<ActionResult> Promeni()
        {
            await inalog.PromenaAdmina();
            await inalog.PromenaPrvihKorisnika();
            await inamirnica.PromenaPrvihNamirnica();
            await iaktivnost.PromenaPrvihAktivnosti();

            return Ok("promenjeno");
        }

        [HttpDelete]
        public async Task<ActionResult> Obriši()
        {
            await inalog.BrisanjePrvihKorisnika();
            await inamirnica.BrisanjePrvihNamirnica();
            await iaktivnost.BrisanjePrvihAktivnosti();

            return Ok("obrisano");
        }


    }
}
