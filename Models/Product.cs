namespace DoAnCuoiKy.Models
{
    public class Product
    {
        public int id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string handle { get; set; }
        public decimal price { get; set; }
        public int inventory { get; set; }
        public bool status { get; set; }
        public int modelNumber { get; set; }
        public int collectionId { get; set; }
        public string imageURL { get; set; }
    }
}
