using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mijnHuishoudenAPI.Models;

namespace mijnHuishoudenAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersoonController : ControllerBase
    {
        private readonly MijnHuishoudenContext _context;

        public PersoonController(MijnHuishoudenContext context)
        {
            _context = context;
        }

        // GET: api/Persoon
        [HttpGet]
        public IEnumerable<Persoon> GetPersoon()
        {
            return _context.Persoon.OrderBy(p => p.Achternaam).ThenBy(p => p.Voornaam);
        }

        // GET: api/Persoon/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPersoon([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var persoon = await _context.Persoon.FindAsync(id);

            if (persoon == null)
            {
                return NotFound();
            }

            return Ok(persoon);
        }

        // PUT: api/Persoon/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPersoon([FromRoute] int id, [FromBody] Persoon persoon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != persoon.Id)
            {
                return BadRequest();
            }

            persoon.LaatstGewijzigd = DateTime.Now;
            _context.Entry(persoon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersoonExists(id))
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

        // POST: api/Persoon
        [HttpPost]
        public async Task<IActionResult> PostPersoon([FromBody] Persoon persoon)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            persoon.LaatstGewijzigd = DateTime.Now;
            _context.Persoon.Add(persoon);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPersoon", new { id = persoon.Id }, persoon);
        }

        // DELETE: api/Persoon/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersoon([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var persoon = await _context.Persoon.FindAsync(id);
            if (persoon == null)
            {
                return NotFound();
            }

            _context.Persoon.Remove(persoon);
            await _context.SaveChangesAsync();

            return Ok(persoon);
        }

        private bool PersoonExists(int id)
        {
            return _context.Persoon.Any(e => e.Id == id);
        }
    }
}