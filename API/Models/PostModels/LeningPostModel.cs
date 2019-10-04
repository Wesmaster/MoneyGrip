using System;
using Newtonsoft.Json;
using MoneyGrip.Models;
using System.Collections.Generic;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.ViewModels
{
    public class LeningPostModel
    {
        public int Id { get; set; }
        public List<int> Label { get; set; }
        public int Bedrag { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }

        public short Looptijd { get; set; }
        public decimal Rente { get; set; }
        public LeningType Type { get; set; }
        public byte[] Document { get; set; }
        public string DocumentNaam { get; set; }
    }
}
