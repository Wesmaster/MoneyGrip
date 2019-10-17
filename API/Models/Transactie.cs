using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.Models
{
    public class Transactie
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Bedrag { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Datum { get; set; }
        public TransactieType Type { get; set; }
        public string Omschrijving { get; set; }
        public byte[] Document { get; set; }
        public string DocumentNaam { get; set; }
        public int VanRekening { get; set; }
        public int? NaarRekening { get; set; }

        public virtual ICollection<TransactieLabel> TransactieLabels { get; set; }
    }
}
