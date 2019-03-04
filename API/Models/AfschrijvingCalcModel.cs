using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;

namespace MoneyGrip.Models
{
    public class AfschrijvingCalcModel
    {
        public Afschrijving[] afschrijvingen { private get; set; }

        public int getTotaleWaarde(int maand, int jaar)
        {
            int bedrag = 0;
            foreach (Afschrijving afschrijving in afschrijvingen)
            {
                DateTime afloopDatum = afschrijving.Aankoopdatum.AddMonths(afschrijving.VerwachteLevensduur);
                if (
                   (afschrijving.Aankoopdatum.Year < jaar || (afschrijving.Aankoopdatum.Year == jaar && afschrijving.Aankoopdatum.Month <= maand))
                   && 
                   (jaar < afloopDatum.Year || (jaar == afloopDatum.Year && maand <= afloopDatum.Month))
                   )
                {
                    bedrag += afschrijving.Aankoopbedrag * 100 / afschrijving.VerwachteLevensduur;
                }
            }

            bedrag = bedrag / 100;
            return bedrag;
        }
    }
}
