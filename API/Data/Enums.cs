using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoneyGrip.Data
{
    public class Enums
    {
        public enum Interval : byte
        {
            Maand = 1,
            Kwartaal,
            Jaar
        }

        public enum Maanden : byte
        {
            Alle = 0,
            Januari,
            Februari,
            Maart,
            April,
            Mei,
            Juni,
            Juli,
            Augustus,
            September,
            Oktober,
            November,
            December
        }
    }
}
