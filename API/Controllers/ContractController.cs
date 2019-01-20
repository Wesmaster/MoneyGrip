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
    public class ContractController : ControllerBase
    {
        private readonly Models.AppContext _context;

        public ContractController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Contract
        [HttpGet]
        public IEnumerable<Contract> GetContract()
        {
            return _context.Contract.Include(s => s.LabelNavigation).ThenInclude(l => l.CategorieNavigation).OrderBy(l => l.LabelNavigation.CategorieNavigation.Naam).ThenBy(l => l.LabelNavigation.Naam);
        }

        // GET: api/Contract/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContract([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contract = await _context.Contract.Include(s => s.LabelNavigation).ThenInclude(l => l.CategorieNavigation).FirstOrDefaultAsync(i => i.Id == id);

            if (contract == null)
            {
                return NotFound();
            }

            return Ok(contract);
        }

        // PUT: api/Contract/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContract([FromRoute] int id, [FromBody] Contract contract)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contract.Id)
            {
                return BadRequest();
            }

            contract.LaatstGewijzigd = DateTime.Now;
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

            return Ok();
        }

        // POST: api/Contract
        [HttpPost]
        public async Task<IActionResult> PostContract([FromBody] Contract contract)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            contract.LaatstGewijzigd = DateTime.Now;
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
    }
}