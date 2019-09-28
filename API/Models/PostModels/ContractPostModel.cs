using System;
using Newtonsoft.Json;
using static MoneyGrip.Data.Enums;
using MoneyGrip.Models;
using System.Collections.Generic;

namespace MoneyGrip.ViewModels
{
    public class ContractPostModel
    {
        public int Id { get; set; }
        public List<int> Label { get; set; }
        public int Bedrag { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime? Einddatum { get; set; }

        public Interval Interval { get; set; }

        public byte[] Document { get; set; }
        public string DocumentNaam { get; set; }
    }
}
