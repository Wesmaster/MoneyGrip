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

        public enum Maand : byte
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

        public enum LeningType : byte
        {
            Annuitair = 0,
            Lineair
        }

        public enum TransactieType : byte
        {
            Inkomst = 0,
            Uitgave,
            Boeking
        }
    }
}
