namespace DoAnCuoiKy.Models
{
    public class PaginatedOrder
    {
        public List<OrderAndCustomer> orders {  get; set; }
        public int pageSize { get; set; }
        public int totalPages { get; set; }
        public int currentPage { get; set; }
        public string selectedSort { get; set; }
    }
}
