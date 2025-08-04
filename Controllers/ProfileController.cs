using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;

namespace DoAnCuoiKy.Controllers
{
    public class ProfileController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public ProfileController(AppDBContext appDBContext)
        {
            _appDBContext = appDBContext;
        }

        private string stringToHex(string input)
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(input);
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }

        [HttpPost]
        [Route("api/profile/update")]
        public async Task<JsonResult> updateProfile()
        {
            var reader = new StreamReader(Request.Body);
            string rawProfileInfo = await reader.ReadToEndAsync();
            var profileInfo = JsonSerializer.Deserialize<Customer>(rawProfileInfo);

            if (profileInfo != null)
            {
                try
                {
                    var profile = await _appDBContext.Customer.FindAsync(profileInfo.id);

                    if (profile != null)
                    {
                        profile.phoneNumber = profileInfo.phoneNumber;
                        profile.address = profileInfo.address;
                        profile.city = profileInfo.city;
                        profile.state = profileInfo.state;
                        profile.country = profileInfo.country;

                        await _appDBContext.SaveChangesAsync();

                        string hexProfile = stringToHex(JsonSerializer.Serialize(profile));

                        return new JsonResult(new CustomerProfileResponse { isOkay = true, message = "Customer profile updated successfully", loginToken = hexProfile });
                    }
                    else
                    {
                        return new JsonResult(new CustomerProfileResponse { isOkay = false, message = "Customer profile not found. Please try again." });
                    }
                }
                catch (Exception ex)
                {
                    return new JsonResult(new CustomerProfileResponse { isOkay = false, message = ex.Message });
                }
            }
            else
            {
                return new JsonResult(new CustomerProfileResponse { isOkay = false, message = "Bad customer profile details. Please try again." });
            }
        }

        public IActionResult Index()
        {
            return View("/Views/Home/profile.cshtml");
        }

        public async Task<JsonResult> createProfile()
        {
            var reader = new StreamReader(Request.Body);
            string rawProfileInfo = await reader.ReadToEndAsync();
            var profileInfo = JsonSerializer.Deserialize<Customer>(rawProfileInfo);

            if (profileInfo == null)
            {
                return new JsonResult(new CustomerProfileResponse { isOkay = false, message = "Bad customer profile details. Please try again." });
            }
            else
            {
                try
                {
                    Customer newCustomer = new Customer();

                    newCustomer.firstName = profileInfo.firstName;
                    newCustomer.lastName = profileInfo.lastName;
                    newCustomer.email = profileInfo.email;
                    newCustomer.phoneNumber = profileInfo.phoneNumber;
                    newCustomer.address = profileInfo.address;
                    newCustomer.city = profileInfo.city;
                    newCustomer.state = profileInfo.state;
                    newCustomer.country = profileInfo.country;

                    _appDBContext.Customer.Add(newCustomer);
                    await _appDBContext.SaveChangesAsync();
                    return new JsonResult(new CustomerProfileResponse { isOkay = true, message = "Customer profile added successfully." });
                }
                catch (Exception ex)
                {
                    return new JsonResult(new CustomerProfileResponse { isOkay = false, message = ex.Message });
                }
            }
        }
    }
}
