using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TestProjectKasraCO.Startup))]
namespace TestProjectKasraCO
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
