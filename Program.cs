using DoAnCuoiKy.Contexts;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<AppDBContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("GlobalConnectionString")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseStatusCodePagesWithRedirects("/NotFound");

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "contact",
    pattern: "/contact",
    defaults: new { controller = "Home", action = "Contact" }
);
app.MapControllerRoute(
    name: "cart",
    pattern: "/cart",
    defaults: new { controller = "Home", action = "Cart" }
);
app.MapControllerRoute(
    name: "checkout",
    pattern: "/checkout",
    defaults: new { controller = "Home", action = "Checkout" }
);
app.MapControllerRoute(
    name: "thankyou",
    pattern: "/thank-you",
    defaults: new { controller = "Home", action = "ThankYou" }
);
app.MapControllerRoute(
    name: "collections",
    pattern: "/collections",
    defaults: new { controller = "Collection", action = "Index" }
);
app.MapControllerRoute(
    name: "collectionType",
    pattern: "/collections/{collection_slug}",
    defaults: new { controller = "Collection", action = "GetCollectionBySlug" }
);
app.MapControllerRoute(
    name: "products",
    pattern: "/products",
    defaults: new { controller = "Product", action = "Index" }
);
app.MapControllerRoute(
    name: "productDetail",
    pattern: "/products/{product_slug}",
    defaults: new { controller = "Product", action = "GetProductBySlug" }
);
app.MapControllerRoute(
    name: "profile",
    pattern: "/profile",
    defaults: new { controller = "Profile", action = "Index" }
);
app.MapControllerRoute(
    name: "login",
    pattern: "/login",
    defaults: new { controller = "Login", action = "Index" }
);
app.MapControllerRoute(
    name: "attemptLogin",
    pattern: "/api/login",
    defaults: new { controller = "Login", action = "CustomerLogin" }
);
app.MapControllerRoute(
    name: "attemptSignup",
    pattern: "/api/signup",
    defaults: new { controller = "Signup", action = "CustomerSignup" }
);
app.MapControllerRoute(
    name: "signup",
    pattern: "/signup",
    defaults: new { controller = "Signup", action = "Index" }
);
app.MapControllerRoute(
    name: "admin-login",
    pattern: "/admin/login",
    defaults: new { controller = "AdminHome", action = "Login" }
);
app.MapControllerRoute(
    name: "admin",
    pattern: "/admin",
    defaults: new { controller = "AdminHome", action = "Index" }
);
app.MapControllerRoute(
    name: "admin-orders",
    pattern: "/admin/orders",
    defaults: new { controller = "AdminOrder", action = "Index" }
);
app.MapControllerRoute(
    name: "admin-order-id",
    pattern: "/admin/orders/{id:int}",
    defaults: new { controller = "AdminOrder", action = "GetOrderById" }
);
app.MapControllerRoute(
    name: "admin-products",
    pattern: "/admin/products",
    defaults: new { controller = "AdminProduct", action = "Index" }
);
app.MapControllerRoute(
    name: "admin-product-slug",
    pattern: "/admin/products/{product_slug}",
    defaults: new { controller = "AdminProduct", action = "GetProductBySlug" }
);
app.MapControllerRoute(
    name: "admin-collections",
    pattern: "/admin/collections",
    defaults: new { controller = "AdminCollection", action = "Index" }
);
app.MapControllerRoute(
    name: "admin-collection-slug",
    pattern: "/admin/collections/{collection_slug}",
    defaults: new { controller = "AdminCollection", action = "GetCollectionBySlug" }
);
app.MapControllerRoute(
    name: "admin-customers",
    pattern: "/admin/customers",
    defaults: new { controller = "AdminCustomer", action = "Index" }
);
app.MapControllerRoute(
    name: "admin-customer-id",
    pattern: "/admin/customers/{customer_id:int}",
    defaults: new { controller = "AdminCustomer", action = "GetCustomerById" }
);

app.Run();
