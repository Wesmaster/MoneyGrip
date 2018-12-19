using System;
using System.Collections.Generic;

namespace GoHAPI.Models
{
    public partial class Label
    {
        public Label()
        {
            Inkomst = new HashSet<Inkomst>();
        }

        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public string Naam { get; set; }
        public int Categorie { get; set; }

        public Categorie CategorieNavigation { get; set; }

        public ICollection<Inkomst> Inkomst { get; set; }
        public ICollection<Contract> Contract { get; set; }
        public ICollection<Budget> Budget { get; set; }
        public ICollection<Reservering> Reservering { get; set; }
        public ICollection<Afschrijving> Afschrijving { get; set; }
        public ICollection<Spaardoel> Spaardoel { get; set; }
    }
}
