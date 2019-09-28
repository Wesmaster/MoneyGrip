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
    public class LabelController : ControllerBase
    {
        private readonly Models.AppContext _context;

        public LabelController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Label
        [HttpGet]
        public IEnumerable<Label> GetLabel()
        {
            return _context.Label.OrderBy(l => l.Naam);
        }

        // GET: api/Label/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLabel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var label = await _context.Label.FirstOrDefaultAsync(i => i.Id == id);

            if (label == null)
            {
                return NotFound();
            }

            return Ok(label);
        }

        // PUT: api/Label/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLabel([FromRoute] int id, [FromBody] Label label)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != label.Id)
            {
                return BadRequest();
            }

            label.LaatstGewijzigd = DateTime.Now;
            _context.Entry(label).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LabelExists(id))
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

        // POST: api/Label
        [HttpPost]
        public async Task<IActionResult> PostLabel([FromBody] Label label)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            label.LaatstGewijzigd = DateTime.Now;
            _context.Label.Add(label);
            await _context.SaveChangesAsync();

            return Ok(label.Id);
        }

        // DELETE: api/Label/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLabel([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var label = await _context.Label.FindAsync(id);
            if (label == null)
            {
                return NotFound();
            }

            _context.Label.Remove(label);
            await _context.SaveChangesAsync();

            return Ok(label);
        }

        private bool LabelExists(int id)
        {
            return _context.Label.Any(e => e.Id == id);
        }
    }
}