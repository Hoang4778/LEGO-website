using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class AdminCollectionController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public AdminCollectionController(AppDBContext appDBContext)
        {
            _appDBContext = appDBContext;
        }

        public async Task<List<Collection>> getAllCollections()
        {
            var collections = await _appDBContext.Collection.ToListAsync();
            return collections;
        }

        [Route("api/admin/collections")]
        public async Task<string> getAdminPaginatedCollections(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            try
            {
                int totalItems = await _appDBContext.Collection.CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var collections = new List<Collection>();

                if (sort == "name-asc")
                {
                    collections = await _appDBContext.Collection.OrderBy(collection => collection.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "name-desc")
                {
                    collections = await _appDBContext.Collection.OrderByDescending(collection => collection.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else
                {
                    collections = await _appDBContext.Collection.OrderBy(collection => collection.id).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }

                var paginatedCollections = new PaginatedCollection { pageSize = pageSize, collections = collections, currentPage = currentPage, totalPages = totalPages };

                return JsonSerializer.Serialize(paginatedCollections);
            }
            catch (Exception ex)
            {
                var paginatedCollections = new PaginatedCollection { pageSize = 0, collections = new List<Collection>(), currentPage = 0, totalPages = 0 };

                return JsonSerializer.Serialize(paginatedCollections);
            }
        }

        public async Task<IActionResult> Index(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            var paginatedCollections = JsonSerializer.Deserialize<PaginatedCollection>(await getAdminPaginatedCollections(pageSize, currentPage, sort));
            return View("/Views/Admin/Collection/index.cshtml", paginatedCollections);
        }

        public async Task<IActionResult> GetCollectionBySlug(string collection_slug)
        {
            var collection = await _appDBContext.Collection.FirstOrDefaultAsync(collection => collection.handle == collection_slug);

            if (collection == null)
            {
                return View("/Views/Shared/NotFound.cshtml");
            }
            ViewData["admin_collection"] = collection;

            AdminProductController adminProduct = new AdminProductController(_appDBContext);
            var products = await adminProduct.getProductsByCollectionId(collection.id);
            ViewData["admin_products_by_collection_id"] = products;

            return View("/Views/Admin/Collection/[collection-slug].cshtml");
        }
    }
}
