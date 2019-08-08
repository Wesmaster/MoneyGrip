using System;
using System.Collections.Generic;

namespace MoneyGrip.Models
{
    public partial class Label
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public string Naam { get; set; }
        public int Categorie { get; set; }

        public Categorie CategorieNavigation { get; set; }

        public virtual ICollection<InkomstLabel> InkomstLabels { get; set; }

        public ICollection<Contract> Contract { get; set; }
        public ICollection<Budget> Budget { get; set; }
        public ICollection<Reservering> Reservering { get; set; }
        public ICollection<Afschrijving> Afschrijving { get; set; }
        public ICollection<Spaardoel> Spaardoel { get; set; }
    }
}
