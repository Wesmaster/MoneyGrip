using System;
using Newtonsoft.Json;
using MoneyGrip.Models;

namespace MoneyGrip.ViewModels
{
    public class AfschrijvingViewModel : BasisViewModel
    {
        public int Aankoopbedrag { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Aankoopdatum { get; set; }

        public short VerwachteLevensduur { get; set; }
        public int BedragPerMaand { get; set; }
        public short? Garantie { get; set; }
        public byte[] Factuur { get; set; }
        public string FactuurNaam { get; set; }
    }
}