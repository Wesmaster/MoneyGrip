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

        public double berekenMaandelijkseRente()
        {
            int resterendBedrag = berekenResterendBedrag(bepaalResterendeLooptijd());
            return (double)(resterendBedrag * (Rente / 12));
        }

        public double berekenAflossingAnnuitair(int resterendBedrag, short resterendeLooptijd)
        {
            double rentePercentagePerMaand = (double)Rente / 12;
            double annuiteit = Math.Pow(1 + rentePercentagePerMaand, resterendeLooptijd);

            return (resterendBedrag * (rentePercentagePerMaand * annuiteit) / (annuiteit - 1)) - berekenMaandelijkseRente();
        }

        public double berekenAflossingLineair(short resterendeLooptijd)
        {
            double resterendBedrag = berekenResterendBedrag(resterendeLooptijd);
            return resterendBedrag / resterendeLooptijd;
        }

        public int berekenAnnuitairBedragPerMaand(int resterendBedrag, short resterendeLooptijd)
        {
            return (int)berekenAflossingAnnuitair(resterendBedrag, resterendeLooptijd) + (int)berekenMaandelijkseRente();
        }

        public int berekenLineairBedragPerMaand(int resterendBedrag, short resterendeLooptijd)
        {
            return (int)berekenAflossingLineair(resterendeLooptijd) + (int)berekenMaandelijkseRente();
        }

        private int berekenResterendBedrag(short resterendeLooptijd)
        {
            int aflossingPerMaand = Bedrag / Looptijd;
            int resterendBedrag = Bedrag - ((Looptijd - resterendeLooptijd) * aflossingPerMaand);
            return resterendBedrag;
        }

        private short bepaalResterendeLooptijd()
        {
            return (short)(((Begindatum.AddMonths(Looptijd).Year - DateTime.Now.Year) * 12) + Begindatum.Month - DateTime.Now.Month);
        }
    }
}
