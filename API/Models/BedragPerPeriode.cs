using Newtonsoft.Json;
using System;
using static GoHAPI.Data.Enums;

namespace GoHAPI.Models
{
    public class BedragPerPeriode
    {
        public int Bedrag { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime? Einddatum { get; set; }
        public Interval Interval { get; set; }
    }
}
