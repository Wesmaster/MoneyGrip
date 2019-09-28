using System;

namespace MoneyGrip.Models
{
    public class ContractLabel : BasisLabel
    {
        public int ContractId { get; set; }
        public Contract Contract { get; set; }
    }
}
