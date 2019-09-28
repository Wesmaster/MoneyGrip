using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace MoneyGrip.Models
{
    public class Budget : BedragPerPeriode
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }

        public virtual ICollection<BudgetLabel> BudgetLabels { get; set; }
    }
}
