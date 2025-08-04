using Microsoft.AspNetCore.Mvc;

namespace DoAnCuoiKy.Controllers
{
    public class NotFoundController : Controller
    {
        public IActionResult Index()
        {
            return View("/Views/Shared/NotFound.cshtml");
        }
    }
}
