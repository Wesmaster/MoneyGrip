using System;
using Newtonsoft.Json;
using MoneyGrip.Models;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.ViewModels
{
    public class LeningViewModel : BasisViewModel
    {
        public int Bedrag { get; set; }
        public int BedragPerMaand { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }

        public short Looptijd { get; set; }
        public decimal Rente { get; set; }
        public LeningType Type { get; set; }
        public byte[] Document { get; set; }
        public string DocumentNaam { get; set; }
    }
}