using System;
using System.Collections.Generic;

namespace MoneyGrip.Models
{
    public partial class Persoon
    {
        public Persoon()
        {
            Inkomst = new HashSet<Inkomst>();
        }

        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public string Voornaam { get; set; }
        public string Achternaam { get; set; }

        public ICollection<Inkomst> Inkomst { get; set; }
    }
}
