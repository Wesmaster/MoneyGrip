using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyGrip.Models;

namespace MoneyGrip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InkomstController : ControllerBase
    {
        private readonly Models.AppContext _context;

        public InkomstController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Inkomst
        [HttpGet]
        public IEnumerable<Inkomst> GetInkomst()
        {
            return _context.Inkomst.Include(s => s.PersoonNavigation).Include(l => l.LabelNavigation).OrderBy(l => l.LabelNavigation.Naam).ThenBy(l => l.PersoonNavigation.Achternaam).ThenBy(p => p.PersoonNavigation.Voornaam);
        }

        // GET: api/Inkomst/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInkomst([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var inkomst = await _context.Inkomst.Include(s => s.PersoonNavigation).Include(l => l.LabelNavigation).FirstOrDefaultAsync(i => i.Id == id);

            if (inkomst == null)
            {
                return NotFound();
            }

            return Ok(inkomst);
        }

        // PUT: api/Inkomst/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInkomst([FromRoute] int id, [FromBody] Inkomst inkomst)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != inkomst.Id)
            {
                return BadRequest();
            }

            inkomst.LaatstGewijzigd = DateTime.Now;
            _context.Entry(inkomst).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InkomstExists(id))
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

        // POST: api/Inkomst
        [HttpPost]
        public async Task<IActionResult> PostInkomst([FromBody] Inkomst inkomst)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            inkomst.LaatstGewijzigd = DateTime.Now;
            _context.Inkomst.Add(inkomst);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInkomst", new { id = inkomst.Id }, inkomst);
        }

        // DELETE: api/Inkomst/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInkomst([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var inkomst = await _context.Inkomst.FindAsync(id);
            if (inkomst == null)
            {
                return NotFound();
            }

            _context.Inkomst.Remove(inkomst);
            await _context.SaveChangesAsync();

            return Ok(inkomst);
        }

        private bool InkomstExists(int id)
        {
            return _context.Inkomst.Any(e => e.Id == id);
        }
    }
}