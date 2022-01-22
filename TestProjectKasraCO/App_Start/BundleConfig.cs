using System.Web;
using System.Web.Optimization;

namespace TestProjectKasraCO
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new Bundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.bundle.js"));

            bundles.Add(new StyleBundle("~/Content/KasraStyles").Include(
                       "~/Content/bootstrap.css",
                       "~/Content/Plugins/PersianDatePicker/persian-datepicker.min.css",
                       "~/Content/font-awesome.min.css",
                      "~/Content/KasraStyle/KasraStyles.css"));

            bundles.Add(new Bundle("~/bundles/KasraScripts").Include(
                "~/Scripts/jquery-ui-1.12.1.min.js",
                "~/Scripts/Plugins/PersianDatePicker/persian-date.min.js",
                "~/Scripts/Plugins/PersianDatePicker/persian-datepicker.min.js",
                       "~/Scripts/inputmask/jquery.inputmask.js",
                       "~/Scripts/inputmask/inputmask.js",
                      "~/Scripts/KasraScript/KasraScripts.js"));
        }
    }
}
