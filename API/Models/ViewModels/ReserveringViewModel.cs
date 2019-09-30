using System.Collections.Generic;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.ViewModels
{
    public class ReserveringViewModel : BasisViewModel
    {
        public int Bedrag { get; set; }
        public Maand Maand { get; set; }
        public string Omschrijving { get; set; }
    }
}
