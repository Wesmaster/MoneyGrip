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
    public class SpaardoelController : BasisController
    {
        private readonly Models.AppContext _context;

        public SpaardoelController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Spaardoel
        [HttpGet]
        public IEnumerable<SpaardoelViewModel> GetSpaardoel()
        {
            IEnumerable<Spaardoel> spaardoelen = _context.Spaardoel
                .Include(s => s.SpaardoelLabels)
                .ThenInclude(sl => sl.Label)
                .OrderBy(s => s.LaatsteMaand)
                .ThenBy(s => s.EersteMaand)
                .ThenByDescending(s => s.Eindbedrag)
                .ThenByDescending(s => s.Percentage);
                
            return spaardoelen.Select(s => new SpaardoelViewModel
            {
                Id = s.Id,
                Percentage = s.Percentage,
                Eindbedrag = s.Eindbedrag,
                EersteMaand = s.EersteMaand,
                LaatsteMaand = s.LaatsteMaand,
                Omschrijving = s.Omschrijving,
                Label = toLabelViewModelList(s.SpaardoelLabels)
            });
        }

        // GET: api/Spaardoel/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpaardoel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Spaardoel spaardoel = await _context.Spaardoel
                .Where(r => r.Id == id)
                .Include(r => r.SpaardoelLabels)
                .ThenInclude(rl => rl.Label)
                .FirstOrDefaultAsync();

            if (spaardoel == null)
            {
                return NotFound();
            }

            SpaardoelViewModel spaardoelVM = new SpaardoelViewModel
            {
                Id = spaardoel.Id,
                Percentage = spaardoel.Percentage,
                Eindbedrag = spaardoel.Eindbedrag,
                EersteMaand = spaardoel.EersteMaand,
                LaatsteMaand = spaardoel.LaatsteMaand,
                Omschrijving = spaardoel.Omschrijving,
                Label = toLabelViewModelList(spaardoel.SpaardoelLabels)
            };

            return Ok(spaardoelVM);
        }

        // PUT: api/Spaardoel/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpaardoel([FromRoute] int id, [FromBody] SpaardoelPostModel spaardoelPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != spaardoelPM.Id)
            {
                return BadRequest();
            }

            Spaardoel spaardoel = _context.Spaardoel.Where(r => r.Id == id).Include(r => r.SpaardoelLabels).First();
            spaardoel.Percentage = spaardoelPM.Percentage;
            spaardoel.Eindbedrag = spaardoelPM.Eindbedrag;
            spaardoel.EersteMaand = spaardoelPM.EersteMaand;
            spaardoel.LaatsteMaand = spaardoelPM.LaatsteMaand;
            spaardoel.Omschrijving = spaardoelPM.Omschrijving;
            spaardoel.LaatstGewijzigd = DateTime.Now;

            spaardoel.SpaardoelLabels.Clear();

            foreach (var newLabelId in spaardoelPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                spaardoel.SpaardoelLabels.Add
                (
                    nieuwSpaardoelLabel(spaardoel, label)
                );
            }

            _context.Entry(spaardoel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpaardoelExists(id))
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

        // POST: api/Spaardoel
        [HttpPost]
        public async Task<IActionResult> PostSpaardoel([FromBody] SpaardoelPostModel spaardoelPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Spaardoel spaardoel = new Spaardoel
            {
                Id = spaardoelPM.Id,
                Percentage = spaardoelPM.Percentage,
                Eindbedrag = spaardoelPM.Eindbedrag,
                EersteMaand = spaardoelPM.EersteMaand,
                LaatsteMaand = spaardoelPM.LaatsteMaand,
                Omschrijving = spaardoelPM.Omschrijving,
                LaatstGewijzigd = DateTime.Now,
                SpaardoelLabels = new List<SpaardoelLabel>()
            };

            foreach (var newLabelId in spaardoelPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                spaardoel.SpaardoelLabels.Add
                (
                   nieuwSpaardoelLabel(spaardoel, label)
                );
            }

            _context.Spaardoel.Add(spaardoel);
            await _context.SaveChangesAsync();

            Rekening rekening = new Rekening
            {
                Id = 0,
                LaatstGewijzigd = DateTime.Now,
                Naam = spaardoelPM.Omschrijving,
                Hoofdrekening = false,
                Startbedrag = 0,
                Spaardoel = spaardoel.Id
            };

            _context.Rekening.Add(rekening);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSpaardoel", new { id = spaardoel.Id }, spaardoel);
        }

        // DELETE: api/Spaardoel/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpaardoel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var spaardoel = await _context.Spaardoel.FindAsync(id);
            if (spaardoel == null)
            {
                return NotFound();
            }

            Rekening rekening = _context.Rekening.Where(r => r.Spaardoel == id).First();
            if(rekening.getSaldo() > 0)
            {
                return Conflict();
            }

            _context.Spaardoel.Remove(spaardoel);
            await _context.SaveChangesAsync();

            return Ok(spaardoel);
        }

        private bool SpaardoelExists(int id)
        {
            return _context.Spaardoel.Any(e => e.Id == id);
        }

        private SpaardoelLabel nieuwSpaardoelLabel(Spaardoel spaardoel, Label label)
        {
            return new SpaardoelLabel
            {
                Spaardoel = spaardoel,
                Label = label,
                SpaardoelId = spaardoel.Id,
                LabelId = label.Id
            };
        }
    }
}