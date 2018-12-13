using Newtonsoft.Json;
using System;

namespace mijnHuishoudenAPI.Models
{
    public class Spaardoel
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Label { get; set; }
        public byte? Percentage { get; set; }
        public int? Eindbedrag { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime? Einddatum { get; set; }
        public string Omschrijving { get; set; }

        public Label LabelNavigation { get; set; }
    }
}
