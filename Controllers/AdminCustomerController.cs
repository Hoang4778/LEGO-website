using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class AdminCustomerController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public AdminCustomerController(AppDBContext appDBContext)
        {
            _appDBContext = appDBContext;
        }

        [Route("api/admin/customers")]
        public async Task<string> getAdminPaginatedCustomers(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            try
            {
                int totalItems = await _appDBContext.Customer.CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var customers = new List<Customer>();

                if (sort == "name-asc")
                {
                    customers = await _appDBContext.Customer.OrderBy(customer => customer.firstName).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "name-desc")
                {
                    customers = await _appDBContext.Customer.OrderByDescending(customer => customer.firstName).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else
                {
                    customers = await _appDBContext.Customer.OrderBy(customer => customer.id).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }

                var paginatedCustomers = new PaginatedCustomer { pageSize = pageSize, customers = customers, currentPage = currentPage, totalPages = totalPages };

                return JsonSerializer.Serialize(paginatedCustomers);
            }
            catch (Exception ex)
            {
                var paginatedCustomers = new PaginatedCustomer { pageSize = pageSize, customers = new List<Customer>(), currentPage = 0, totalPages = 0 };

                return JsonSerializer.Serialize(paginatedCustomers);
            }
        }

        public async Task<IActionResult> Index(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            var paginatedCustomers = JsonSerializer.Deserialize<PaginatedCustomer>(await getAdminPaginatedCustomers(pageSize, currentPage, sort));

            return View("/Views/Admin/Customer/Index.cshtml", paginatedCustomers);
        }

        public IActionResult GetCustomerById(int customer_id)
        {
            return View("/Views/Admin/Customer/[customer-id].cshtml");
        }
    }
}
