using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace MoneyGrip
{
    public class Program
    {
        protected Program()
        {

        }

        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
             //   .UseUrls("https://*:5000")
                .UseStartup<Startup>();
                
    }
}
