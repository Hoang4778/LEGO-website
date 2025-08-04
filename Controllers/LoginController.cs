using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class LoginController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public LoginController(AppDBContext appDBContext)
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
        [Route("api/login")]
        public async Task<JsonResult> CustomerLogin()
        {
            using var reader = new StreamReader(Request.Body);
            string loginStr = await reader.ReadToEndAsync();

            string userLogin = hexToString(loginStr);
            var loginInfo = JsonSerializer.Deserialize<Login>(userLogin);

            if (loginInfo == null)
            {
                return new JsonResult(new LoginResponse { loginToken = "", message = "Bad user login input, please try again.", code = 400 });
            }
            else
            {
                var user = await _appDBContext.Customer.Where(customer => customer.email == loginInfo.email && customer.password == loginInfo.password).FirstOrDefaultAsync();

                if (user == null)
                {
                    return new JsonResult(new LoginResponse { loginToken = "", message = "There is no account under this login, please try again.", code = 404 });
                }
                else
                {
                    Customer customer = new Customer { firstName = user.firstName, lastName = user.lastName, avatarURL = user.avatarURL, id = user.id, phoneNumber = user.phoneNumber, email = user.email, address = user.address, city = user.city, state = user.state, country = user.country };
                    string customerStr = JsonSerializer.Serialize(customer);
                    return new JsonResult(new LoginResponse { loginToken = stringToHex(customerStr), message = "User found", code = 200 });
                }
            }
        }

        public IActionResult Index()
        {
            return View("/Views/Home/login.cshtml");
        }
    }
}
