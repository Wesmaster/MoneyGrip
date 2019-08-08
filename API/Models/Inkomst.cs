using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace MoneyGrip.Models
{
    public class Inkomst : BedragPerPeriode
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int? Persoon { get; set; }

        public virtual ICollection<InkomstLabel> InkomstLabels { get; set; }
        public Persoon PersoonNavigation { get; set; }
    }
}
