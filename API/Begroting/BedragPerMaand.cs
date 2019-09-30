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

        public int getBedragInMaand(Maand maand)
        {
            switch (maand)
            {
                case Maand.Januari:
                    return Januari;
                case Maand.Februari:
                    return Februari;
                case Maand.Maart:
                    return Maart;
                case Maand.April:
                    return April;
                case Maand.Mei:
                    return Mei;
                case Maand.Juni:
                    return Juni;
                case Maand.Juli:
                    return Juli;
                case Maand.Augustus:
                    return Augustus;
                case Maand.September:
                    return September;
                case Maand.Oktober:
                    return Oktober;
                case Maand.November:
                    return November;
                case Maand.December:
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
            for (Maand i = Maand.Januari; i <= Maand.December; i++)
            {
                voegBedragToeInMaand(bedrag, i);
            }
        }

        public void voegBedragToeInMaanden(int bedrag, Maand startMaand, Maand eindMaand)
        {
            for (Maand i = startMaand; i <= eindMaand; i++)
            {
                voegBedragToeInMaand(bedrag, i);
            }
        }

        public void voegBedragToeInMaand(int bedrag, Maand maand)
        {
            switch (maand)
            {
                case Maand.Januari:
                    Januari += bedrag;
                    break;
                case Maand.Februari:
                    Februari += bedrag;
                    break;
                case Maand.Maart:
                    Maart += bedrag;
                    break;
                case Maand.April:
                    April += bedrag;
                    break;
                case Maand.Mei:
                    Mei += bedrag;
                    break;
                case Maand.Juni:
                    Juni += bedrag;
                    break;
                case Maand.Juli:
                    Juli += bedrag;
                    break;
                case Maand.Augustus:
                    Augustus += bedrag;
                    break;
                case Maand.September:
                    September += bedrag;
                    break;
                case Maand.Oktober:
                    Oktober += bedrag;
                    break;
                case Maand.November:
                    November += bedrag;
                    break;
                case Maand.December:
                    December += bedrag;
                    break;
                default:
                    break;
            }
        }
    }
}
