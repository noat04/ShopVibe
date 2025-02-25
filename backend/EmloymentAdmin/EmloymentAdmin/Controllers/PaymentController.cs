using Azure.Core;
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

        public PaymentController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }
        [HttpGet]
        [Route("Callback")]
        public IActionResult PaymentCallbackVnpay()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                // Kiểm tra xem phản hồi có thành công hay không
                if (!response.Success)
                {
                    return BadRequest(new { message = "Chữ ký không hợp lệ." });
                }

                return Json(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Đã xảy ra lỗi khi xử lý yêu cầu.", error = ex.Message });
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
