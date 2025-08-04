using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DoAnCuoiKy.Controllers
{
    public class SearchController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public SearchController(AppDBContext appDBContext)
        {
            _appDBContext = appDBContext;
        }

        [Route("/api/search")]
        [Produces("application/json")]
        public async Task<JsonResult> search(string query)
        {
            try
            {
                var searchedProducts = new List<Product>();
                var searchedCollections = new List<Collection>();
                int searchedProductCount = 0;
                int searchedCollectionCount = 0;

                if (int.TryParse(query, out int modelNumber))
                {
                    searchedProducts = await _appDBContext.Product.Where(product => product.modelNumber == modelNumber && product.status).ToListAsync();
                    searchedProductCount = await _appDBContext.Product.Where(product => product.modelNumber == modelNumber && product.status).CountAsync();

                    var searchResult = new SearchResult { products = searchedProducts, collections = searchedCollections, searchedCollectionCount = searchedCollectionCount, searchedProductCount = searchedProductCount };

                    return new JsonResult(searchResult);
                }
                else
                {
                    var queryWords = query.Split("+", System.StringSplitOptions.RemoveEmptyEntries);

                    searchedProducts = await _appDBContext.Product.Where(product => queryWords.Any(word => product.title.ToLower().Contains(word)) && product.status).ToListAsync();
                    searchedProductCount = await _appDBContext.Product.Where(product => queryWords.Any(word => product.title.ToLower().Contains(word)) && product.status).CountAsync();

                    searchedCollections = await _appDBContext.Collection.Where(collection => queryWords.Any(word => collection.title.ToLower().Contains(word) || collection.description.ToLower().Contains(word))).ToListAsync();
                    searchedCollectionCount = await _appDBContext.Collection.Where(collection => queryWords.Any(word => collection.title.ToLower().Contains(word) || collection.description.ToLower().Contains(word))).CountAsync();

                    var searchResult = new SearchResult { products = searchedProducts, collections = searchedCollections, searchedCollectionCount = searchedCollectionCount, searchedProductCount = searchedProductCount };

                    return new JsonResult(searchResult);
                }
            }
            catch (Exception ex)
            {
                var searchResult = new SearchResult { products = new List<Product>(), collections = new List<Collection>(), searchedCollectionCount = 0, searchedProductCount = 0 };
                return new JsonResult(searchResult);
            }

        }

        [Route("/search")]
        public async Task<IActionResult> Index(string query)
        {
            if (query.IsNullOrEmpty())
            {
                return View("NotFound");
            }

            var rawSearchResult = await search(query);
            var jsonSeachResult = JsonSerializer.Serialize(rawSearchResult.Value);
            var searchResult = JsonSerializer.Deserialize<SearchResult>(jsonSeachResult);
            ViewData["searchResult"] = searchResult;
            ViewData["searchTerm"] = query;
            return View("/Views/Home/search.cshtml");
        }
    }
}
