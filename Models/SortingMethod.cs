namespace DoAnCuoiKy.Models
{
    public class SortOption
    {
        public string name { get; set; }
        public string value { get; set; }
    }
    public class SortingMethod
    {
        public string sortName { get; set; }
        public List<SortOption> sortOptions { get; set; }
        public string chosenOption { get; set; }
    }
}
