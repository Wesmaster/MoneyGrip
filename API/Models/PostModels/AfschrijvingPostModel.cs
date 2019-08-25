using System;
using Newtonsoft.Json;
using MoneyGrip.Models;
using System.Collections.Generic;

namespace MoneyGrip.ViewModels
{
    public class AfschrijvingPostModel
    {
        public int Id { get; set; }
        public List<int> Label { get; set; }
        public int Aankoopbedrag { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Aankoopdatum { get; set; }

        public short VerwachteLevensduur { get; set; }
        public short? Garantie { get; set; }
        public byte[] Factuur { get; set; }
        public string FactuurNaam { get; set; }
    }
}
