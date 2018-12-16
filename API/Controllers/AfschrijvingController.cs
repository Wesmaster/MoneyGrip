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
    public class AfschrijvingController : ControllerBase
    {
        private readonly GoHContext _context;

        public AfschrijvingController(GoHContext context)
        {
            _context = context;
        }

        // GET: api/Afschrijving
        [HttpGet]
        public IEnumerable<Afschrijving> GetAfschrijving()
        {
            return _context.Afschrijving.Include(s => s.LabelNavigation).ThenInclude(l => l.CategorieNavigation).OrderBy(l => l.LabelNavigation.CategorieNavigation.Naam).ThenBy(l => l.LabelNavigation.Naam);
        }

        // GET: api/Afschrijving/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAfschrijving([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var afschrijving = await _context.Afschrijving.Include(s => s.LabelNavigation).ThenInclude(l => l.CategorieNavigation).FirstOrDefaultAsync(i => i.Id == id);

            if (afschrijving == null)
            {
                return NotFound();
            }

            return Ok(afschrijving);
        }

        // PUT: api/Afschrijving/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAfschrijving([FromRoute] int id, [FromBody] Afschrijving afschrijving)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != afschrijving.Id)
            {
                return BadRequest();
            }

            afschrijving.LaatstGewijzigd = DateTime.Now;
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
        public async Task<IActionResult> PostAfschrijving([FromBody] Afschrijving afschrijving)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            afschrijving.LaatstGewijzigd = DateTime.Now;
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
    }
}