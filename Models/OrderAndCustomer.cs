namespace DoAnCuoiKy.Models
{
    public class OrderAndCustomer
    {
        public int id {  get; set; }
        public decimal total { get; set; }
        public DateTime? orderDate { get; set; }
        public int customerId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string shippingAddress { get; set; }
        public string status { get; set; }
    }
}
