using System;
using Newtonsoft.Json;
using MoneyGrip.Models;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.ViewModels
{
    public class TransactiesViewModel : BasisViewModel
    {
        public int Bedrag { get; set; }
        public int Dag { get; set; }
        public string Omschrijving { get; set; }
        public TransactieType Type { get; set; }
        public byte[] Document { get; set; }
        public string DocumentNaam { get; set; }
        public string VanRekening { get; set; }
        public string NaarRekening { get; set; }
    }
}