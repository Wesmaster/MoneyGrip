using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyGrip.Models;
using MoneyGrip.Begroting;

namespace MoneyGrip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BegrotingController : ControllerBase
    {
        private readonly Models.AppContext _context;

        public BegrotingController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Begroting
        [HttpGet]
        public IEnumerable<int> GetFilter()
        {
            IQueryable<int> inkomstBegin = _context.Inkomst.Select(i => i.Begindatum.Year);
            IQueryable<int> inkomstEind = _context.Inkomst.Where(i => i.Einddatum != null).Select(i => i.Einddatum.Value.Year );

            return inkomstBegin.Union(inkomstEind);
        }

        // GET: api/Begroting/5
        [HttpGet("{jaar}")]
        public async Task<IActionResult> GetBegroting([FromRoute] int jaar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BegrotingBepaler begroting = new BegrotingBepaler
            {
                jaar = jaar
            };

            begroting.inkomsten = await _context.Inkomst
                .Where(i => i.Einddatum.Value.Year >= begroting.jaar || i.Einddatum == null)
                .Where(i => i.Begindatum.Year <= begroting.jaar).ToArrayAsync();
            begroting.contracten = await _context.Contract
                .Where(i => i.Einddatum.Value.Year >= begroting.jaar || i.Einddatum == null)
                .Where(i => i.Begindatum.Year <= begroting.jaar).ToArrayAsync();
            begroting.budgetten = await _context.Budget
                .Where(i => i.Einddatum.Value.Year >= begroting.jaar || i.Einddatum == null)
                .Where(i => i.Begindatum.Year <= begroting.jaar).ToArrayAsync();
            begroting.reserveringen = await _context.Reservering.ToArrayAsync();
            begroting.afschrijvingen = await _context.Afschrijving
                .Where(a => a.Aankoopdatum.Year <= begroting.jaar && a.Aankoopdatum.AddMonths(a.VerwachteLevensduur).Year >= begroting.jaar).ToArrayAsync();
            begroting.leningen = await _context.Lening
                .Where(a => a.Begindatum.Year <= begroting.jaar && a.Begindatum.AddMonths(a.Looptijd).Year >= begroting.jaar).ToArrayAsync();

            IQueryable<Spaardoel> doelEindBedrag = _context.Spaardoel
                .Include(s => s.SpaardoelLabels)
                .ThenInclude(sl => sl.Label)
                .Where(s => s.Percentage == null)
                .OrderByDescending(s => s.Eindbedrag / (s.LaatsteMaand - s.EersteMaand + 1));

            IQueryable<Spaardoel> doelPercentage = _context.Spaardoel
                .Include(s => s.SpaardoelLabels)
                .ThenInclude(sl => sl.Label)
                .Where(s => s.Percentage != null)
                .OrderBy(s => (s.LaatsteMaand - s.EersteMaand + 1))
                .ThenByDescending(s => (s.Percentage));
            begroting.spaardoelen = await doelEindBedrag.ToArrayAsync();
            begroting.spaardoelen = begroting.spaardoelen.Concat(await doelPercentage.ToArrayAsync()).ToArray();

            return Ok(begroting.genereerOverzicht());
        }
    }
}