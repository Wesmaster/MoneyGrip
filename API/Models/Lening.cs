using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.Models
{
    public class Lening
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Bedrag { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Begindatum { get; set; }
        public short Looptijd { get; set; }
        public decimal Rente { get; set; }
        public LeningType Type { get; set; }
        public byte[] Document { get; set; }
        public string DocumentNaam { get; set; }

        public virtual ICollection<LeningLabel> LeningLabels { get; set; }

        public int berekenMaandelijkseRente(int resterendBedrag)
        {
            return (int)(resterendBedrag * (Rente / 12) * 100);
        }

        public int berekenAflossingAnnuitair(int resterendBedrag, short resterendeLooptijd)
        {
            double rentePercentagePerMaand = (double)Rente / 12;
            double annuiteit = Math.Pow(1 + rentePercentagePerMaand, resterendeLooptijd);

            return (int)(resterendBedrag * (rentePercentagePerMaand * annuiteit) / (annuiteit - 1)) - berekenMaandelijkseRente(resterendBedrag);
        }

        public int berekenAflossingLineair()
        {
            return Bedrag / Looptijd * 100;
        }
    }
}
