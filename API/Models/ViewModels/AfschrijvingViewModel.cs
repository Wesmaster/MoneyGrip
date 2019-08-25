using System;
using Newtonsoft.Json;
using MoneyGrip.Models;
using System.Collections.Generic;
using MoneyGrip.Models.ViewModels;

namespace MoneyGrip.ViewModels
{
    public class AfschrijvingViewModel : BasisViewModel
    {
        public int Aankoopbedrag { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Aankoopdatum { get; set; }

        public short VerwachteLevensduur { get; set; }
        public short? Garantie { get; set; }
        public byte[] Factuur { get; set; }
        public string FactuurNaam { get; set; }
    }
}
