using Newtonsoft.Json;
using System;

namespace mijnHuishoudenAPI.Models
{
    public class Budget
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Label { get; set; }
        public int Bedrag { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime? Einddatum { get; set; }
        public byte Interval { get; set; }

        public Label LabelNavigation { get; set; }
    }
}
