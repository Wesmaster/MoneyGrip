using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyGrip.Models
{
    public class Contract : BedragPerPeriode
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int? Label { get; set; }
        public byte[] Document { get; set; }

        public Label LabelNavigation { get; set; }
    }
}
