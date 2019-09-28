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
    public class ReserveringController : BasisController
    {
        private readonly Models.AppContext _context;

        public ReserveringController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Reservering
        [HttpGet]
        public IEnumerable<ReserveringViewModel> GetReservering()
        {
            IEnumerable<Reservering> reserveringen = _context.Reservering
                .Include(reservering => reservering.ReserveringLabels)
                .ThenInclude(reserveringLabel => reserveringLabel.Label)
                .OrderBy(r => r.Maand)
                .ThenBy(r => r.Bedrag);

            return reserveringen.Select(r => new ReserveringViewModel
            {
                Id = r.Id,
                Bedrag = r.Bedrag,
                Maand = r.Maand,
                Omschrijving = r.Omschrijving,
                Label = toLabelViewModelList(r.ReserveringLabels)
            });
        }

        // GET: api/Reservering/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReservering([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Reservering reservering = await _context.Reservering
                .Where(r => r.Id == id)
                .Include(r => r.ReserveringLabels)
                .ThenInclude(rl => rl.Label)
                .FirstOrDefaultAsync();

            if (reservering == null)
            {
                return NotFound();
            }

            ReserveringViewModel reserveringVM = new ReserveringViewModel
            {
                Id = reservering.Id,
                Bedrag = reservering.Bedrag,
                Maand = reservering.Maand,
                Omschrijving = reservering.Omschrijving,
                Label = toLabelViewModelList(reservering.ReserveringLabels)
            };

            return Ok(reserveringVM);
        }

        // PUT: api/Reservering/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservering([FromRoute] int id, [FromBody] ReserveringPostModel reserveringPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != reserveringPM.Id)
            {
                return BadRequest();
            }

            Reservering reservering = _context.Reservering.Where(r => r.Id == id).Include(r => r.ReserveringLabels).First();
            reservering.Bedrag = reserveringPM.Bedrag;
            reservering.Maand = reserveringPM.Maand;
            reservering.Omschrijving = reserveringPM.Omschrijving;
            reservering.LaatstGewijzigd = DateTime.Now;

            reservering.ReserveringLabels.Clear();

            foreach (var newLabelId in reserveringPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                reservering.ReserveringLabels.Add
                (
                    nieuwReserveringLabel(reservering, label)
                );
            }

            _context.Entry(reservering).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReserveringExists(id))
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

        // POST: api/Reservering
        [HttpPost]
        public async Task<IActionResult> PostReservering([FromBody] ReserveringPostModel reserveringPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Reservering reservering = new Reservering
            {
                Id = reserveringPM.Id,
                Bedrag = reserveringPM.Bedrag,
                Maand = reserveringPM.Maand,
                Omschrijving = reserveringPM.Omschrijving,
                LaatstGewijzigd = DateTime.Now,
                ReserveringLabels = new List<ReserveringLabel>()
            };

            foreach (var newLabelId in reserveringPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                reservering.ReserveringLabels.Add
                (
                   nieuwReserveringLabel(reservering, label)
                );
            }

            _context.Reservering.Add(reservering);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReservering", new { id = reservering.Id }, reservering);
        }

        // DELETE: api/Reservering/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservering([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var reservering = await _context.Reservering.FindAsync(id);
            if (reservering == null)
            {
                return NotFound();
            }

            _context.Reservering.Remove(reservering);
            await _context.SaveChangesAsync();

            return Ok(reservering);
        }

        private bool ReserveringExists(int id)
        {
            return _context.Reservering.Any(e => e.Id == id);
        }

        private ReserveringLabel nieuwReserveringLabel(Reservering reservering, Label label)
        {
            return new ReserveringLabel
            {
                Reservering = reservering,
                Label = label,
                ReserveringId = reservering.Id,
                LabelId = label.Id
            };
        }
    }
}