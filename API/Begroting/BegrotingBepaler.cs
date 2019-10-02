using static MoneyGrip.Data.Enums;
using System;
using MoneyGrip.Models;
using System.Collections.Generic;
using System.Linq;

namespace MoneyGrip.Begroting
{
    public class BegrotingBepaler
    {
        public IEnumerable<Inkomst> inkomsten { get; set; }
        public IEnumerable<Contract> contracten { get; set; }
        public IEnumerable<Budget> budgetten { get; set; }
        public IEnumerable<Reservering> reserveringen { get; set; }
        public IEnumerable<Afschrijving> afschrijvingen { get; set; }
        public IEnumerable<Spaardoel> spaardoelen { get; set; }
        public IEnumerable<Lening> leningen { get; set; }

        public int jaar { get; set; }

        private readonly Begroting begroting = new Begroting();

        public Begroting genereerOverzicht()
        {
            BedragPerMaand inkomstenPerMaand;
            BedragPerMaand contractenPerMaand;
            BedragPerMaand budgettenPerMaand;
            BedragPerMaand reserveringenPerMaand;
            BedragPerMaand afschrijvingenPerMaand;
            BedragPerMaand leningenPerMaand;
            BedragPerMaand uitgavenPerMaand = new BedragPerMaand();
            BedragPerMaand resultaatPerMaand = new BedragPerMaand();
            Dictionary<string, BedragPerMaand> spaardoelenPerMaand;

            if (inkomsten != null)
            {
                inkomstenPerMaand = bepaalBedragenPerMaand(inkomsten);
                resultaatPerMaand.voegBedragenPerMaandToe(inkomstenPerMaand);
                begroting.Inkomst = inkomstenPerMaand;
            }
            if (contracten != null)
            {
                contractenPerMaand = bepaalBedragenPerMaand(contracten);
                uitgavenPerMaand.voegBedragenPerMaandToe(contractenPerMaand);
                begroting.Contract = contractenPerMaand;
            }
            if (budgetten != null)
            {
                budgettenPerMaand = bepaalBedragenPerMaand(budgetten);
                uitgavenPerMaand.voegBedragenPerMaandToe(budgettenPerMaand);
                begroting.Budget = budgettenPerMaand;
            }
            if (reserveringen != null)
            {
                reserveringenPerMaand = bepaalReservingBedragPerMaand(reserveringen);
                uitgavenPerMaand.voegBedragenPerMaandToe(reserveringenPerMaand);
                begroting.Reservering = reserveringenPerMaand;
            }
            if (afschrijvingen != null)
            {
                afschrijvingenPerMaand = bepaalAfschrijvingBedragPerMaand(afschrijvingen);
                uitgavenPerMaand.voegBedragenPerMaandToe(afschrijvingenPerMaand);
                begroting.Afschrijving = afschrijvingenPerMaand;
            }
            if (leningen != null)
            {
                leningenPerMaand = bepaalLeningBedragPerMaand(leningen);
                uitgavenPerMaand.voegBedragenPerMaandToe(leningenPerMaand);
                begroting.Lening = leningenPerMaand;
            }
            begroting.Uitgaven = uitgavenPerMaand;

            resultaatPerMaand.verminderBedragenPerMaandMet(uitgavenPerMaand);
            begroting.Resultaat = resultaatPerMaand;

            if(spaardoelen != null)
            {
                spaardoelenPerMaand = bepaalSpaardoelenPerMaand(spaardoelen, resultaatPerMaand);
                begroting.Spaardoel = spaardoelenPerMaand;
            }

            return begroting;
        }

