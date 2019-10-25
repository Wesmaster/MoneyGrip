using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyGrip.Models;
using MoneyGrip.ViewModels;

namespace MoneyGrip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactieController : BasisController
    {
        private readonly Models.AppContext _context;
        private readonly IEnumerable<Rekening> rekeningen;

        public TransactieController(Models.AppContext context)
        {
            _context = context;
            rekeningen = _context.Rekening;
        }

        // GET: api/Transactie
        [HttpGet]
        public IEnumerable<int> GetJaarFilter()
        {
            IQueryable<int> transactieJaren = _context.Transactie.Select(i => i.Datum.Year).Distinct();

            return transactieJaren;
        }

        // GET: api/Transactie
        [HttpGet("{jaar}/{maand}")]
        public IEnumerable<TransactiesViewModel> GetTransactie([FromRoute] int jaar, int maand)
        {
            IEnumerable<Transactie> transacties = _context.Transactie
                .Where(t => t.Datum.Year == jaar && (maand >= 1 ? t.Datum.Month == maand : true))
                .Include(transactie => transactie.TransactieLabels)
                .ThenInclude(transactieLabel => transactieLabel.Label);

            return transacties.Select(i => new TransactiesViewModel
            {
                Id = i.Id,
                Bedrag = i.Bedrag,
                Dag = i.Datum.Day,
                Omschrijving = i.Omschrijving,
                Type = i.Type,
                Document = i.Document,
                DocumentNaam = i.DocumentNaam,
                VanRekening = rekeningen.FirstOrDefault(r => r.Id == i.VanRekening)?.Naam,
                NaarRekening = rekeningen.FirstOrDefault(r => r.Id == i.NaarRekening)?.Naam,
                Label = toLabelViewModelList(i.TransactieLabels),
            });
        }

        // GET: api/Transactie/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransactie([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transactie = await _context.Transactie
                .Where(a => a.Id == id)
                .Include(a => a.TransactieLabels)
                .ThenInclude(transactieLabel => transactieLabel.Label)
                .FirstOrDefaultAsync();

            if (transactie == null)
            {
                return NotFound();
            }

            TransactieViewModel transactieVM = new TransactieViewModel()
            {
                Id = transactie.Id,
                Label = toLabelViewModelList(transactie.TransactieLabels),
                Datum = transactie.Datum,
                Bedrag = transactie.Bedrag,
                Omschrijving = transactie.Omschrijving,
                Type = transactie.Type,
                Document = transactie.Document,
                DocumentNaam = transactie.DocumentNaam,
                VanRekening = transactie.VanRekening,
                NaarRekening = transactie.NaarRekening
            };

            return Ok(transactieVM);
        }

        // PUT: api/Transactie/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransactie([FromRoute] int id, [FromBody] TransactiePostModel transactiePM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != transactiePM.Id)
            {
                return BadRequest();
            }

            Transactie transactie = _context.Transactie.Where(a => a.Id == id).Include(a => a.TransactieLabels).First();
            transactie.LaatstGewijzigd = DateTime.Now;
            transactie.Bedrag = transactiePM.Bedrag;
            transactie.Datum = transactiePM.Datum;
            transactie.Omschrijving = transactiePM.Omschrijving;
            transactie.Type = transactiePM.Type;
            transactie.Document = transactiePM.Document;
            transactie.DocumentNaam = transactiePM.DocumentNaam;
            transactie.VanRekening = transactiePM.VanRekening;
            transactie.NaarRekening = transactiePM.NaarRekening;

            transactie.TransactieLabels.Clear();

            foreach (var newLabelId in transactiePM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                transactie.TransactieLabels.Add
                (
                    nieuwTransactieLabel(transactie, label)
                );
            }

            _context.Entry(transactie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactieExists(id))
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

        // POST: api/Transactie
        [HttpPost("{id}")]
        public async Task<IActionResult> DupliceerTransactie([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Transactie bronTransactie = _context.Transactie
                .Include(a => a.TransactieLabels)
                .ThenInclude(transactieLabel => transactieLabel.Label)
                .FirstOrDefault(t => t.Id == id);

            Transactie transactie = new Transactie()
            {
                LaatstGewijzigd = DateTime.Now,
                Bedrag = bronTransactie.Bedrag,
                Datum = bronTransactie.Datum,
                Omschrijving = bronTransactie.Omschrijving,
                Type = bronTransactie.Type,
                Document = bronTransactie.Document,
                DocumentNaam = bronTransactie.DocumentNaam,
                VanRekening = bronTransactie.VanRekening,
                NaarRekening = bronTransactie.NaarRekening,
                TransactieLabels = new List<TransactieLabel>()
            };

            foreach (var transactieLabel in bronTransactie.TransactieLabels)
            {
                Label label = _context.Label.Where(l => l.Id == transactieLabel.LabelId).First();
                transactie.TransactieLabels.Add
                (
                    nieuwTransactieLabel(transactie, label)
                );
            }

            _context.Transactie.Add(transactie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransactie", new { id = transactie.Id }, transactie);
        }

        // POST: api/Transactie
        [HttpPost]
        public async Task<IActionResult> PostTransactie([FromBody] TransactiePostModel transactiePM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Transactie transactie = new Transactie()
            {
                LaatstGewijzigd = DateTime.Now,
                Bedrag = transactiePM.Bedrag,
                Datum = transactiePM.Datum,
                Omschrijving = transactiePM.Omschrijving,
                Type = transactiePM.Type,
                Document = transactiePM.Document,
                DocumentNaam = transactiePM.DocumentNaam,
                VanRekening = transactiePM.VanRekening,
                NaarRekening = transactiePM.NaarRekening,
                TransactieLabels = new List<TransactieLabel>()
            };

            foreach (var newLabelId in transactiePM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                transactie.TransactieLabels.Add
                (
                    nieuwTransactieLabel(transactie, label)
                );
            }

            _context.Transactie.Add(transactie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransactie", new { id = transactie.Id }, transactie);
        }

        // DELETE: api/Transactie/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransactie([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transactie = await _context.Transactie.FindAsync(id);
            if (transactie == null)
            {
                return NotFound();
            }

            _context.Transactie.Remove(transactie);
            await _context.SaveChangesAsync();

            return Ok(transactie);
        }

        private bool TransactieExists(int id)
        {
            return _context.Transactie.Any(e => e.Id == id);
        }

        private TransactieLabel nieuwTransactieLabel(Transactie transactie, Label label)
        {
            return new TransactieLabel
            {
                Transactie = transactie,
                Label = label,
                TransactieId = transactie.Id,
                LabelId = label.Id
            };
        }
    }
}