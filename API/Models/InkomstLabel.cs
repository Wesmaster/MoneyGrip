namespace MoneyGrip.Models
{
    public class InkomstLabel : BasisLabel
    {
        public int InkomstId { get; set; }
        public Inkomst Inkomst { get; set; }
    }
}
