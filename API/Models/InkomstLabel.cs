using System;

namespace MoneyGrip.Models
{
    public class InkomstLabel
    {
        public int InkomstId { get; set; }
        public Inkomst Inkomst { get; set; }

        public int LabelId { get; set; }
        public virtual Label Label { get; set; }

        public DateTime LaatstGewijzigd { get; set; }
    }
}
