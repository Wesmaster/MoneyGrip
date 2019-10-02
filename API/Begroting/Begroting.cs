using System.Collections.Generic;

namespace MoneyGrip.Begroting
{
    public class Begroting
    {
        public BedragPerMaand Inkomst { get; set; }
        public BedragPerMaand Budget { get; set; }
        public BedragPerMaand Contract { get; set; }
        public BedragPerMaand Afschrijving { get; set; }
        public BedragPerMaand Reservering { get; set; }
        public BedragPerMaand Lening { get; set; }
        public BedragPerMaand Uitgaven { get; set; }
        public BedragPerMaand Resultaat { get; set; }
        public Dictionary<string, BedragPerMaand> Spaardoel { get; set; }
    }
}
