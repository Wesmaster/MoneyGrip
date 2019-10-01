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
    public class LeningController : BasisController
    {
        private readonly Models.AppContext _context;

        public LeningController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Lening
        [HttpGet]
        public IEnumerable<LeningViewModel> GetLening()
        {
            IEnumerable<Lening> leningen = _context.Lening
                .Include(lening => lening.LeningLabels)
                .ThenInclude(leningLabel => leningLabel.Label);

            return leningen.Select(i => new LeningViewModel
            {
                Id = i.Id,
                Bedrag = i.Bedrag,
                Begindatum = i.Begindatum,
                Looptijd = i.Looptijd,
                Rente = i.Rente * 100,
                Type = i.Type,
                Document = i.Document,
                DocumentNaam = i.DocumentNaam,
                Label = toLabelViewModelList(i.LeningLabels)
                //BedragPerMaand = 
            });
        }

        // GET: api/Lening/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLening([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var lening = await _context.Lening
                .Where(a => a.Id == id)
                .Include(a => a.LeningLabels)
                .ThenInclude(leningLabel => leningLabel.Label)
                .FirstOrDefaultAsync();


            if (lening == null)
            {
                return NotFound();
            }

            LeningViewModel leningVM = new LeningViewModel()
            {
                Id = lening.Id,
                Label = toLabelViewModelList(lening.LeningLabels),
                Begindatum = lening.Begindatum,
                Bedrag = lening.Bedrag,
                Looptijd = lening.Looptijd,
                Rente = lening.Rente * 100,
                Type = lening.Type,
                Document = lening.Document,
                DocumentNaam = lening.DocumentNaam
            };

            return Ok(leningVM);
        }

        // PUT: api/Lening/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAfschrijving([FromRoute] int id, [FromBody] LeningPostModel leningPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != leningPM.Id)
            {
                return BadRequest();
            }

            Lening lening = _context.Lening.Where(a => a.Id == id).Include(a => a.LeningLabels).First();
            lening.LaatstGewijzigd = DateTime.Now;
            lening.Bedrag = leningPM.Bedrag;
            lening.Begindatum = leningPM.Begindatum;
            lening.Looptijd = leningPM.Looptijd;
            lening.Type = leningPM.Type;
            lening.Rente = leningPM.Rente / 100;
            lening.Document = leningPM.Document;
            lening.DocumentNaam = leningPM.DocumentNaam;

            lening.LeningLabels.Clear();

            foreach (var newLabelId in leningPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                lening.LeningLabels.Add
                (
                    nieuwLeningLabel(lening, label)
                );
            }

            _context.Entry(lening).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeningExists(id))
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

        // POST: api/Lening
        [HttpPost]
        public async Task<IActionResult> PostLening([FromBody] LeningPostModel leningPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Lening lening = new Lening()
            {
                LaatstGewijzigd = DateTime.Now,
                Bedrag = leningPM.Bedrag,
                Begindatum = leningPM.Begindatum,
                Looptijd = leningPM.Looptijd,
                Rente = leningPM.Rente / 100,
                Type = leningPM.Type,
                Document = leningPM.Document,
                DocumentNaam = leningPM.DocumentNaam,
                LeningLabels = new List<LeningLabel>()
            };

            foreach (var newLabelId in leningPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                lening.LeningLabels.Add
                (
                    nieuwLeningLabel(lening, label)
                );
            }

            _context.Lening.Add(lening);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLening", new { id = lening.Id }, lening);
        }

        // DELETE: api/Lening/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLening([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var lening = await _context.Lening.FindAsync(id);
            if (lening == null)
            {
                return NotFound();
            }

            _context.Lening.Remove(lening);
            await _context.SaveChangesAsync();

            return Ok(lening);
        }

        private bool LeningExists(int id)
        {
            return _context.Lening.Any(e => e.Id == id);
        }

        private LeningLabel nieuwLeningLabel(Lening lening, Label label)
        {
            return new LeningLabel
            {
                Lening = lening,
                Label = label,
                LeningId = lening.Id,
                LabelId = label.Id
            };
        }
    }
}