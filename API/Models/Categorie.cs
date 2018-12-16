using System;
using System.Collections.Generic;

namespace GoHAPI.Models
{
    public partial class Categorie
    {
        public Categorie()
        {
            Label = new HashSet<Label>();
        }

        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public string Naam { get; set; }
        public string Kleur { get; set; }
        public byte Type { get; set; }

        public ICollection<Label> Label { get; set; }
    }
}
