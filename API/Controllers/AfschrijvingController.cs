using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyGrip.Models;
using MoneyGrip.ViewModels;

namespace MoneyGrip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AfschrijvingController : BasisController
    {
        private readonly Models.AppContext _context;

        public AfschrijvingController(Models.AppContext context)
        {
            _context = context;
        }

        [Route("algemeen")]
        [HttpGet]
        public async Task<IActionResult> getAfschrijvingenAlgemeen()
        {
            var TotaalPerMaand = await _context.Afschrijving.Where(a => a.Aankoopdatum.AddMonths(a.VerwachteLevensduur) > DateTime.Now).SumAsync(a => a.Aankoopbedrag / a.VerwachteLevensduur);
            var GewensteStand = await _context.Afschrijving.SumAsync(a => (a.Aankoopbedrag / a.VerwachteLevensduur) * ((DateTime.Now.Year - a.Aankoopdatum.Year) * 12 + DateTime.Now.Month - a.Aankoopdatum.Month));

            AfschrijvingAlgemeenViewModel algemeenVM = new AfschrijvingAlgemeenViewModel()
            {
                TotaalPerMaand = TotaalPerMaand,
                GewensteStand = GewensteStand
            };

            return Ok(algemeenVM);
        }

        // GET: api/Afschrijving
        [HttpGet]
        public IEnumerable<AfschrijvingViewModel> GetAfschrijving()
        {
            IEnumerable<Afschrijving> afschrijvingen = _context.Afschrijving
                .Include(afschrijving => afschrijving.AfschrijvingLabels)
                .ThenInclude(afschrijvingLabel => afschrijvingLabel.Label)
                .OrderBy(a => a.Aankoopdatum.AddMonths(a.VerwachteLevensduur))
                .ThenBy(a => a.Aankoopbedrag);

            return afschrijvingen.Select(i => new AfschrijvingViewModel
            {
                Id = i.Id,
                Aankoopbedrag = i.Aankoopbedrag,
                Aankoopdatum = i.Aankoopdatum,
                VerwachteLevensduur = i.VerwachteLevensduur,
                Garantie = i.Garantie,
                Factuur = i.Factuur,
                FactuurNaam = i.FactuurNaam,
                Label = toLabelViewModelList(i.AfschrijvingLabels),
                BedragPerMaand = i.Aankoopbedrag / i.VerwachteLevensduur
            });
        }

        // GET: api/Afschrijving/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAfschrijving([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var afschrijving = await _context.Afschrijving
                .Where(a => a.Id == id)
                .Include(a => a.AfschrijvingLabels)
                .ThenInclude(afschrijvingLabel => afschrijvingLabel.Label)
                .FirstOrDefaultAsync();


            if (afschrijving == null)
            {
                return NotFound();
            }

            AfschrijvingViewModel afschrijvingVM = new AfschrijvingViewModel()
            {
                Id = afschrijving.Id,
                Label = toLabelViewModelList(afschrijving.AfschrijvingLabels),
                Aankoopdatum = afschrijving.Aankoopdatum,
                Aankoopbedrag = afschrijving.Aankoopbedrag,
                VerwachteLevensduur = afschrijving.VerwachteLevensduur,
                Garantie = afschrijving.Garantie,
                Factuur = afschrijving.Factuur,
                FactuurNaam = afschrijving.FactuurNaam,
                BedragPerMaand = afschrijving.Aankoopbedrag / afschrijving.VerwachteLevensduur
            };

            return Ok(afschrijvingVM);
        }

        // PUT: api/Afschrijving/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAfschrijving([FromRoute] int id, [FromBody] AfschrijvingPostModel afschrijvingPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != afschrijvingPM.Id)
            {
                return BadRequest();
            }

            Afschrijving afschrijving = _context.Afschrijving.Where(a => a.Id == id).Include(a => a.AfschrijvingLabels).First();
            afschrijving.LaatstGewijzigd = DateTime.Now;
            afschrijving.Aankoopbedrag = afschrijvingPM.Aankoopbedrag;
            afschrijving.Aankoopdatum = afschrijvingPM.Aankoopdatum;
            afschrijving.VerwachteLevensduur = afschrijvingPM.VerwachteLevensduur;
            afschrijving.Garantie = afschrijvingPM.Garantie;
            afschrijving.Factuur = afschrijvingPM.Factuur;
            afschrijving.FactuurNaam = afschrijvingPM.FactuurNaam;

            afschrijving.AfschrijvingLabels.Clear();

            foreach (var newLabelId in afschrijvingPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                afschrijving.AfschrijvingLabels.Add
                (
                    nieuwAfschrijvingLabel(afschrijving, label)
                );
            }

            _context.Entry(afschrijving).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AfschrijvingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Afschrijving
        [HttpPost]
        public async Task<IActionResult> PostAfschrijving([FromBody] AfschrijvingPostModel afschrijvingPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Afschrijving afschrijving = new Afschrijving()
            {
                LaatstGewijzigd = DateTime.Now,
                Aankoopbedrag = afschrijvingPM.Aankoopbedrag,
                Aankoopdatum = afschrijvingPM.Aankoopdatum,
                VerwachteLevensduur = afschrijvingPM.VerwachteLevensduur,
                Garantie = afschrijvingPM.Garantie,
                Factuur = afschrijvingPM.Factuur,
                FactuurNaam = afschrijvingPM.FactuurNaam,
                AfschrijvingLabels = new List<AfschrijvingLabel>()
            };

            foreach (var newLabelId in afschrijvingPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                afschrijving.AfschrijvingLabels.Add
                (
                    nieuwAfschrijvingLabel(afschrijving, label)
                );
            }

            _context.Afschrijving.Add(afschrijving);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAfschrijving", new { id = afschrijving.Id }, afschrijving);
        }

        // DELETE: api/Afschrijving/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAfschrijving([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var afschrijving = await _context.Afschrijving.FindAsync(id);
            if (afschrijving == null)
            {
                return NotFound();
            }

            _context.Afschrijving.Remove(afschrijving);
            await _context.SaveChangesAsync();

            return Ok(afschrijving);
        }

        private bool AfschrijvingExists(int id)
        {
            return _context.Afschrijving.Any(e => e.Id == id);
        }

        private AfschrijvingLabel nieuwAfschrijvingLabel(Afschrijving afschrijving, Label label)
        {
            return new AfschrijvingLabel
            {
                Afschrijving = afschrijving,
                Label = label,
                AfschrijvingId = afschrijving.Id,
                LabelId = label.Id
            };
        }
    }
}