using System;
using Newtonsoft.Json;
using MoneyGrip.Models;
using System.Collections.Generic;
using MoneyGrip.Models.ViewModels;

namespace MoneyGrip.ViewModels
{
    public class BasisViewModel
    {
        public int Id { get; set; }
        public List<LabelViewModel> Label { get; set; }
    }
}