        private BedragPerMaand bepaalBedragenPerMaand(IEnumerable<BedragPerPeriode> bedragenPerPeriode)
        {
            BedragPerMaand bedragPerMaand = new BedragPerMaand();

            IEnumerable<BedragPerPeriode> bedragenPerMaand = bedragenPerPeriode.Where(b => b.Interval == Interval.Maand);
            foreach(BedragPerPeriode bedrag in bedragenPerMaand)
            {
                Maand beginMaand = bedrag.Begindatum.Year == jaar ? (Maand)bedrag.Begindatum.Month : Maand.Januari;
                Maand eindMaand = bedrag.Einddatum.HasValue && bedrag.Einddatum.Value.Year == jaar ? (Maand)bedrag.Einddatum.Value.Month : Maand.December;
                bedragPerMaand.voegBedragToeInMaanden(bedrag.Bedrag, beginMaand, eindMaand);
            }

            IEnumerable<BedragPerPeriode> bedragenPerJaar = bedragenPerPeriode.Where(b => b.Interval == Interval.Jaar);
            foreach(BedragPerPeriode bedragPerJaar in bedragenPerJaar)
            {
                bedragPerMaand.voegBedragToeInMaand(bedragPerJaar.Bedrag, (Maand)bedragPerJaar.Begindatum.Month);
            }

            IEnumerable<BedragPerPeriode> bedragenPerKwartaal = bedragenPerPeriode.Where(b => b.Interval == Interval.Kwartaal);
            foreach (BedragPerPeriode bedragPerKwartaal in bedragenPerKwartaal)
            {
                Maand beginMaand = (Maand)bedragPerKwartaal.Begindatum.Month;
                Maand eindMaand = bedragPerKwartaal.Einddatum.HasValue ? (Maand)bedragPerKwartaal.Einddatum.Value.Month : Maand.December;
                int bedrag = bedragPerKwartaal.Bedrag;

                switch(beginMaand)
                { 
                    case Maand.Februari:
                    case Maand.Mei:
                    case Maand.Augustus:
                    case Maand.November:
                        {
                            bedragPerMaand.voegBedragToeInMaand(bedrag / 3 * Math.Max(1, Math.Min((int)(eindMaand - beginMaand), 2)), beginMaand);
                            break;
                        }
                    case Maand.Maart:
                    case Maand.Juni:
                    case Maand.September:
                    case Maand.December:
                        {
                            bedragPerMaand.voegBedragToeInMaand(bedrag / 3, beginMaand);
                            break;
                        }
                    default: break;
                }

                while (beginMaand <= Maand.Oktober && beginMaand < eindMaand)
                {
                    switch (beginMaand)
                    {
                        case Maand.Januari:
                        case Maand.April:
                        case Maand.Juli:
                        case Maand.Oktober:
                            {
                                int bedragDezeMaand = bedrag;
                                if(eindMaand - beginMaand == 1)
                                {
                                    bedragDezeMaand = bedragDezeMaand / 3;
                                }
                                else if(eindMaand - beginMaand == 2)
                                {
                                    bedragDezeMaand = bedrag / 3 * Math.Max(1, Math.Min((int)(eindMaand - beginMaand), 2));
                                }
                                bedragPerMaand.voegBedragToeInMaand(bedragDezeMaand, beginMaand);
                                break;
                            }
                        default: break;
                    }
                    beginMaand++;
                }
            }
            return bedragPerMaand;
        }

