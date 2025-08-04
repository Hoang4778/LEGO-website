namespace DoAnCuoiKy.Models
{
    public class Order
    {
        public int id {  get; set; }
        public decimal total { get; set; }
        public int customerId { get; set; }
        public string shippingAddress { get; set; }
        public string email { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string country { get; set; }
        public string status { get; set; }
        public DateTime? orderDate { get; set; }
        public DateTime createdDate { get; set; }
        public DateTime? shippedDate { get; set; }
        public DateTime? deliveredDate { get; set; }
        public DateTime? fulfilledDate { get; set; }
        public DateTime? archivedDate { get; set; }
        public DateTime? cancelledDate { get; set; }
    }
}
