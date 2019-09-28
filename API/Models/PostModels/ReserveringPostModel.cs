using System.Collections.Generic;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.ViewModels
{
    public class ReserveringPostModel
    {
        public int Id { get; set; }
        public List<int> Label { get; set; }
        public int Bedrag { get; set; }
        public Maanden Maand { get; set; }
        public string Omschrijving { get; set; }
    }
}
