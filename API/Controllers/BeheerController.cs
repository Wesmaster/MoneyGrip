using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MoneyGrip.Models;

namespace MoneyGrip.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeheerController : ControllerBase
    {
        private readonly Models.AppContext _context;

        public BeheerController(Models.AppContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<BackupOverzicht> GetBackupOverzicht()
        {
            return _context.BackupOverzicht.OrderByDescending(b => b.Id);
        }

        [HttpPost]
        public void backup()
        {
            _context.Database.ExecuteSqlCommand("EXEC dbo.[Backup]");
        }

        public class MyPostModel
        {
            public string fileName { get; set; }
        }

        [HttpPut]
        public void restore([FromBody] BackupOverzicht model)
        {
            var fileName = new SqlParameter("@FileName", model.Bestandsnaam);
            _context.Database.ExecuteSqlCommand("USE master EXEC dbo.[Restore] @FileName", fileName);
            _context.Database.ExecuteSqlCommand("EXEC dbo.[DeleteBackup] @FileName", fileName);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBackup([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var backup = await _context.BackupOverzicht.FindAsync(id);
            if (backup == null)
            {
                return NotFound();
            }

            var fileName = new SqlParameter("@FileName", backup.Bestandsnaam);
            _context.Database.ExecuteSqlCommand("EXEC dbo.[DeleteBackup] @FileName", fileName);

            _context.BackupOverzicht.Remove(backup);
            await _context.SaveChangesAsync();

            return Ok(backup);
        }
    }
}