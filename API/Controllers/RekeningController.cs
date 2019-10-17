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
    public class RekeningController : BasisController
    {
        private readonly Models.AppContext _context;

        public RekeningController(Models.AppContext context)
        {
            _context = context;
        }

        // GET: api/Rekening
        [HttpGet]
        public IEnumerable<RekeningenViewModel> GetRekening()
        {
            IEnumerable<Rekening> rekeningen = _context.Rekening;

            return rekeningen.Select(i => new RekeningenViewModel
            {
                Id = i.Id,
                Naam = i.Naam,
                Iban = i.Iban,
                Hoofdrekening = i.Hoofdrekening,
                Saldo = i.Startbedrag
            });
        }

        // GET: api/Rekening/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRekening([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var rekening = await _context.Rekening
                .Where(a => a.Id == id)
                .FirstOrDefaultAsync();


            if (rekening == null)
            {
                return NotFound();
            }

            RekeningViewModel rekeningVM = new RekeningViewModel()
            {
                Id = rekening.Id,
                Naam = rekening.Naam,
                Iban = rekening.Iban,
                Startbedrag = rekening.Startbedrag,
                Startdatum = rekening.Startdatum,
                Hoofdrekening = rekening.Hoofdrekening,
                Spaardoel = rekening.Spaardoel
            };

            return Ok(rekeningVM);
        }

        // PUT: api/Rekening/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRekening([FromRoute] int id, [FromBody] RekeningPostModel rekeningPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != rekeningPM.Id)
            {
                return BadRequest();
            }

            Rekening rekening = _context.Rekening.Where(a => a.Id == id).First();
            rekening.LaatstGewijzigd = DateTime.Now;
            rekening.Naam = rekeningPM.Naam;
            rekening.Iban = rekeningPM.Iban;
            rekening.Hoofdrekening = rekeningPM.Hoofdrekening;
            rekening.Startbedrag = rekeningPM.Startbedrag;
            rekening.Startdatum = rekeningPM.Startdatum;
            rekening.Spaardoel = rekeningPM.Spaardoel;

            _context.Entry(rekening).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RekeningExists(id))
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

        // POST: api/Rekening
        [HttpPost]
        public async Task<IActionResult> PostRekening([FromBody] RekeningPostModel rekeningPM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Rekening rekening = new Rekening()
            {
                LaatstGewijzigd = DateTime.Now,
                Naam = rekeningPM.Naam,
                Iban = rekeningPM.Iban,
                Hoofdrekening = rekeningPM.Hoofdrekening,
                Startbedrag = rekeningPM.Startbedrag,
                Startdatum = rekeningPM.Startdatum,
                Spaardoel = rekeningPM.Spaardoel
            };

            _context.Rekening.Add(rekening);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRekening", new { id = rekening.Id }, rekening);
        }

        // DELETE: api/Rekening/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRekening([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var rekening = await _context.Rekening.FindAsync(id);
            if (rekening == null)
            {
                return NotFound();
            }

            _context.Rekening.Remove(rekening);
            await _context.SaveChangesAsync();

            return Ok(rekening);
        }

        private bool RekeningExists(int id)
        {
            return _context.Rekening.Any(e => e.Id == id);
        }
    }
}