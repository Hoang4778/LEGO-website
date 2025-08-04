using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly AppDBContext _appDBContext;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(AppDBContext appDBContext, ILogger<CheckoutController> logger)
        {
            _appDBContext = appDBContext;
            _logger = logger;
        }

        [HttpPost]
        [Route("api/checkout/order")]
        public async Task<JsonResult> postOrder()
        {
            var reader = new StreamReader(Request.Body);
            string rawOrderInfo = await reader.ReadToEndAsync();
            var orderInfo = JsonSerializer.Deserialize<Order>(rawOrderInfo);

            if (orderInfo == null)
            {
                return new JsonResult(new OrderResponse { isOkay = false, message = "Bad order details, please try again." });
            }
            else
            {
                try
                {
                    Order order = new Order { city = orderInfo.city, country = orderInfo.country, customerId = orderInfo.customerId, createdDate = orderInfo.createdDate, email = orderInfo.email, orderDate = orderInfo.orderDate, state = orderInfo.state, status = orderInfo.status, total = orderInfo.total, shippingAddress = orderInfo.shippingAddress };

                    _appDBContext.Order.Add(order);
                    await _appDBContext.SaveChangesAsync();

                    return new JsonResult(new OrderResponse { isOkay = true, message = "Order placed successfully", orderId = order.id });
                }
                catch (Exception ex)
                {
                    return new JsonResult(new OrderResponse { isOkay = false, message = ex.Message });
                }
            }
        }

        [HttpPost]
        [Route("api/checkout/ordered-items")]
        public async Task<JsonResult> postOrderItems()
        {
            var reader = new StreamReader(Request.Body);
            string rawOrderedItems = await reader.ReadToEndAsync();
            var orderedItemsInfo = JsonSerializer.Deserialize<List<OrderedItems>>(rawOrderedItems);

            if (orderedItemsInfo == null)
            {
                return new JsonResult(new OrderResponse { isOkay = false, message = "Bad ordered items details, please try again." });
            }
            else
            {
                List<OrderedItems> orderedItems = new List<OrderedItems>();
                foreach (OrderedItems orderedItemInfo in orderedItemsInfo)
                {
                    OrderedItems orderedItem = new OrderedItems();
                    orderedItem.orderId = orderedItemInfo.orderId;
                    orderedItem.quantity = orderedItemInfo.quantity;
                    orderedItem.productId = orderedItemInfo.productId;
                    orderedItems.Add(orderedItemInfo);
                }

                try
                {
                    await _appDBContext.OrderedItem.AddRangeAsync(orderedItems);
                    await _appDBContext.SaveChangesAsync();

                    return new JsonResult(new OrderResponse { isOkay = true, message = "Ordered items added successfully.", orderId = orderedItems[0].id });
                }
                catch (Exception ex)
                {
                    return new JsonResult(new OrderResponse { isOkay = false, message = ex.Message });
                }
            }
        }

        [HttpPost]
        [Route("api/orders")]
        public async Task<JsonResult> getOrdersByCustomer(int customerId)
        {
            return new JsonResult(new Order());
        }

        [HttpPost]
        [Route("api/checkout/product-quantity")]
        public async Task<JsonResult> updateProductQuantity()
        {
            var reader = new StreamReader(Request.Body);
            string rawOrderedItems = await reader.ReadToEndAsync();
            var orderedItemsInfo = JsonSerializer.Deserialize<List<OrderedItems>>(rawOrderedItems);

            if (orderedItemsInfo == null)
            {
                return new JsonResult(new OrderResponse { isOkay = false, message = "Bad ordered items details, please try again." });
            }
            else
            {
                var orderedItems = orderedItemsInfo.Select(item => new OrderedItems
                {
                    orderId = item.orderId,
                    productId = item.productId,
                    quantity = item.quantity
                }).ToList();


                await using var transaction = await _appDBContext.Database.BeginTransactionAsync();
                try
                {
                    var productIds = orderedItems.Select(order => order.productId).ToList();
                    var productsToUpdate = await _appDBContext.Product
                        .Where(product => productIds.Contains(product.id))
                        .ToListAsync();

                    foreach (var orderedItem in orderedItems)
                    {
                        var product = productsToUpdate.FirstOrDefault(p => p.id == orderedItem.productId);
                        if (product == null)
                        {
                            return new JsonResult(new OrderResponse
                            {
                                isOkay = false,
                                message = $"Product with ID {orderedItem.productId} not found."
                            });
                        }

                        if (product.inventory < orderedItem.quantity)
                        {
                            return new JsonResult(new OrderResponse
                            {
                                isOkay = false,
                                message = $"The product '{product.title}' only has {product.inventory} item(s) in stock. Please order fewer items."
                            });
                        }
                    }

                    foreach (var orderedItem in orderedItems)
                    {
                        var product = productsToUpdate.First(product => product.id == orderedItem.productId);
                        product.inventory -= orderedItem.quantity;
                    }

                    await _appDBContext.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return new JsonResult(new OrderResponse { isOkay = true, message = "Product quantities are updated successfully." });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return new JsonResult(new OrderResponse { isOkay = false, message = ex.Message });
                }

            }
        }

        public IActionResult Index()
        {
            return View("/Views/Home/checkout.cshtml");
        }
    }
}
