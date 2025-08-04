using System.Diagnostics;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;

namespace DoAnCuoiKy.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDBContext _appDBContext;

        public HomeController(ILogger<HomeController> logger, AppDBContext appDBContext)
        {
            _logger = logger;
            _appDBContext = appDBContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Cart()
        {
            return View("/Views/Home/cart.cshtml");
        }

        public IActionResult Checkout()
        {
            return View("/Views/Home/checkout.cshtml");
        }

        public IActionResult Contact()
        {
            return View("/Views/Home/contact.cshtml");
        }

        public IActionResult ThankYou(int? orderId)
        {
            if (orderId != null)
            {
                ViewData["orderId"] = orderId;
                return View("/Views/Home/thankYou.cshtml");
            } else
            {
                return RedirectToAction("Index");
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
