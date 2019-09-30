using static MoneyGrip.Data.Enums;

namespace MoneyGrip.ViewModels
{
    public class SpaardoelViewModel : BasisViewModel
    {
        public byte? Percentage { get; set; }
        public int? Eindbedrag { get; set; }
        public Maand EersteMaand { get; set; }
        public Maand LaatsteMaand { get; set; }
        public string Omschrijving { get; set; }
    }
}
