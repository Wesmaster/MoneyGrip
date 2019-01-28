using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

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
        public void restore([FromBody] MyPostModel model)
        {
            var fileName = new SqlParameter("@FileName", model.fileName);
            _context.Database.ExecuteSqlCommand("USE master EXEC dbo.[Restore] @FileName", fileName);
        }
    }
}