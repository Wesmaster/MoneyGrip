using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.Models
{
    public class Afschrijving
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        [JsonConverter(typeof(OnlyDateConverter))]
        public DateTime Aankoopdatum { get; set; }
        public int Aankoopbedrag { get; set; }
        public short VerwachteLevensduur { get; set; }
        public short? Garantie { get; set; }
        public byte[] Factuur { get; set; }
        public string FactuurNaam { get; set; }

        public virtual ICollection<AfschrijvingLabel> AfschrijvingLabels { get; set; }

        public int bepaalAfschrijfBedrag(Maand maand, int jaar)
        {
            int afschrijfBedrag = 0;
            DateTime gesteldeEinddatum = Aankoopdatum.AddMonths(VerwachteLevensduur - 1);
            if (moetAfgeschrevenWorden(Aankoopdatum, gesteldeEinddatum, maand, jaar))
            {
                afschrijfBedrag = Aankoopbedrag / VerwachteLevensduur;
                // Laatste maand, aanvullen tot aankoopbedrag
                if (jaar == gesteldeEinddatum.Year && maand == (Maand)gesteldeEinddatum.Month)
                {
                    afschrijfBedrag += Aankoopbedrag - (Aankoopbedrag / VerwachteLevensduur * VerwachteLevensduur);
                }
            }

            return afschrijfBedrag;
        }

        private bool moetAfgeschrevenWorden(DateTime aankoopDatum, DateTime gesteldeEinddatum, Maand maand, int jaar)
        {
            int jaarVanAankoop = aankoopDatum.Year;
            Maand maandVanAankoop = (Maand)aankoopDatum.Month;

            int jaarVanVoltooien = gesteldeEinddatum.Year;
            Maand maandVanVoltooien = (Maand)gesteldeEinddatum.Month;

            if (jaarVanAankoop < jaar || (jaarVanAankoop == jaar && maandVanAankoop <= maand))
            {
                if (jaar < jaarVanVoltooien || (jaar == jaarVanVoltooien && maand <= maandVanVoltooien))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
