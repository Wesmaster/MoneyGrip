using Newtonsoft.Json;
using System;

namespace MoneyGrip.Models
{
    public class Budget : BedragPerPeriode
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Label { get; set; }

        public Label LabelNavigation { get; set; }
    }
}
