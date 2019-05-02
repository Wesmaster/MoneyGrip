using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyGrip.Models;

namespace MoneyGrip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReserveringController : ControllerBase
    {
        private readonly Models.AppContext _context;

        public ReserveringController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Reservering
        [HttpGet]
        public IEnumerable<Reservering> GetReservering()
        {
            return _context.Reservering.Include(s => s.LabelNavigation).ThenInclude(l => l.CategorieNavigation).OrderBy(l => l.Maand).ThenBy(l => l.LabelNavigation.CategorieNavigation.Naam).ThenBy(l => l.LabelNavigation.Naam);
        }

        // GET: api/Reservering/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReservering([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var reservering = await _context.Reservering.Include(s => s.LabelNavigation).ThenInclude(l => l.CategorieNavigation).FirstOrDefaultAsync(i => i.Id == id);

            if (reservering == null)
            {
                return NotFound();
            }

            return Ok(reservering);
        }

        // PUT: api/Reservering/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservering([FromRoute] int id, [FromBody] Reservering reservering)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != reservering.Id)
            {
                return BadRequest();
            }

            reservering.LaatstGewijzigd = DateTime.Now;
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
        public async Task<IActionResult> PostReservering([FromBody] Reservering reservering)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            reservering.LaatstGewijzigd = DateTime.Now;
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
    }
}