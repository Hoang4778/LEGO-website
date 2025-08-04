using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class CollectionController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public CollectionController(AppDBContext appDBContext)
        {
            _appDBContext = appDBContext;
        }

        [Route("api/collections")]
        public async Task<JsonResult> getPaginatedCollections(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            try
            {
                int totalItems = await _appDBContext.Collection.Where(collection => collection.status).CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var collections = new List<Collection>();

                if (sort == "name-asc")
                {
                    collections = await _appDBContext.Collection.Where(collection => collection.status).OrderBy(collection => collection.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "name-desc")
                {
                    collections = await _appDBContext.Collection.Where(collection => collection.status).OrderByDescending(collection => collection.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else
                {
                    collections = await _appDBContext.Collection.Where(collection => collection.status).OrderBy(collection => collection.id).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }

                var paginatedCollections = new PaginatedCollection { pageSize = pageSize, collections = collections, currentPage = currentPage, totalPages = totalPages, methodSort = sort };

                return new JsonResult(paginatedCollections);
            }
            catch (Exception ex)
            {
                var paginatedCollections = new PaginatedCollection { pageSize = 0, collections = new List<Collection>(), currentPage = 0, totalPages = 0, methodSort = "default" };

                return new JsonResult(paginatedCollections);
            }
        }

        [Route("api/collections/products")]
        public async Task<JsonResult> getPaginatedProductsByCollection(int collectionId = 1, int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            try
            {
                int totalItems = await _appDBContext.Product.Where(product => product.collectionId == collectionId && product.status).CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var products = new List<Product>();

                if (sort == "name-asc")
                {
                    products = await _appDBContext.Product.Where(product => product.collectionId == collectionId && product.status).OrderBy(product => product.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "name-desc")
                {
                    products = await _appDBContext.Product.Where(product => product.collectionId == collectionId && product.status).OrderByDescending(product => product.title).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "price-asc")
                {
                    products = await _appDBContext.Product.Where(product => product.collectionId == collectionId && product.status).OrderBy(product => product.price).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "price-desc")
                {
                    products = await _appDBContext.Product.Where(product => product.collectionId == collectionId && product.status).OrderByDescending(product => product.price).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else
                {
                    products = await _appDBContext.Product.Where(product => product.collectionId == collectionId && product.status).OrderBy(product => product.id).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }

                var paginatedProducts = new PaginatedProductByCollection { pageSize = pageSize, products = products, currentPage = currentPage, totalPages = totalPages, methodSort = sort};

                return new JsonResult(paginatedProducts);
            }
            catch (Exception ex)
            {
                var paginatedProducts = new PaginatedProductByCollection { pageSize = 0, products = new List<Product>(), currentPage = 0, totalPages = 0, methodSort = "default" };

                return new JsonResult(paginatedProducts);
            }
        }

        public async Task<IActionResult> Index(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            var rawPaginatedCollections = await getPaginatedCollections(pageSize, currentPage, sort);
            var jsonPaginatedCollections = JsonSerializer.Serialize(rawPaginatedCollections.Value);
            var paginatedCollections = JsonSerializer.Deserialize<PaginatedCollection>(jsonPaginatedCollections);

            return View(paginatedCollections);
        }
        public async Task<IActionResult> GetCollectionBySlug(string collection_slug, int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            try
            {
                var collection = await _appDBContext.Collection.SingleAsync(collection => collection.handle == collection_slug && collection.status == true);

                if (collection == null)
                {
                    return View("NotFound");
                }

                var rawPaginatedProducts = await getPaginatedProductsByCollection(collection.id, pageSize, currentPage, sort);
                var jsonPaginatedProducts = JsonSerializer.Serialize(rawPaginatedProducts.Value);
                var paginatedProducts = JsonSerializer.Deserialize<PaginatedProductByCollection>(jsonPaginatedProducts);
                ViewData["paginatedProducts"] = paginatedProducts;
                ViewData["collection"] = collection;

                return View("/Views/Collection/[collection-slug].cshtml");
            }
            catch (Exception ex)
            {
                return View("Error", ex.Message);
            }
        }
    }
}
