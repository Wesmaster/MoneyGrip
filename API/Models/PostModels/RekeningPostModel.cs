using System;
using Newtonsoft.Json;
using MoneyGrip.Models;

namespace MoneyGrip.ViewModels
{
    public class RekeningPostModel
    {
        public int Id { get; set; }
        public string Naam { get; set; }
        public string Iban { get; set; }
        public int Startbedrag { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Startdatum { get; set; }

        public bool? Hoofdrekening { get; set; }
        public int? Spaardoel { get; set; }
    }
}