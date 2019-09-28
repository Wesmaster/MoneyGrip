using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MoneyGrip.Models;
using MoneyGrip.Models.ViewModels;

namespace MoneyGrip.Controllers
{
    public class BasisController : ControllerBase 
    {
        protected List<LabelViewModel> toLabelViewModelList<T>(ICollection<T> model) where T : BasisLabel
        {
            List<LabelViewModel> returnList = new List<LabelViewModel>();
            foreach (T ikl in model)
            {
                LabelViewModel lvm = new LabelViewModel
                {
                    Id = ikl.LabelId,
                    Naam = ikl.Label.Naam
                };
                returnList.Add(lvm);

            }
            return returnList;
        }
    }
}