        private BedragPerMaand bepaalReservingBedragPerMaand(IEnumerable<Reservering> reserveringen)
        {
            BedragPerMaand reserveringenPerMaand = new BedragPerMaand();

            reserveringenPerMaand.voegBedragToeAanAlleMaanden(reserveringen.Where(r => r.Maand == Maand.Alle).Sum(r => r.Bedrag));
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.Januari).Sum(r => r.Bedrag), Maand.Januari);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.Februari).Sum(r => r.Bedrag), Maand.Februari);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.Maart).Sum(r => r.Bedrag), Maand.Maart);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.April).Sum(r => r.Bedrag), Maand.April);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.Mei).Sum(r => r.Bedrag), Maand.Mei);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.Juni).Sum(r => r.Bedrag), Maand.Juni);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.Juli).Sum(r => r.Bedrag), Maand.Juli);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.Augustus).Sum(r => r.Bedrag), Maand.Augustus);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.September).Sum(r => r.Bedrag), Maand.September);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.Oktober).Sum(r => r.Bedrag), Maand.Oktober);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.November).Sum(r => r.Bedrag), Maand.November);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maand.December).Sum(r => r.Bedrag), Maand.December);

            return reserveringenPerMaand;
        }

        private BedragPerMaand bepaalAfschrijvingBedragPerMaand(IEnumerable<Afschrijving> afschrijvingen)
        {
            BedragPerMaand bedragPerMaand = new BedragPerMaand();

            foreach (Afschrijving afschrijving in afschrijvingen)
            {
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.Januari, jaar), Maand.Januari);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.Februari, jaar), Maand.Februari);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.Maart, jaar), Maand.Maart);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.April, jaar), Maand.April);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.Mei, jaar), Maand.Mei);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.Juni, jaar), Maand.Juni);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.Juli, jaar), Maand.Juli);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.Augustus, jaar), Maand.Augustus);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.September, jaar), Maand.September);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.Oktober, jaar), Maand.Oktober);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.November, jaar), Maand.November);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maand.December, jaar), Maand.December);
            }

            return bedragPerMaand;
        }

        private BedragPerMaand bepaalLeningBedragPerMaand(IEnumerable<Lening> leningen)
        {
            BedragPerMaand bedragPerMaand = new BedragPerMaand();

            foreach (Lening lening in leningen)
            {
                Maand beginMaand = (Maand)lening.Begindatum.Month;
                int jaar = lening.Begindatum.Year;

                int bedrag = lening.berekenAnnuitairBedragPerMaand(lening.Bedrag, lening.Looptijd);
                if (jaar < this.jaar)
                {
                    bedragPerMaand.voegBedragToeAanAlleMaanden(bedrag);
                }
                else
                {
                    for(Maand i = beginMaand; i < Maand.December; i++)
                    {
                        bedragPerMaand.voegBedragToeInMaand(bedrag, i);
                    }
                }
            }

            return bedragPerMaand;
        }

        private Dictionary<string, BedragPerMaand> bepaalSpaardoelenPerMaand(IEnumerable<Spaardoel> spaardoelen, BedragPerMaand resultatenPerMaand)
        {
            Dictionary<string, BedragPerMaand> spaardoelBedragPerLabelPerMaand = new Dictionary<string, BedragPerMaand>();
            BedragPerMaand spaardoelenTotaalBedragPerMaand = new BedragPerMaand();
            
            foreach (Spaardoel spaardoel in spaardoelen)
            {
                string label = spaardoel.getLabelnaam();
                int doelBedrag = spaardoel.Eindbedrag ?? 99999999;
                BedragPerMaand spaardoelBedragPerMaand = new BedragPerMaand();

                if (spaardoel.Percentage == null)
                {
                    for (Maand i = spaardoel.LaatsteMaand; i >= spaardoel.EersteMaand; i--)
                    {
                        int resterendDoelBedrag = doelBedrag - spaardoelBedragPerMaand.getTotaalBedrag();
                        if (resterendDoelBedrag == 0)
                            break;

                        int beschikbaarBedragInMaand = resultatenPerMaand.getBedragInMaand(i) - spaardoelenTotaalBedragPerMaand.getBedragInMaand(i);
                        spaardoelBedragPerMaand.voegBedragToeInMaand(Math.Min(beschikbaarBedragInMaand, resterendDoelBedrag), i);
                        spaardoelenTotaalBedragPerMaand.voegBedragToeInMaand(spaardoelBedragPerMaand.getBedragInMaand(i), i);
                    }
                }
                else
                {
                    for (Maand i = spaardoel.EersteMaand; i <= spaardoel.LaatsteMaand; i++)
                    {
                        int resterendDoelBedrag = doelBedrag - spaardoelBedragPerMaand.getTotaalBedrag();
                        if (resterendDoelBedrag == 0)
                            break;

                        int beschikbaarBedragInMaand = resultatenPerMaand.getBedragInMaand(i) - spaardoelenTotaalBedragPerMaand.getBedragInMaand(i);
                        int bedrag = (int)(beschikbaarBedragInMaand * ((decimal)spaardoel.Percentage / 100));
                        spaardoelBedragPerMaand.voegBedragToeInMaand(Math.Min(bedrag, resterendDoelBedrag), i);
                    }
                }

                spaardoelBedragPerLabelPerMaand[label] = spaardoelBedragPerMaand;
            }

            return spaardoelBedragPerLabelPerMaand;
        }
    }
}
