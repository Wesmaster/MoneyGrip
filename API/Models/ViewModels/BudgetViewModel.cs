using System;
using Newtonsoft.Json;
using static MoneyGrip.Data.Enums;
using MoneyGrip.Models;

namespace MoneyGrip.ViewModels
{
    public class BudgetViewModel : BasisViewModel
    {
        public int Bedrag { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }

        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime? Einddatum { get; set; }

        public Interval Interval { get; set; }
    }
}
