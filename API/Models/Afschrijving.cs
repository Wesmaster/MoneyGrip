using Newtonsoft.Json;
using System;

namespace MoneyGrip.Models
{
    public class Afschrijving
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Label { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Aankoopdatum { get; set; }
        public int Aankoopbedrag { get; set; }
        public short VerwachteLevensduur { get; set; }
        public short? Garantie { get; set; }
        public byte[] Factuur { get; set; }
        public string FactuurNaam { get; set; }

        public Label LabelNavigation { get; set; }
    }
}
