using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestProjectKasraCO.Models
{
    public class TrafficViewModel
    {
        public int Id { get; set; }
        public String RegDate { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public String OutDate { get; set; }
        public String InDate { get; set; }
    }
    public class IndexPageViewModel
    {
        public List<User> UsersList { get; set; }
        public List<TrafficViewModel> TrafficList { get; set; }
    }
}