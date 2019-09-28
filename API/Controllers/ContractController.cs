using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoneyGrip.Models;
using MoneyGrip.ViewModels;

namespace MoneyGrip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractController : BasisController
    {
        private readonly Models.AppContext _context;

        public ContractController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Contract
        [HttpGet]
        public IEnumerable<ContractViewModel> GetContract()
        {
            IEnumerable<Contract> contracten = _context.Contract
            .Include(contract => contract.ContractLabels)
            .ThenInclude(contractLabel => contractLabel.Label)
            .OrderBy(c => c.Einddatum < DateTime.Now)
            .ThenBy(c => c.Einddatum == null)
            .ThenBy(c => c.Einddatum)
            .ThenBy(c => c.Begindatum);

           // .OrderByDescending(c => c.Begindatum <= DateTime.Now && (c.Einddatum >= DateTime.Now || c.Einddatum == null)).ThenBy(c => c.Einddatum == null).ThenBy(c => c.Einddatum);

            return contracten.Select(c => new ContractViewModel
            {
                Id = c.Id,
                Bedrag = c.Bedrag,
                Begindatum = c.Begindatum,
                Einddatum = c.Einddatum,
                Interval = c.Interval,
                Document = c.Document,
                DocumentNaam = c.DocumentNaam,
                Label = toLabelViewModelList(c.ContractLabels)
            });
        }

        // GET: api/Contract/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContract([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Contract contract = await _context.Contract
            .Where(i => i.Id == id)
            .Include(i => i.ContractLabels)
            .ThenInclude(contractLabel => contractLabel.Label)
            .FirstOrDefaultAsync();

            if (contract == null)
            {
                return NotFound();
            }

            ContractViewModel contractVM = new ContractViewModel
            {
                Id = contract.Id,
                Bedrag = contract.Bedrag,
                Begindatum = contract.Begindatum,
                Einddatum = contract.Einddatum,
                Interval = contract.Interval,
                Document = contract.Document,
                DocumentNaam = contract.DocumentNaam,
                Label = toLabelViewModelList(contract.ContractLabels)
            };

            return Ok(contractVM);
        }

        // PUT: api/Contract/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContract([FromRoute] int id, [FromBody] ContractPostModel contractPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contractPM.Id)
            {
                return BadRequest();
            }

            Contract contract = _context.Contract.Where(i => i.Id == id).Include(i => i.ContractLabels).First();
            contract.Bedrag = contractPM.Bedrag;
            contract.Begindatum = contractPM.Begindatum;
            contract.Einddatum = contractPM.Einddatum;
            contract.Interval = contractPM.Interval;
            contract.Document = contractPM.Document;
            contract.DocumentNaam = contractPM.DocumentNaam;
            contract.LaatstGewijzigd = DateTime.Now;

            contract.ContractLabels.Clear();

            foreach (var newLabelId in contractPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                contract.ContractLabels.Add
                (
                    nieuwContractLabel(contract, label)
                );
            }

            _context.Entry(contract).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContractExists(id))
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

        // POST: api/Contract
        [HttpPost]
        public async Task<IActionResult> PostContract([FromBody] ContractPostModel contractPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Contract contract = new Contract
            {
                Bedrag = contractPM.Bedrag,
                Begindatum = contractPM.Begindatum,
                Einddatum = contractPM.Einddatum,
                Interval = contractPM.Interval,
                Document = contractPM.Document,
                DocumentNaam = contractPM.DocumentNaam,
                LaatstGewijzigd = DateTime.Now,
                ContractLabels = new List<ContractLabel>()
            };

            foreach (var newLabelId in contractPM.Label)
            {
                Label label = _context.Label.Where(l => l.Id == newLabelId).First();
                contract.ContractLabels.Add
                (
                   nieuwContractLabel(contract, label)
                );
            }

            _context.Contract.Add(contract);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContract", new { id = contract.Id }, contract);
        }

        // DELETE: api/Contract/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContract([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contract = await _context.Contract.FindAsync(id);
            if (contract == null)
            {
                return NotFound();
            }

            _context.Contract.Remove(contract);
            await _context.SaveChangesAsync();

            return Ok(contract);
        }

        private bool ContractExists(int id)
        {
            return _context.Contract.Any(e => e.Id == id);
        }

        private ContractLabel nieuwContractLabel(Contract contract, Label label)
        {
            return new ContractLabel
            {
                Contract = contract,
                Label = label,
                ContractId = contract.Id,
                LabelId = label.Id
            };
        }
    }
}