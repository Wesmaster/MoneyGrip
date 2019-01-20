using Newtonsoft.Json;
using System;

namespace MoneyGrip.Models
{
    public class Spaardoel
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Label { get; set; }
        public byte? Percentage { get; set; }
        public int? Eindbedrag { get; set; }
        public byte EersteMaand { get; set; }
        public byte LaatsteMaand { get; set; }
        public string Omschrijving { get; set; }

        public Label LabelNavigation { get; set; }
    }
}
