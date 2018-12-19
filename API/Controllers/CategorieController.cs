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
    public class CategorieController : ControllerBase
    {
        private readonly GoHContext _context;

        public CategorieController(GoHContext context)
        {
            _context = context;
        }

        // GET: api/Categorie
        [HttpGet]
        public IEnumerable<Categorie> GetCategorie()
        {
            return _context.Categorie.OrderBy(c => c.Naam);
        }

        // GET: api/Categorie/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategorie([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var categorie = await _context.Categorie.FindAsync(id);

            if (categorie == null)
            {
                return NotFound();
            }

            return Ok(categorie);
        }

        // PUT: api/Categorie/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategorie([FromRoute] int id, [FromBody] Categorie categorie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != categorie.Id)
            {
                return BadRequest();
            }

            categorie.LaatstGewijzigd = DateTime.Now;
            _context.Entry(categorie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategorieExists(id))
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

        // POST: api/Categorie
        [HttpPost]
        public async Task<IActionResult> PostCategorie([FromBody] Categorie categorie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            categorie.LaatstGewijzigd = DateTime.Now;
            _context.Categorie.Add(categorie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategorie", new { id = categorie.Id }, categorie);
        }

        // DELETE: api/Categorie/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategorie([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var categorie = await _context.Categorie.FindAsync(id);
            if (categorie == null)
            {
                return NotFound();
            }

            _context.Categorie.Remove(categorie);
            await _context.SaveChangesAsync();

            return Ok(categorie);
        }

        private bool CategorieExists(int id)
        {
            return _context.Categorie.Any(e => e.Id == id);
        }
    }
}