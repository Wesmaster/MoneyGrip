using Newtonsoft.Json;
using System;

namespace MoneyGrip.Models
{
    public class Rekening
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public string Naam { get; set; }
        public string Iban { get; set; }
        public bool? Hoofdrekening { get; set; }
        public int Startbedrag { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Startdatum { get; set; }
        public int? Spaardoel { get; set; }
    }
}
