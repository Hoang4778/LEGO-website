namespace DoAnCuoiKy.Models
{
    public class RevenueResponse
    {
        public bool isOkay { get; set; }
        public string message { get; set; }
        public List<Revenue> revenues { get; set; }
    }
}
