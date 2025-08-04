using DoAnCuoiKy.Models;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Contexts
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }

        public DbSet<AdminAccount> AdminAccount { get; set; } 
        public DbSet<Collection> Collection { get; set; } 
        public DbSet<Product> Product { get; set; } 
        public DbSet<Order> Order { get; set; } 
        public DbSet<Customer> Customer { get; set; } 
        public DbSet<OrderedItems> OrderedItem { get; set; } 
    }

}
