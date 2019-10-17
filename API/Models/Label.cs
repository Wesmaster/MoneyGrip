using System;
using System.Collections.Generic;

namespace MoneyGrip.Models
{
    public partial class Label
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public string Naam { get; set; }

        public virtual ICollection<InkomstLabel> InkomstLabels { get; set; }
        public virtual ICollection<BudgetLabel> BudgetLabels { get; set; }
        public virtual ICollection<AfschrijvingLabel> AfschrijvingLabels { get; set; }
        public virtual ICollection<ContractLabel> ContractLabels { get; set; }
        public virtual ICollection<ReserveringLabel> ReserveringLabels { get; set; }
        public virtual ICollection<SpaardoelLabel> SpaardoelLabels { get; set; }
        public virtual ICollection<LeningLabel> LeningLabels { get; set; }
        public virtual ICollection<TransactieLabel> TransactieLabels { get; set; }
    }
}
