using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using TestProjectKasraCO.App_Data;
using TestProjectKasraCO.Models;

namespace TestProjectKasraCO.Controllers
{
    [RoutePrefix("API")]
    public class APIController : ApiController
    {
        [Route("UserList")]
        [HttpPost]
        public List<User> UsersList()
        {
            try
            {
                DatabaseAccess databaseAccess = new DatabaseAccess();
                return (databaseAccess.UsersList());

            }
            catch (Exception e) { return (null); }
        }

        [Route("TrafficList")]
        [HttpPost]
        public List<TrafficViewModel> TrafficList()
        {
            try
            {
                DatabaseAccess databaseAccess = new DatabaseAccess();
                return (databaseAccess.TrafficList());

            }
            catch (Exception e) { return (null); }
        }

        [Route("TrafficInsertEdit")]
        [HttpPost]
        public Int32 TrafficInsertEdit()
        {
            try
            {
                DatabaseAccess databaseAccess = new DatabaseAccess();
                Traffic traffic = new Traffic();
                if(!string.IsNullOrEmpty(HttpContext.Current.Request.Form["Id"])) traffic.Id = Convert.ToInt32(HttpContext.Current.Request.Form["Id"]);
                bool isEdit = Convert.ToBoolean(HttpContext.Current.Request.Form["IsEdit"]);
                traffic.UserId = Convert.ToInt32(HttpContext.Current.Request.Form["UserId"]);
                traffic.UserName = HttpContext.Current.Request.Form["UserName"];
                if(!string.IsNullOrEmpty(HttpContext.Current.Request.Form["OutDate"])) traffic.OutDate = Convert.ToDateTime(PersianDate.ConvertDate.ToEn(HttpContext.Current.Request.Form["OutDate"]));
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.Form["InDate"])) traffic.InDate = Convert.ToDateTime(PersianDate.ConvertDate.ToEn(HttpContext.Current.Request.Form["InDate"]));

                return (databaseAccess.TrafficInsertEdit(traffic, isEdit));

            }
            catch (Exception e) { return (-1); }
        }

        [Route("TrafficDelete")]
        [HttpPost]
        public Int32 TrafficDelete()
        {
            try
            {
                DatabaseAccess databaseAccess = new DatabaseAccess();
                return (databaseAccess.TrafficDelete(Convert.ToInt32(HttpContext.Current.Request.Form["Id"])));

            }
            catch (Exception e) { return (-1); }
        }

        [Route("TrafficSearch")]
        [HttpPost]
        public List<TrafficViewModel> TrafficSearch()
        {
            try
            {
                DatabaseAccess databaseAccess = new DatabaseAccess();
                Traffic traffic = new Traffic();
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.Form["UserId"])) traffic.UserId = Convert.ToInt32(HttpContext.Current.Request.Form["UserId"]);
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.Form["OutDate"])) traffic.OutDate = Convert.ToDateTime(PersianDate.ConvertDate.ToEn(HttpContext.Current.Request.Form["OutDate"]));
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.Form["InDate"])) traffic.InDate = Convert.ToDateTime(PersianDate.ConvertDate.ToEn(HttpContext.Current.Request.Form["InDate"]));

                return (databaseAccess.TrafficSearch(traffic));

            }
            catch (Exception e) { return (null); }
        }

    }
}
