using System;
using Newtonsoft.Json;
using static MoneyGrip.Data.Enums;
using MoneyGrip.Models;

namespace MoneyGrip.ViewModels
{
    public class ContractViewModel : BasisViewModel
    {
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
