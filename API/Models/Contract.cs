using System;
using System.Collections.Generic;

namespace MoneyGrip.Models
{
    public class Contract : BedragPerPeriode
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public byte[] Document { get; set; }
        public string DocumentNaam { get; set; }

        public virtual ICollection<ContractLabel> ContractLabels { get; set; }
    }
}
