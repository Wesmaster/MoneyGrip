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

        public int jaar { get; set; }

        private readonly Begroting begroting = new Begroting();

        public Begroting genereerOverzicht()
        {
            BedragPerMaand inkomstenPerMaand;
            BedragPerMaand contractenPerMaand;
            BedragPerMaand budgettenPerMaand;
            BedragPerMaand reserveringenPerMaand;
            BedragPerMaand afschrijvingenPerMaand;
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
                Maanden eindMaand = bedrag.Einddatum.HasValue && bedrag.Einddatum.Value.Year == jaar ? (Maanden)bedrag.Einddatum.Value.Month : Maanden.December;
                bedragPerMaand.voegBedragToeInMaanden(bedrag.Bedrag, (Maanden)bedrag.Begindatum.Month, eindMaand);
            }

            IEnumerable<BedragPerPeriode> bedragenPerJaar = bedragenPerPeriode.Where(b => b.Interval == Interval.Jaar);
            foreach(BedragPerPeriode bedragPerJaar in bedragenPerJaar)
            {
                bedragPerMaand.voegBedragToeInMaand(bedragPerJaar.Bedrag, (Maanden)bedragPerJaar.Begindatum.Month);
            }

            IEnumerable<BedragPerPeriode> bedragenPerKwartaal = bedragenPerPeriode.Where(b => b.Interval == Interval.Kwartaal);
            foreach (BedragPerPeriode bedragPerKwartaal in bedragenPerKwartaal)
            {
                Maanden beginMaand = (Maanden)bedragPerKwartaal.Begindatum.Month;
                Maanden eindMaand = bedragPerKwartaal.Einddatum.HasValue ? (Maanden)bedragPerKwartaal.Einddatum.Value.Month : Maanden.December;
                int bedrag = bedragPerKwartaal.Bedrag;

                switch (beginMaand)
                {
                    case Maanden.Januari:
                        {
                            bedragPerMaand.voegBedragToeInMaand(bedrag, Maanden.Januari);
                            if(eindMaand > Maanden.April)
                            {
                                goto case Maanden.April;
                            }
                            break;
                        }
                    case Maanden.April:
                        {
                            bedragPerMaand.voegBedragToeInMaand(bedrag, Maanden.April);
                            if (eindMaand > Maanden.Juli)
                            {
                                goto case Maanden.Juli;
                            }
                            break;
                        }
                    case Maanden.Juli:
                        {
                            bedragPerMaand.voegBedragToeInMaand(bedrag, Maanden.Juli);
                            if (eindMaand > Maanden.Oktober)
                            {
                                goto case Maanden.Oktober;
                            }
                            break;
                        }
                    case Maanden.Oktober:
                        bedragPerMaand.voegBedragToeInMaand(bedrag, Maanden.Oktober);
                        break;
                    case Maanden.Februari:
                    case Maanden.Mei:
                    case Maanden.Augustus:
                    case Maanden.November:
                        {
                            bedragPerMaand.voegBedragToeInMaand(bedrag / 3 * Math.Max(1, Math.Min((int)(eindMaand - beginMaand), 2)), beginMaand);
                            goto default;
                        }
                    case Maanden.Maart:
                    case Maanden.Juni:
                    case Maanden.September:
                    case Maanden.December:
                        {
                            bedragPerMaand.voegBedragToeInMaand(bedrag / 3, beginMaand);
                            goto default;
                        }
                    default:
                        {
                            if (beginMaand < Maanden.April && eindMaand > Maanden.April)
                            {
                                goto case Maanden.April;
                            }
                            else if (beginMaand < Maanden.Juli && eindMaand > Maanden.Juli)
                            {
                                goto case Maanden.Juli;
                            }
                            else if (beginMaand < Maanden.Oktober && eindMaand > Maanden.Oktober)
                            {
                                goto case Maanden.Oktober;
                            }
                        }
                        break;
                }
            }
            return bedragPerMaand;
        }

        private BedragPerMaand bepaalReservingBedragPerMaand(IEnumerable<Reservering> reserveringen)
        {
            BedragPerMaand reserveringenPerMaand = new BedragPerMaand();

            reserveringenPerMaand.voegBedragToeAanAlleMaanden(reserveringen.Where(r => r.Maand == Maanden.Alle).Sum(r => r.Bedrag));
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.Januari).Sum(r => r.Bedrag), Maanden.Januari);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.Februari).Sum(r => r.Bedrag), Maanden.Februari);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.Maart).Sum(r => r.Bedrag), Maanden.Maart);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.April).Sum(r => r.Bedrag), Maanden.April);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.Mei).Sum(r => r.Bedrag), Maanden.Mei);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.Juni).Sum(r => r.Bedrag), Maanden.Juni);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.Juli).Sum(r => r.Bedrag), Maanden.Juli);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.Augustus).Sum(r => r.Bedrag), Maanden.Augustus);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.September).Sum(r => r.Bedrag), Maanden.September);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.Oktober).Sum(r => r.Bedrag), Maanden.Oktober);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.November).Sum(r => r.Bedrag), Maanden.November);
            reserveringenPerMaand.voegBedragToeInMaand(reserveringen.Where(r => r.Maand == Maanden.December).Sum(r => r.Bedrag), Maanden.December);

            return reserveringenPerMaand;
        }

        private BedragPerMaand bepaalAfschrijvingBedragPerMaand(IEnumerable<Afschrijving> afschrijvingen)
        {
            BedragPerMaand bedragPerMaand = new BedragPerMaand();

            foreach (Afschrijving afschrijving in afschrijvingen)
            {
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.Januari, jaar), Maanden.Januari);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.Februari, jaar), Maanden.Februari);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.Maart, jaar), Maanden.Maart);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.April, jaar), Maanden.April);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.Mei, jaar), Maanden.Mei);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.Juni, jaar), Maanden.Juni);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.Juli, jaar), Maanden.Juli);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.Augustus, jaar), Maanden.Augustus);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.September, jaar), Maanden.September);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.Oktober, jaar), Maanden.Oktober);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.November, jaar), Maanden.November);
                bedragPerMaand.voegBedragToeInMaand(afschrijving.bepaalAfschrijfBedrag(Maanden.December, jaar), Maanden.December);
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
                    for (Maanden i = spaardoel.LaatsteMaand; i >= spaardoel.EersteMaand; i--)
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
                    for (Maanden i = spaardoel.EersteMaand; i <= spaardoel.LaatsteMaand; i++)
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
