namespace DoAnCuoiKy.Models
{
    public class PaginatedProductByCollection
    {
        public List<Product> products { get; set; }
        public int pageSize { get; set; }
        public int totalPages { get; set; }
        public int currentPage { get; set; }
        public string methodSort { get; set; }
    }
}
