using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyGrip.Models;
using MoneyGrip.Models.ViewModels;
using MoneyGrip.ViewModels;

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
        public IEnumerable<InkomstViewModel> GetInkomst()
        {
            IEnumerable<Inkomst> inkomsten = _context.Inkomst
                .Include(inkomst => inkomst.PersoonNavigation)
                .Include(inkomst => inkomst.InkomstLabels)
                .ThenInclude(inkomstLabel => inkomstLabel.Label)
                .OrderBy(i => i.Einddatum < DateTime.Now)
                .ThenBy(i => i.Begindatum);

            return inkomsten.Select(i => new InkomstViewModel
            {
                Id = i.Id,
                Persoon = i.PersoonNavigation != null ? new PersoonViewModel
                {
                    Id = i.PersoonNavigation.Id,
                    Voornaam = i.PersoonNavigation.Voornaam,
                    Achternaam = i.PersoonNavigation.Achternaam
                } : null,
                Bedrag = i.Bedrag,
                Begindatum = i.Begindatum,
                Einddatum = i.Einddatum,
                Interval = i.Interval,
                Label = inkomstLabelNaarLabel(i.InkomstLabels)
            });
        }

        // GET: api/Inkomst/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInkomst([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Inkomst inkomst = await _context.Inkomst
                .Where(i => i.Id == id)
                .Include(i => i.PersoonNavigation)
                .Include(i => i.InkomstLabels)
                .ThenInclude(inkomstLabel => inkomstLabel.Label)
                .FirstOrDefaultAsync();

            if (inkomst == null)
            {
                return NotFound();
            }

            InkomstViewModel inkomstVM = new InkomstViewModel
            {
                Id = inkomst.Id,
                Persoon = inkomst.PersoonNavigation != null ? new PersoonViewModel
                {
                    Id = inkomst.PersoonNavigation.Id,
                    Voornaam = inkomst.PersoonNavigation.Voornaam,
                    Achternaam = inkomst.PersoonNavigation.Achternaam
                } : null,
                Bedrag = inkomst.Bedrag,
                Begindatum = inkomst.Begindatum,
                Einddatum = inkomst.Einddatum,
                Interval = inkomst.Interval,
                Label = inkomstLabelNaarLabel(inkomst.InkomstLabels)
            };

            return Ok(inkomstVM);
        }

        // PUT: api/Inkomst/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInkomst([FromRoute] int id, [FromBody] InkomstPostModel inkomstVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != inkomstVM.Id)
            {
                return BadRequest();
            }

            Inkomst inkomst = _context.Inkomst.Where(i => i.Id == id).Include(i => i.InkomstLabels).First();
            inkomst.Persoon = inkomstVM.Persoon;
            inkomst.Bedrag = inkomstVM.Bedrag;
            inkomst.Begindatum = inkomstVM.Begindatum;
            inkomst.Einddatum = inkomstVM.Einddatum;
            inkomst.Interval = inkomstVM.Interval;
            inkomst.LaatstGewijzigd = DateTime.Now;

            inkomst.InkomstLabels.Clear();

            foreach (var newLabelId in inkomstVM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                inkomst.InkomstLabels.Add
                (
                    nieuwInkomstLabel(inkomst, label)
                );
            }

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
        public async Task<IActionResult> PostInkomst([FromBody] InkomstPostModel inkomstVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Inkomst inkomst = new Inkomst
            {
                Persoon = inkomstVM.Persoon,
                Bedrag = inkomstVM.Bedrag,
                Begindatum = inkomstVM.Begindatum,
                Einddatum = inkomstVM.Einddatum,
                Interval = inkomstVM.Interval,
                LaatstGewijzigd = DateTime.Now,
                InkomstLabels = new List<InkomstLabel>()
            };

            foreach (var newLabelId in inkomstVM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                inkomst.InkomstLabels.Add
                (
                   nieuwInkomstLabel(inkomst, label)
                );
            }

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

        private List<LabelViewModel> inkomstLabelNaarLabel(ICollection<InkomstLabel> inkomstLabels)
        {
            List<LabelViewModel> returnList = new List<LabelViewModel>();
            foreach(InkomstLabel ikl in inkomstLabels)
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

        private bool InkomstExists(int id)
        {
            return _context.Inkomst.Any(e => e.Id == id);
        }

        private InkomstLabel nieuwInkomstLabel(Inkomst inkomst, Label label)
        {
            return new InkomstLabel
            {
                Inkomst = inkomst,
                Label = label,
                InkomstId = inkomst.Id,
                LabelId = label.Id,
                LaatstGewijzigd = DateTime.Now
            };
        }
    }
}