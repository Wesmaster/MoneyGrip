using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyGrip.Models
{
    public class BackupOverzicht
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public string Bestandsnaam { get; set; }
    }
}
