using System;
using Newtonsoft.Json;
using static MoneyGrip.Data.Enums;
using MoneyGrip.Models;
using System.Collections.Generic;
using MoneyGrip.Models.ViewModels;

namespace MoneyGrip.ViewModels
{
    public class InkomstViewModel
    {
        public int Id { get; set; }
        public List<LabelViewModel> Label { get; set; }
        public PersoonViewModel Persoon { get; set; }
        public int Bedrag { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime? Einddatum { get; set; }

        public Interval Interval { get; set; }
    }
}
