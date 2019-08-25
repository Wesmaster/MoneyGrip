namespace MoneyGrip.Models
{
    public class ReserveringLabel : BasisLabel
    {
        public int ReserveringId { get; set; }
        public Reservering Reservering { get; set; }
    }
}
