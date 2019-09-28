namespace MoneyGrip.Models
{
    public class SpaardoelLabel : BasisLabel
    {
        public int SpaardoelId { get; set; }
        public Spaardoel Spaardoel { get; set; }
    }
}
