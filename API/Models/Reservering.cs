using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mijnHuishoudenAPI.Models
{
    public class Reservering
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Label { get; set; }
        public int Bedrag { get; set; }
        public byte Maand { get; set; }
        public string Omschrijving { get; set; }

        public Label LabelNavigation { get; set; }
    }
}
