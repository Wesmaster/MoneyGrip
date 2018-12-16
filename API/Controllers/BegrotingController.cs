using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GoHAPI.Models;

namespace GoHAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BegrotingController : ControllerBase
    {
        private readonly GoHContext _context;

        public BegrotingController(GoHContext context)
        {
            _context = context;
        }

        // GET: api/Begroting
        [HttpGet]
        public IEnumerable<int> GetFilter()
        {
            IQueryable<int> inkomstBegin = _context.Inkomst.Select(i => i.Begindatum.Year);
            IQueryable<int> inkomstEind = _context.Inkomst.Where(i => i.Einddatum != null).Select(i => i.Einddatum.Value.Year );

            IQueryable<int> contractBegin = _context.Contract.Select(i => i.Begindatum.Year);
            IQueryable<int> contractEind = _context.Contract.Where(i => i.Einddatum != null).Select(i => i.Einddatum.Value.Year);

            IQueryable<int> budgetBegin = _context.Budget.Select(i => i.Begindatum.Year);
            IQueryable<int> budgetEind = _context.Budget.Where(i => i.Einddatum != null).Select(i => i.Einddatum.Value.Year);

            IQueryable<int> afschrijvingDatum = _context.Afschrijving.Select(a => a.Aankoopdatum.Year);
            return inkomstBegin.Union(inkomstEind).Union(contractBegin).Union(contractEind).Union(budgetBegin).Union(budgetEind).Union(afschrijvingDatum);
        }

        // GET: api/Begroting/5
        [HttpGet("{jaar}")]
        public async Task<IActionResult> GetBegroting([FromRoute] int jaar)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Begroting begroting = new Begroting
            {
                jaar = jaar
            };

            begroting.inkomsten = await _context.Inkomst.Where(i => i.Einddatum.Value.Year >= begroting.jaar || i.Einddatum == null).Where(i => i.Begindatum.Year <= begroting.jaar).ToArrayAsync();
            begroting.contracten = await _context.Contract.Where(i => i.Einddatum.Value.Year >= begroting.jaar || i.Einddatum == null).Where(i => i.Begindatum.Year <= begroting.jaar).ToArrayAsync();
            begroting.budgetten = await _context.Budget.Where(i => i.Einddatum.Value.Year >= begroting.jaar || i.Einddatum == null).Where(i => i.Begindatum.Year <= begroting.jaar).ToArrayAsync();
            begroting.reserveringen = await _context.Reservering.ToArrayAsync();
            begroting.afschrijvingen = await _context.Afschrijving.Where(a => a.Aankoopdatum.Year <= begroting.jaar && a.Aankoopdatum.AddMonths(a.VerwachteLevensduur).Year >= begroting.jaar).ToArrayAsync();

            IQueryable<Spaardoel> doelEindBedrag = _context.Spaardoel.Include(s => s.LabelNavigation).Where(s => s.Percentage == null).OrderByDescending(s => s.Eindbedrag / (s.LaatsteMaand - s.EersteMaand));
            IQueryable<Spaardoel> doelPercentage = _context.Spaardoel.Include(s => s.LabelNavigation).Where(s => s.Percentage != null).OrderBy(s => (s.LaatsteMaand - s.EersteMaand)).ThenByDescending(s => (s.Percentage));
            begroting.spaardoelen = await doelEindBedrag.ToArrayAsync();
            begroting.spaardoelen = begroting.spaardoelen.Concat(await doelPercentage.ToArrayAsync()).ToArray();
            //  var union = doelEindBedrag.Union(doelPercentage);
         //   begroting.spaardoelen = await union.Include(s => s.LabelNavigation).ToArrayAsync();
           // begroting.spaardoelen = await doelPercentage.Union(doelEindBedrag).ToArrayAsync();
          //  begroting.spaardoelen = await doelPercentage.ToArrayAsync();

            return Ok(begroting.calculate());
        }
    }

    public class datum
    {
        public int jaar { get; set; }
    }
}