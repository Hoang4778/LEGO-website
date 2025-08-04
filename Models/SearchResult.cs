namespace DoAnCuoiKy.Models
{
    public class SearchResult
    {
        public List<Collection> collections {  get; set; }
        public List<Product> products { get; set; }
        public int searchedCollectionCount { get; set; }
        public int searchedProductCount { get; set; }
    }
}
