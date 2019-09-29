using Newtonsoft.Json;
using System;

namespace MoneyGrip.Models
{
    public class Lening
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Bedrag { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }
        public short Looptijd { get; set; }
        public decimal Rente { get; set; }
        public byte Type { get; set; }
        public byte[] Document { get; set; }
        public string DocumentNaam { get; set; }
    }
}
