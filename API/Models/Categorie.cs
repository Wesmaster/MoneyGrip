using System;
using System.Collections.Generic;

namespace MoneyGrip.Models
{
    public partial class Categorie
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public string Naam { get; set; }
        public string Kleur { get; set; }
        public byte Type { get; set; }
    }
}
