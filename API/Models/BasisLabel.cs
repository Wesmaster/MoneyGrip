using System;

namespace MoneyGrip.Models
{
    public class BasisLabel
    {
        public int LabelId { get; set; }
        public virtual Label Label { get; set; }
    }
}
