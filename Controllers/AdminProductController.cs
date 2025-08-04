using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class AdminProductController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public AdminProductController(AppDBContext appDBContext)
        {
            _appDBContext = appDBContext;
        }

        public async Task<List<Product>> getProductsByCollectionId(int collectionId)
        {
            var products = await _appDBContext.Product.Where(product => product.collectionId == collectionId).ToListAsync();

            return products;
        }

        [Route("api/admin/products")]
        public async Task<string> getPaginatedProducts(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            try
            {
                int totalItems = await _appDBContext.Product.CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var products = new List<Product>();

                if (sort == "name-asc")
                {
                    products = await _appDBContext.Product.OrderBy(product => product.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "name-desc")
                {
                    products = await _appDBContext.Product.OrderByDescending(product => product.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "price-asc")
                {
                    products = await _appDBContext.Product.OrderBy(product => product.price).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "price-desc")
                {
                    products = await _appDBContext.Product.OrderByDescending(product => product.price).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else
                {
                    products = await _appDBContext.Product.OrderBy(product => product.id).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }

                var paginatedProducts = new PaginatedProduct { pageSize = pageSize, products = products, currentPage = currentPage, totalPages = totalPages, selectedSort = sort };

                return JsonSerializer.Serialize(paginatedProducts);
            }
            catch (Exception ex)
            {
                var paginatedProducts = new PaginatedProduct { pageSize = 0, products = new List<Product>(), currentPage = 0, totalPages = 0, selectedSort = sort };

                return JsonSerializer.Serialize(paginatedProducts);
            }
        }

        public async Task<IActionResult> Index(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            var paginatedProducts = JsonSerializer.Deserialize<PaginatedProduct>(await getPaginatedProducts(pageSize, currentPage, sort));
            return View("/Views/Admin/Product/Index.cshtml", paginatedProducts);
        }

        public async Task<IActionResult> GetProductBySlug(string product_slug)
        {
            string queryCreateProduct = Request.Query["createProduct"];

            var product = await _appDBContext.Product.FirstOrDefaultAsync(product => product.handle == product_slug);

            if (product == null)
            {
                if (product_slug == "new" && queryCreateProduct == "yes")
                {
                    AdminCollectionController adminCollection = new AdminCollectionController(_appDBContext);
                    var collections = await adminCollection.getAllCollections();
                    ViewData["admin_product"] = new Product();
                    ViewData["admin_collections"] = collections;

                    return View("/Views/Admin/Product/[product-slug].cshtml");
                }
                else
                {
                    return View("/Views/Shared/AdminNotFound.cshtml");
                }
            }
            else
            {
                AdminCollectionController adminCollection = new AdminCollectionController(_appDBContext);
                var collections = await adminCollection.getAllCollections();
                ViewData["admin_collections"] = collections;
                ViewData["admin_product"] = product;

                return View("/Views/Admin/Product/[product-slug].cshtml");
            }
        }

        [HttpPost]
        [Route("api/admin/product/update")]
        public async Task<JsonResult> updateProduct()
        {
            var reader = new StreamReader(Request.Body);
            string rawProductInfo = await reader.ReadToEndAsync();
            var productInfo = JsonSerializer.Deserialize<Product>(rawProductInfo);

            if (productInfo != null)
            {
                try
                {
                    var product = await _appDBContext.Product.FirstOrDefaultAsync(product => product.id == productInfo.id);

                    if (product != null)
                    {
                        product.title = productInfo.title;
                        product.description = productInfo.description;
                        product.handle = productInfo.handle;
                        product.price = productInfo.price;
                        product.inventory = productInfo.inventory;
                        product.status = productInfo.status;
                        product.modelNumber = productInfo.modelNumber;
                        product.collectionId = productInfo.collectionId;
                        product.imageURL = productInfo.imageURL;

                        await _appDBContext.SaveChangesAsync();

                        return new JsonResult(new AdminItemResponse { isOkay = true, message = "Product edited successfully.", data = product });
                    }
                    else
                    {
                        return new JsonResult(new AdminItemResponse { isOkay = false, message = "Product not found. Please try again", data = null });
                    }
                }
                catch (Exception ex)
                {
                    return new JsonResult(new AdminItemResponse { isOkay = false, message = ex.Message, data = null });
                }
            }
            else
            {
                return new JsonResult(new AdminItemResponse { isOkay = false, message = "Bad product data input. Please try again.", data = null });
            }
        }

        [HttpPost]
        [Route("api/admin/product/create")]
        public async Task<JsonResult> addProduct()
        {
            var reader = new StreamReader(Request.Body);
            string rawProductInfo = await reader.ReadToEndAsync();
            var productInfo = JsonSerializer.Deserialize<Product>(rawProductInfo);

            if (productInfo != null)
            {
                try
                {
                    Product product = new Product();

                    product.title = productInfo.title;
                    product.description = productInfo.description;
                    product.handle = productInfo.handle;
                    product.price = productInfo.price;
                    product.inventory = productInfo.inventory;
                    product.status = productInfo.status;
                    product.modelNumber = productInfo.modelNumber;
                    product.collectionId = productInfo.collectionId;
                    product.imageURL = productInfo.imageURL;

                    _appDBContext.Product.Add(product);
                    await _appDBContext.SaveChangesAsync();
                    return new JsonResult(new AdminItemResponse { isOkay = true, message = "Product created successfully.", data = product });
                }
                catch (Exception ex)
                {
                    return new JsonResult(new AdminItemResponse { isOkay = false, message = ex.Message, data = null });
                }
            }
            else
            {
                return new JsonResult(new AdminItemResponse { isOkay = false, message = "Bad product data input. Please try again.", data = null });
            }

        }
    }
}
