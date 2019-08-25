using System;
using System.Collections.Generic;
using static MoneyGrip.Data.Enums;

namespace MoneyGrip.Models
{
    public class Spaardoel
    {
        public int Id { get; set; }
        public DateTime LaatstGewijzigd { get; set; }
        public byte? Percentage { get; set; }
        public int? Eindbedrag { get; set; }
        public Maanden EersteMaand { get; set; }
        public Maanden LaatsteMaand { get; set; }
        public string Omschrijving { get; set; }

        public virtual ICollection<SpaardoelLabel> SpaardoelLabels { get; set; }

        public string getLabelnaam()
        {
            List<string> labels = new List<string>();
            foreach (SpaardoelLabel spaardoelLabel in SpaardoelLabels)
            {
                labels.Add(spaardoelLabel.Label.Naam);
            }
            return string.Join(", ", labels);
        }
    }
}
