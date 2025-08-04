using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class AdminHomeController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public AdminHomeController(AppDBContext appDBContext)
        {
            _appDBContext = appDBContext;
        }

        private string hexToString(string hex)
        {
            var bytes = Enumerable.Range(0, hex.Length / 2)
                .Select(x => Convert.ToByte(hex.Substring(x * 2, 2), 16))
                .ToArray();
            return System.Text.Encoding.UTF8.GetString(bytes);
        }

        private string stringToHex(string input)
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(input);
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }

        [HttpPost]
        [Route("api/admin/login")]
        public async Task<JsonResult> AdminLogin()
        {
            var reader = new StreamReader(Request.Body);
            string loginStr = await reader.ReadToEndAsync();

            string adminLogin = hexToString(loginStr);
            var loginInfo = JsonSerializer.Deserialize<Login>(adminLogin);

            if (loginInfo == null)
            {
                return new JsonResult(new LoginResponse { loginToken = "", message = "Bad user login input, please try again.", code = 400 });
            }
            else
            {
                var admin = await _appDBContext.AdminAccount.Where(admin => admin.email == loginInfo.email && admin.password == loginInfo.password).FirstOrDefaultAsync();

                if (admin == null)
                {
                    return new JsonResult(new LoginResponse { loginToken = "", message = "There is no account under this login, please try again.", code = 404 });
                }
                else
                {
                    AdminAccount currentAdmin = new AdminAccount { id = admin.id, accountName = admin.accountName, email = admin.email, avatarURL = admin.avatarURL };
                    string adminStr = JsonSerializer.Serialize(currentAdmin);
                    return new JsonResult(new LoginResponse { loginToken = stringToHex(adminStr), message = "Admin found", code = 200 });
                }
            }
        }

        [Route("api/admin/home/revenue")]
        public async Task<JsonResult> getRevenueByDateRange([FromQuery] string startDateStr, [FromQuery] string endDateStr)
        {
            if (!DateTime.TryParse(startDateStr, out DateTime startDate) ||
        !DateTime.TryParse(endDateStr, out DateTime endDate))
            {
                return new JsonResult(new RevenueResponse { isOkay = false, message = $"Invalid date format {startDate} and {endDateStr}. Please try again.", revenues = [] });
            }

            //startDate = startDate.Date;
            //endDate = endDate.Date;

            if (startDate > endDate)
            {
                return new JsonResult(new RevenueResponse { isOkay = false, message = "The start date must be less than the end date. Please try again.", revenues = [] });
            }

            var revenueList = new List<Revenue>();

            while (startDate <= endDate)
            {
                var nextDay = startDate.AddDays(1);
                var revenue = await _appDBContext.Order
                    .Where(o => o.orderDate >= startDate && o.orderDate < nextDay)
                    .SumAsync(o => (decimal?)o.total) ?? 0;

                revenueList.Add(new Revenue
                {
                    date = startDate.ToString(@"MMM dd, yyyy"),
                    revenue = revenue,
                });

                startDate = nextDay;
            }

            return new JsonResult(new RevenueResponse { isOkay = true, message = $"The list of revenue from {startDateStr} to {endDateStr} is fetched successfully.", revenues = revenueList });
        }

        public IActionResult Login()
        {
            return View("/Views/Admin/login.cshtml");
        }

        public IActionResult Index()
        {
            return View("/Views/Admin/Index.cshtml");
        }
    }
}
