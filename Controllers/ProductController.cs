using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class ProductController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public ProductController(AppDBContext appDBContext)
        {
            _appDBContext = appDBContext;
        }

        [Route("api/products")]
        public async Task<JsonResult> getPaginatedProducts(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            try
            {
                int totalItems = await _appDBContext.Product.Where(product => product.status).CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var products = new List<Product>();

                if (sort == "name-asc")
                {
                    products = await _appDBContext.Product.Where(product => product.status).OrderBy(product => product.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "name-desc")
                {
                    products = await _appDBContext.Product.Where(product => product.status).OrderByDescending(product => product.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "price-asc")
                {
                    products = await _appDBContext.Product.Where(product => product.status).OrderBy(product => product.price).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "price-desc")
                {
                    products = await _appDBContext.Product.Where(product => product.status).OrderByDescending(product => product.price).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else
                {
                    products = await _appDBContext.Product.Where(product => product.status).OrderBy(product => product.id).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }

                var paginatedProducts = new PaginatedProduct { pageSize = pageSize, products = products, currentPage = currentPage, totalPages = totalPages, selectedSort = sort };

                return new JsonResult(paginatedProducts);
            }
            catch (Exception ex)
            {
                var paginatedProducts = new PaginatedProduct { pageSize = 0, products = new List<Product>(), currentPage = 0, totalPages = 0, selectedSort = "default" };

                return new JsonResult(paginatedProducts);
            }
        }

        public async Task<IActionResult> Index(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            var rawPaginatedProducts = await getPaginatedProducts(pageSize, currentPage, sort);
            var jsonPaginatedProducts = JsonSerializer.Serialize(rawPaginatedProducts.Value);
            var paginatedProducts = JsonSerializer.Deserialize<PaginatedProduct>(jsonPaginatedProducts);

            return View(paginatedProducts);
        }
        public async Task<IActionResult> GetProductBySlug(string product_slug)
        {
            var product = await _appDBContext.Product.FirstAsync(product => product.handle == product_slug && product.status == true);

            if (product == null)
            {
                return View("NotFound");
            }
            ViewData["product"] = product;

            return View("/Views/Product/[product-slug].cshtml");
        }
    }
}
