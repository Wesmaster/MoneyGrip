namespace MoneyGrip.Models
{
    public class TransactieLabel : BasisLabel
    {
        public int TransactieId { get; set; }
        public Transactie Transactie { get; set; }
    }
}
