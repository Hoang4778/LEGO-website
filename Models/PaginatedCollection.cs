namespace DoAnCuoiKy.Models
{
    public class PaginatedCollection
    {
        public List<Collection> collections {  get; set; }
        public int pageSize { get; set; }
        public int totalPages { get; set; }
        public int currentPage { get; set; }
        public string methodSort { get; set; }
    }
}
