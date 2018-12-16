using Newtonsoft.Json;
using System;

namespace GoHAPI.Models
{
    public class Inkomst : BedragPerPeriode
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int? Label { get; set; }
        public int? Persoon { get; set; }

        public Label LabelNavigation { get; set; }
        public Persoon PersoonNavigation { get; set; }
    }
}
