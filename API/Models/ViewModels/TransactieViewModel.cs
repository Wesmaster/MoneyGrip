using System;
using Newtonsoft.Json;
using MoneyGrip.Models;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.ViewModels
{
    public class TransactieViewModel : BasisViewModel
    {
        public int Bedrag { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Datum { get; set; }

        public string Omschrijving { get; set; }
        public TransactieType Type { get; set; }
        public byte[] Document { get; set; }
        public string DocumentNaam { get; set; }
        public int VanRekening { get; set; }
        public int? NaarRekening { get; set; }
    }
}