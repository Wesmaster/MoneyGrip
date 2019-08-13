using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyGrip.Models;
using MoneyGrip.Models.ViewModels;
using MoneyGrip.ViewModels;

namespace MoneyGrip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly Models.AppContext _context;

        public BudgetController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Budget
        [HttpGet]
        public IEnumerable<BudgetViewModel> GetBudget()
        {
           // return _context.Budget.Include(s => s.LabelNavigation).ThenInclude(l => l.CategorieNavigation).OrderBy(l => l.LabelNavigation.CategorieNavigation.Naam).ThenBy(l => l.LabelNavigation.Naam);

            IEnumerable<Budget> budgetten = _context.Budget
            .Include(budget => budget.BudgetLabels)
            .ThenInclude(budgetLabel => budgetLabel.Label)
            .OrderByDescending(c => c.Begindatum <= DateTime.Now && (c.Einddatum >= DateTime.Now || c.Einddatum == null)).ThenBy(c => c.Einddatum == null).ThenBy(c => c.Einddatum);

            return budgetten.Select(i => new BudgetViewModel
            {
                Id = i.Id,
                Bedrag = i.Bedrag,
                Begindatum = i.Begindatum,
                Einddatum = i.Einddatum,
                Interval = i.Interval,
                Label = budgetLabelNaarLabel(i.BudgetLabels)
            });
        }

        // GET: api/Budget/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBudget([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Budget budget = await _context.Budget
            .Where(i => i.Id == id)
            .Include(i => i.BudgetLabels)
            .ThenInclude(budgetLabel => budgetLabel.Label)
            .FirstOrDefaultAsync();

            if (budget == null)
            {
                return NotFound();
            }

            BudgetViewModel budgetVM = new BudgetViewModel
            {
                Id = budget.Id,
                Bedrag = budget.Bedrag,
                Begindatum = budget.Begindatum,
                Einddatum = budget.Einddatum,
                Interval = budget.Interval,
                Label = budgetLabelNaarLabel(budget.BudgetLabels)
            };

            return Ok(budgetVM);
        }

        // PUT: api/Budget/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBudget([FromRoute] int id, [FromBody] BudgetPostModel budgetPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != budgetPM.Id)
            {
                return BadRequest();
            }

            Budget budget = _context.Budget.Where(i => i.Id == id).Include(i => i.BudgetLabels).First();
            budget.Bedrag = budgetPM.Bedrag;
            budget.Begindatum = budgetPM.Begindatum;
            budget.Einddatum = budgetPM.Einddatum;
            budget.Interval = budgetPM.Interval;
            budget.LaatstGewijzigd = DateTime.Now;

            budget.BudgetLabels.Clear();

            foreach (var newLabelId in budgetPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                budget.BudgetLabels.Add
                (
                    nieuwBudgetLabel(budget, label)
                );
            }

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
        public async Task<IActionResult> PostBudget([FromBody] BudgetPostModel budgetPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (BudgetOverlap(budgetPM))
            {
                return Conflict();
            }

            Budget budget = new Budget
            {
                Bedrag = budgetPM.Bedrag,
                Begindatum = budgetPM.Begindatum,
                Einddatum = budgetPM.Einddatum,
                Interval = budgetPM.Interval,
                LaatstGewijzigd = DateTime.Now,
                BudgetLabels = new List<BudgetLabel>()
            };

            foreach (var newLabelId in budgetPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                budget.BudgetLabels.Add
                (
                   nieuwBudgetLabel(budget, label)
                );
            }

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

        private bool BudgetOverlap(BudgetPostModel budgetPM)
        {
           // return false;
            var result = _context.Budget
                            .Include(budget => budget.BudgetLabels)
                            .ThenInclude(budgetLabel => budgetLabel.Label)
                            .Where(b => b.BudgetLabels.All(l => budgetPM.Label.Any(PMl => PMl ==l.LabelId))  && ((b.Einddatum >= budgetPM.Begindatum || b.Einddatum == null) && (b.Begindatum <= budgetPM.Einddatum || budgetPM.Einddatum == null)));
            return result.Count() > 0;
        }

        private List<LabelViewModel> budgetLabelNaarLabel(ICollection<BudgetLabel> budgetLabels)
        {
            List<LabelViewModel> returnList = new List<LabelViewModel>();
            foreach (BudgetLabel ikl in budgetLabels)
            {
                LabelViewModel lvm = new LabelViewModel
                {
                    Id = ikl.LabelId,
                    Naam = ikl.Label.Naam
                };
                returnList.Add(lvm);

            }
            return returnList;
        }

        private BudgetLabel nieuwBudgetLabel(Budget budget, Label label)
        {
            return new BudgetLabel
            {
                Budget = budget,
                Label = label,
                BudgetId = budget.Id,
                LabelId = label.Id
            };
        }
    }
}