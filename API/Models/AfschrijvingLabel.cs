using System;

namespace MoneyGrip.Models
{
    public class AfschrijvingLabel : BasisLabel
    {
        public int AfschrijvingId { get; set; }
        public Afschrijving Afschrijving { get; set; }
    }
}
