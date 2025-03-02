using EmloymentAdmin.Data;
using EmloymentAdmin.Models.Entities;
using EmploymentAdmin.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmploymentAdmin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : Controller
    {
        private readonly ApplicationDBConText _dBContext;
        public OrderController(ApplicationDBConText dBConText)
        {
            _dBContext = dBConText;
        }
        [HttpPost("CheckOut")]
        public async Task<IActionResult> CheckOut([FromBody] OrderRequest request)
        {
            var userEmail = request.UserName;
            if (userEmail == null)
            {
                return BadRequest(new { message = "Vui lòng đăng nhập trước khi thực hiện đặt hàng." });
            }
            if (string.IsNullOrEmpty(request.PaymentMethod) || string.IsNullOrEmpty(request.PaymentId))
            {
                return BadRequest(new { message = "Thông tin thanh toán không đầy đủ." });
            }
            Console.WriteLine($"PaymentMethod: {request.PaymentMethod}");
            Console.WriteLine($"PaymentId: {request.PaymentId}");
            var orderCode = Guid.NewGuid().ToString();
            var orderItem = new OrderModel
            {
                OrderCode = orderCode,
                UserName = userEmail,
                PaymentMethod = request.PaymentMethod + request.PaymentId,
                CreatedDate = DateTime.Now,
                Status = 1
            };
            _dBContext.Add(orderItem);
            await _dBContext.SaveChangesAsync();
            return Ok(new { message = "Đặt hàng thành công." });
        }
        //[HttpPost]
        //[Route()]
        //public async Task<IActionResult> 

    }
}
