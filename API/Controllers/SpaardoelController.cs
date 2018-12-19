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
    public class SpaardoelController : ControllerBase
    {
        private readonly GoHContext _context;

        public SpaardoelController(GoHContext context)
        {
            _context = context;
        }

        // GET: api/Spaardoel
        [HttpGet]
        public IEnumerable<Spaardoel> GetSpaardoel()
        {
            return _context.Spaardoel.Include(s => s.LabelNavigation).OrderBy(l => l.LabelNavigation.Naam);
        }

        // GET: api/Spaardoel/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpaardoel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var spaardoel = await _context.Spaardoel.Include(s => s.LabelNavigation).FirstOrDefaultAsync(i => i.Id == id);

            if (spaardoel == null)
            {
                return NotFound();
            }

            return Ok(spaardoel);
        }

        // PUT: api/Spaardoel/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpaardoel([FromRoute] int id, [FromBody] Spaardoel spaardoel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != spaardoel.Id)
            {
                return BadRequest();
            }

            spaardoel.LaatstGewijzigd = DateTime.Now;
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
        public async Task<IActionResult> PostSpaardoel([FromBody] Spaardoel spaardoel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            spaardoel.LaatstGewijzigd = DateTime.Now;
            _context.Spaardoel.Add(spaardoel);
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

            _context.Spaardoel.Remove(spaardoel);
            await _context.SaveChangesAsync();

            return Ok(spaardoel);
        }

        private bool SpaardoelExists(int id)
        {
            return _context.Spaardoel.Any(e => e.Id == id);
        }
    }
}