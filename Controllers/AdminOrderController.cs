using System.Text.Json;
using DoAnCuoiKy.Contexts;
using DoAnCuoiKy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DoAnCuoiKy.Controllers
{
    public class AdminOrderController : Controller
    {
        private readonly AppDBContext _appDBContext;

        public AdminOrderController(AppDBContext appDBContext)
        {
            _appDBContext = appDBContext;
        }

        [Route("api/admin/orders")]
        public async Task<string> getPaginatedOrders(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            try
            {
                int totalItems = await _appDBContext.Order.CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var orders = new List<OrderAndCustomer>();

                if (sort == "order-date-asc")
                {
                    orders = await _appDBContext.Order.Join(_appDBContext.Customer, order => order.customerId, customer => customer.id, (order, customer) => new OrderAndCustomer
                    {
                        id = order.id,
                        orderDate = order.orderDate,
                        customerId = customer.id,
                        firstName = customer.firstName,
                        lastName = customer.lastName,
                        total = order.total,
                        status = order.status
                    }).OrderBy(order => order.orderDate).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else if (sort == "order-date-desc")
                {
                    orders = await _appDBContext.Order.Join(_appDBContext.Customer, order => order.customerId, customer => customer.id, (order, customer) => new OrderAndCustomer
                    {
                        id = order.id,
                        orderDate = order.orderDate,
                        customerId = customer.id,
                        firstName = customer.firstName,
                        lastName = customer.lastName,
                        total = order.total,
                        status = order.status
                    }).OrderByDescending(order => order.orderDate).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }
                else
                {
                    orders = await _appDBContext.Order.Join(_appDBContext.Customer, order => order.customerId, customer => customer.id, (order, customer) => new OrderAndCustomer
                    {
                        id = order.id,
                        orderDate = order.orderDate,
                        customerId = customer.id,
                        firstName = customer.firstName,
                        lastName = customer.lastName,
                        total = order.total,
                        status = order.status
                    }).OrderBy(order => order.id).Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
                }

                var paginatedOrders = new PaginatedOrder { pageSize = pageSize, orders = orders, currentPage = currentPage, totalPages = totalPages, selectedSort = sort };

                return JsonSerializer.Serialize(paginatedOrders);
            }
            catch (Exception ex)
            {
                var paginatedOrders = new PaginatedOrder { pageSize = 0, orders = new List<OrderAndCustomer>(), currentPage = 0, totalPages = 0, selectedSort = sort };

                return JsonSerializer.Serialize(paginatedOrders);
            }
        }

        public async Task<IActionResult> Index(int pageSize = 5, int currentPage = 1, string sort = "default")
        {
            var paginatedOrders = JsonSerializer.Deserialize<PaginatedOrder>(await getPaginatedOrders(pageSize, currentPage, sort));

            return View("/Views/Admin/Order/Index.cshtml", paginatedOrders);
        }

        public async Task<IActionResult> GetOrderById(int id)
        {
            string queryCreateOrder = Request.Query["createOrder"];

            var order = await _appDBContext.Order.Join(_appDBContext.Customer, order => order.customerId, customer => customer.id, (order, customer) => new DetailedOrder
            {
                id = order.id,
                total = order.total,
                shippingAddress = order.shippingAddress,
                status = order.status,
                createdDate = order.createdDate,
                orderDate = order.orderDate,
                shippedDate = order.shippedDate,
                deliveredDate = order.deliveredDate,
                fulfilledDate = order.fulfilledDate,
                archivedDate = order.archivedDate,
                cancelledDate = order.cancelledDate,
                firstName = customer.firstName,
                lastName = customer.lastName,
                phoneNumber = customer.phoneNumber,
                email = order.email,
                city = order.city,
                state = order.state,
                country = order.country
            }).FirstOrDefaultAsync(order => order.id == id);

            List<OrderedProduct> orderedProducts = await _appDBContext.OrderedItem.Where(orderedItem => orderedItem.orderId == id).Join(_appDBContext.Product, orderItem => orderItem.productId, product => product.id, (orderItem, product) => new OrderedProduct
            {
                orderItemId = orderItem.id,
                productId = product.id,
                title = product.title,
                price = product.price,
                quantity = orderItem.quantity,
                imageURL = product.imageURL
            }).ToListAsync();

            if (order == null)
            {
                if (id == 0 && queryCreateOrder == "yes")
                {
                    ViewData["order"] = new DetailedOrder();
                    ViewData["orderedProducts"] = new List<OrderedProduct>();
                    return View("/Views/Admin/Order/[order-id].cshtml");
                }
                else
                {
                    return View("/Views/Shared/AdminNotFound.cshtml");
                }
            }
            else
            {
                ViewData["order"] = order;
                ViewData["orderedProducts"] = orderedProducts;
                return View("/Views/Admin/Order/[order-id].cshtml");
            }
        }

        [HttpPost]
        [Route("api/admin/order/update")]
        public async Task<JsonResult> updateOrder()
        {
            var reader = new StreamReader(Request.Body);
            string rawOrderInfo = await reader.ReadToEndAsync();
            var orderInfo = JsonSerializer.Deserialize<Order>(rawOrderInfo);

            if (orderInfo == null)
            {
                return new JsonResult(new AdminItemResponse { isOkay = false, message = "Bad order data. Please try again.", data = orderInfo });
            }
            else
            {
                try
                {
                    var order = await _appDBContext.Order.FirstOrDefaultAsync(order => order.id == orderInfo.id);

                    if (order == null)
                    {
                        return new JsonResult(new AdminItemResponse() { isOkay = false, message = "Order not found. Please try again", data = orderInfo });
                    }
                    else
                    {
                        order.shippingAddress = orderInfo.shippingAddress;
                        order.status = orderInfo.status;
                        order.orderDate = orderInfo.orderDate;
                        order.createdDate = orderInfo.createdDate;
                        order.shippedDate = orderInfo.shippedDate;
                        order.deliveredDate = orderInfo.deliveredDate;
                        order.fulfilledDate = orderInfo.fulfilledDate;
                        order.archivedDate = orderInfo.archivedDate;
                        order.cancelledDate = orderInfo.cancelledDate;
                        order.city = orderInfo.city;
                        order.state = orderInfo.state;
                        order.country = orderInfo.country;

                        await _appDBContext.SaveChangesAsync();

                        return new JsonResult(new AdminItemResponse { isOkay = true, message = "Order updated successfully.", data = order });
                    }
                }
                catch (Exception ex)
                {
                    return new JsonResult(new AdminItemResponse { isOkay = false, message = ex.Message, data = orderInfo });
                }
            }
        }

        [HttpPost]
        [Route("api/admin/order/create")]
        public async Task<JsonResult> createOrder()
        {
            var reader = new StreamReader(Request.Body);
            string rawOrderInfo = await reader.ReadToEndAsync();
            var orderInfo = JsonSerializer.Deserialize<Order>(rawOrderInfo);

            if (orderInfo == null)
            {
                return new JsonResult(new AdminItemResponse { isOkay = false, message = "Bad order data. Please try again.", data = orderInfo });
            }
            else
            {
                try
                {
                    Order newOrder = new Order();

                    newOrder.total = orderInfo.total;
                    newOrder.customerId = orderInfo.customerId;
                    newOrder.shippingAddress = orderInfo.shippingAddress;
                    newOrder.status = orderInfo.status;
                    newOrder.orderDate = orderInfo.orderDate;
                    newOrder.createdDate = orderInfo.createdDate;
                    newOrder.shippedDate = orderInfo.shippedDate;
                    newOrder.deliveredDate = orderInfo.deliveredDate;
                    newOrder.fulfilledDate = orderInfo.fulfilledDate;
                    newOrder.archivedDate = orderInfo.archivedDate;
                    newOrder.cancelledDate = orderInfo.cancelledDate;
                    newOrder.city = orderInfo.city;
                    newOrder.state = orderInfo.state;
                    newOrder.country = orderInfo.country;
                    newOrder.email = orderInfo.email;

                    _appDBContext.Order.Add(newOrder);
                    await _appDBContext.SaveChangesAsync();

                    return new JsonResult(new AdminItemResponse { isOkay = true, data = newOrder, message = "Order created successfully." });
                }
                catch (Exception ex)
                {
                    return new JsonResult(new AdminItemResponse { isOkay = false, message = ex.Message, data = orderInfo });
                }
            }
        }
    }
}
