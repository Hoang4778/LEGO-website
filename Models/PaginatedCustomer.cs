namespace DoAnCuoiKy.Models
{
    public class PaginatedCustomer
    {
        public List<Customer> customers {  get; set; }
        public int pageSize { get; set; }
        public int totalPages { get; set; }
        public int currentPage { get; set; }
    }
}
