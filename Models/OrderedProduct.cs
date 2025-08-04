namespace DoAnCuoiKy.Models
{
    public class OrderedProduct
    {
        public int orderItemId { get; set; }
        public int productId { get; set; }
        public string title { get; set; }
        public decimal price { get; set; }
        public int quantity { get; set; }
        public string imageURL { get; set; }
    }
}
