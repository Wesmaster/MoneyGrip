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
                if (afschrijving.Aankoopdatum.Year < jaar || (afschrijving.Aankoopdatum.Year == jaar && afschrijving.Aankoopdatum.Month <= maand))
                {
                    if (jaar < afloopDatum.Year || (jaar == afloopDatum.Year && maand <= afloopDatum.Month))
                    {
                        bedrag += afschrijving.Aankoopbedrag / afschrijving.VerwachteLevensduur;
                    }
                }
            }
            return bedrag;
        }
    }
}
