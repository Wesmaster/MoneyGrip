using System;

namespace MoneyGrip.Models
{
    public class BudgetLabel
    {
        public int BudgetId { get; set; }
        public Budget Budget { get; set; }

        public int LabelId { get; set; }
        public virtual Label Label { get; set; }
    }
}
