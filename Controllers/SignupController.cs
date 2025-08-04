using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class SignupController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public SignupController(AppDBContext appDBContext)
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

        [Route("api/signup/check-email")]
        public async Task<JsonResult> checkAccountBeforeSignup([FromQuery] string email)
        {
            if (email == null)
            {
                return new JsonResult(new LoginResponse { loginToken = "", code = 400, message = "No email address provided. Please try again." });
            }
            else
            {
                try
                {
                    var customer = await _appDBContext.Customer.FirstOrDefaultAsync(customer => customer.email == email);
                    if (customer == null)
                    {
                        return new JsonResult(new LoginResponse { code = 404, loginToken = "", message = "No customer found. Ready to create new customer profile" });
                    }
                    else
                    {
                        return new JsonResult(new LoginResponse { code = 200, loginToken = "", message = "An account under this email address has already existed. Please use another email address to sign up." });
                    }
                }
                catch (Exception ex)
                {
                    return new JsonResult(new LoginResponse { message = ex.Message, code = 500, loginToken = "" });
                }
            }
        }

        [HttpPost]
        [Route("api/signup")]
        public async Task<JsonResult> CustomerSignup()
        {
            using var reader = new StreamReader(Request.Body);
            string signupStr = await reader.ReadToEndAsync();

            string userSignup = hexToString(signupStr);
            var signupInfo = JsonSerializer.Deserialize<Signup>(userSignup);

            if (signupInfo == null)
            {
                return new JsonResult(new LoginResponse { loginToken = "", message = "Bad user signup input, please try again.", code = 400 });
            }
            else
            {
                var user = await _appDBContext.Customer.Where(customer => customer.email == signupInfo.email).FirstOrDefaultAsync();

                if (user == null)
                {
                    Customer customer = new Customer { firstName = signupInfo.firstName, lastName = signupInfo.lastName, email = signupInfo.email, password = signupInfo.password };
                    _appDBContext.Customer.Add(customer);
                    await _appDBContext.SaveChangesAsync();

                    Customer newCustomer = new Customer { firstName = customer.firstName, lastName = customer.lastName, email = customer.email, phoneNumber = customer.phoneNumber, address = customer.address, id = customer.id, avatarURL = customer.avatarURL, city = customer.city, state = customer.state, country = customer.country };
                    string customerStr = JsonSerializer.Serialize(newCustomer);
                    return new JsonResult(new LoginResponse { loginToken = stringToHex(customerStr), message = "Signup succeeded", code = 200 });
                }
                else
                {
                    return new JsonResult(new LoginResponse { loginToken = "", message = "An account already exists, please try again.", code = 200});
                }
            }
        }

        public IActionResult Index()
        {
            return View("/Views/Home/signup.cshtml");
        }
    }
}
