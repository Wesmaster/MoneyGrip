namespace MoneyGrip.ViewModels
{
    public class RekeningenViewModel
    {
        public int Id { get; set; }
        public string Naam { get; set; }
        public string Iban { get; set; }
        public int Saldo { get; set; }
        public bool? Hoofdrekening { get; set; }
    }
}