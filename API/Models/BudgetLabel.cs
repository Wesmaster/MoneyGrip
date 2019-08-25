using System;

namespace MoneyGrip.Models
{
    public class BudgetLabel : BasisLabel
    {
        public int BudgetId { get; set; }
        public Budget Budget { get; set; }
    }
}
