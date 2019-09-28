using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.Begroting
{
    public class BedragPerMaand
    {
        public int Januari { get; set; }
        public int Februari { get; set; }
        public int Maart { get; set; }
        public int April { get; set; }
        public int Mei { get; set; }
        public int Juni { get; set; }
        public int Juli { get; set; }
        public int Augustus { get; set; }
        public int September { get; set; }
        public int Oktober { get; set; }
        public int November { get; set; }
        public int December { get; set; }

        public int getBedragInMaand(Maanden maand)
        {
            switch (maand)
            {
                case Maanden.Januari:
                    return Januari;
                case Maanden.Februari:
                    return Februari;
                case Maanden.Maart:
                    return Maart;
                case Maanden.April:
                    return April;
                case Maanden.Mei:
                    return Mei;
                case Maanden.Juni:
                    return Juni;
                case Maanden.Juli:
                    return Juli;
                case Maanden.Augustus:
                    return Augustus;
                case Maanden.September:
                    return September;
                case Maanden.Oktober:
                    return Oktober;
                case Maanden.November:
                    return November;
                case Maanden.December:
                    return December;
                default:
                    return 0;
            }
        }

        public int getTotaalBedrag()
        {
            return
                Januari +
                Februari +
                Maart +
                April +
                Mei +
                Juni +
                Juli +
                Augustus +
                September +
                Oktober +
                November +
                December; 
        }

        public void voegBedragenPerMaandToe(BedragPerMaand bedragenPerMaand)
        {
            Januari += bedragenPerMaand.Januari;
            Februari += bedragenPerMaand.Februari;
            Maart += bedragenPerMaand.Maart;
            April += bedragenPerMaand.April;
            Mei += bedragenPerMaand.Mei;
            Juni += bedragenPerMaand.Juni;
            Juli += bedragenPerMaand.Juli;
            Augustus += bedragenPerMaand.Augustus;
            September += bedragenPerMaand.September;
            Oktober += bedragenPerMaand.Oktober;
            November += bedragenPerMaand.November;
            December += bedragenPerMaand.December;
        }

        public void verminderBedragenPerMaandMet(BedragPerMaand bedragenPerMaand)
        {
            Januari -= bedragenPerMaand.Januari;
            Februari -= bedragenPerMaand.Februari;
            Maart -= bedragenPerMaand.Maart;
            April -= bedragenPerMaand.April;
            Mei -= bedragenPerMaand.Mei;
            Juni -= bedragenPerMaand.Juni;
            Juli -= bedragenPerMaand.Juli;
            Augustus -= bedragenPerMaand.Augustus;
            September -= bedragenPerMaand.September;
            Oktober -= bedragenPerMaand.Oktober;
            November -= bedragenPerMaand.November;
            December -= bedragenPerMaand.December;
        }

        public void voegBedragToeAanAlleMaanden(int bedrag)
        {
            for (Maanden i = Maanden.Januari; i <= Maanden.December; i++)
            {
                voegBedragToeInMaand(bedrag, i);
            }
        }

        public void voegBedragToeInMaanden(int bedrag, Maanden startMaand, Maanden eindMaand)
        {
            for (Maanden i = startMaand; i <= eindMaand; i++)
            {
                voegBedragToeInMaand(bedrag, i);
            }
        }

        public void voegBedragToeInMaand(int bedrag, Maanden maand)
        {
            switch (maand)
            {
                case Maanden.Januari:
                    Januari += bedrag;
                    break;
                case Maanden.Februari:
                    Februari += bedrag;
                    break;
                case Maanden.Maart:
                    Maart += bedrag;
                    break;
                case Maanden.April:
                    April += bedrag;
                    break;
                case Maanden.Mei:
                    Mei += bedrag;
                    break;
                case Maanden.Juni:
                    Juni += bedrag;
                    break;
                case Maanden.Juli:
                    Juli += bedrag;
                    break;
                case Maanden.Augustus:
                    Augustus += bedrag;
                    break;
                case Maanden.September:
                    September += bedrag;
                    break;
                case Maanden.Oktober:
                    Oktober += bedrag;
                    break;
                case Maanden.November:
                    November += bedrag;
                    break;
                case Maanden.December:
                    December += bedrag;
                    break;
                default:
                    break;
            }
        }
    }
}
