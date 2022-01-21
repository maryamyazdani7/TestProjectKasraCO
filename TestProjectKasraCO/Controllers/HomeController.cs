using System.Collections.Generic;
using System.Web.Mvc;
using TestProjectKasraCO.App_Data;
using TestProjectKasraCO.Models;

namespace TestProjectKasraCO.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            DatabaseAccess databaseAccess = new DatabaseAccess();
            List<User> usersList = databaseAccess.UsersList();
            List<TrafficViewModel> trafficList = databaseAccess.TrafficList();
            IndexPageViewModel indexPageView = new IndexPageViewModel();
            indexPageView.UsersList = usersList;
            indexPageView.TrafficList = trafficList;

            return View(indexPageView);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}