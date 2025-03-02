using Azure.Core;
using EmloymentAdmin.Data;
using EmploymentAdmin.Models.VNPay;
using EmploymentAdmin.Service.VNPay;
using Microsoft.AspNetCore.Mvc;

namespace EmploymentAdmin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : Controller
    {
        private readonly IVnPayService _vnPayService;
        private readonly ApplicationDBConText _dBContext;
        public PaymentController(IVnPayService vnPayService, ApplicationDBConText dBConText)
        {
            _vnPayService = vnPayService;
            _dBContext = dBConText;
        }
        [HttpGet]
        [Route("Callback")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                // Kiểm tra xem phản hồi có thành công hay không
                if (!response.Success)
                {
                    return BadRequest(new { message = "Chữ ký không hợp lệ." });
                }

                var newVNPayModel = new VNPayModel
                {
                    OrderId = response.OrderId,
                    PaymentMethod = response.PaymentMethod,
                    PaymentId = response.PaymentId,
                    OrderDescription = response.OrderDescription,
                    TransactionId = response.TransactionId,
                    DateCreated = DateTime.Now
                };
                _dBContext.Add(newVNPayModel);
                await _dBContext.SaveChangesAsync();
                // Điều hướng về trang Home kèm thông báo
                return Redirect(
                    $"http://localhost:3000/cart?message={Uri.EscapeDataString("Thanh toán thành công.")}" +
                    $"&paymentMethod={Uri.EscapeDataString(response.PaymentMethod)}" +
                    $"&paymentId={Uri.EscapeDataString(response.PaymentId)}"
                );

                //return Json(response);
            }
            catch (Exception ex)
            {
       
                // Điều hướng về trang lỗi hoặc Home với thông báo lỗi
                return Redirect(
                    $"http://localhost:3000/cart?message={Uri.EscapeDataString($"Đã xảy ra lỗi: {ex.Message}")}" +
                    $"&paymentMethod={Uri.EscapeDataString("N/A")}" +
                    $"&paymentId={Uri.EscapeDataString("N/A")}"
                );

            }
        }


        [HttpPost]
        [Route("CreatePayment")]
        public IActionResult CreatePayment([FromBody] PaymentInformationModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage));
                return BadRequest(new { message = "Dữ liệu không hợp lệ.", errors });
            }

            var paymentUrl = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new { paymentUrl });
        }

    }
}
