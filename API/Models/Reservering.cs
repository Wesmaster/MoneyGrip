using System;
using System.Collections.Generic;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.Models
{
    public class Reservering
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public int Bedrag { get; set; }
        public Maanden Maand { get; set; }
        public string Omschrijving { get; set; }

        public virtual ICollection<ReserveringLabel> ReserveringLabels { get; set; }
    }
}
