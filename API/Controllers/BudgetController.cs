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
    public class BudgetController : ControllerBase
    {
        private readonly MijnHuishoudenContext _context;

        public BudgetController(MijnHuishoudenContext context)
        {
            _context = context;
        }

        // GET: api/Budget
        [HttpGet]
        public IEnumerable<Budget> GetBudget()
        {
            return _context.Budget.Include(s => s.LabelNavigation).ThenInclude(l => l.CategorieNavigation).OrderBy(l => l.LabelNavigation.CategorieNavigation.Naam).ThenBy(l => l.LabelNavigation.Naam);
        }

        // GET: api/Budget/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBudget([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var budget = await _context.Budget.Include(s => s.LabelNavigation).ThenInclude(l => l.CategorieNavigation).FirstOrDefaultAsync(i => i.Id == id);

            if (budget == null)
            {
                return NotFound();
            }

            return Ok(budget);
        }

        // PUT: api/Budget/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBudget([FromRoute] int id, [FromBody] Budget budget)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != budget.Id)
            {
                return BadRequest();
            }

            budget.LaatstGewijzigd = DateTime.Now;
            _context.Entry(budget).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BudgetExists(id))
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

        // POST: api/Budget
        [HttpPost]
        public async Task<IActionResult> PostBudget([FromBody] Budget budget)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (BudgetOverlap(budget))
            {
                return Conflict();
            }

            budget.LaatstGewijzigd = DateTime.Now;
            _context.Budget.Add(budget);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBudget", new { id = budget.Id }, budget);
        }

        // DELETE: api/Budget/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var budget = await _context.Budget.FindAsync(id);
            if (budget == null)
            {
                return NotFound();
            }

            _context.Budget.Remove(budget);
            await _context.SaveChangesAsync();

            return Ok(budget);
        }

        private bool BudgetExists(int id)
        {
            return _context.Budget.Any(e => e.Id == id);
        }

        private bool BudgetOverlap(Budget budget)
        {
            var result = _context.Budget.Where(b => b.Label == budget.Label && ((b.Einddatum >= budget.Begindatum || b.Einddatum == null) && (b.Begindatum <= budget.Einddatum || budget.Einddatum == null)));
            return result.Count() > 0;
        }
    }
}