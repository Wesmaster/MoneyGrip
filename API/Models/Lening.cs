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

        public double berekenMaandelijkseRente(int resterendBedrag)
        {
            return (double)(resterendBedrag * (Rente / 12));
        }

        public double berekenAflossingAnnuitair(int resterendBedrag, short resterendeLooptijd)
        {
            double rentePercentagePerMaand = (double)Rente / 12;
            double annuiteit = Math.Pow(1 + rentePercentagePerMaand, resterendeLooptijd);

            return (resterendBedrag * (rentePercentagePerMaand * annuiteit) / (annuiteit - 1)) - berekenMaandelijkseRente(resterendBedrag);
        }

        public double berekenAflossingLineair(int resterendBedrag, short resterendeLooptijd)
        {
            return (double)resterendBedrag / resterendeLooptijd;
        }

        public int berekenAnnuitairBedragPerMaand(int resterendBedrag, short resterendeLooptijd)
        {
            return (int)berekenAflossingAnnuitair(resterendBedrag, resterendeLooptijd) + (int)berekenMaandelijkseRente(resterendBedrag);
        }

        public int berekenLineairBedragPerMaand(int resterendBedrag, short resterendeLooptijd)
        {
            return (int)berekenAflossingLineair(resterendBedrag, resterendeLooptijd) + (int)berekenMaandelijkseRente(resterendBedrag);
        }
    }
}
