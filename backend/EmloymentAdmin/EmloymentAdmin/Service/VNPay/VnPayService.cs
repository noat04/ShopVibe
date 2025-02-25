using EmploymentAdmin.Libraries;
using EmploymentAdmin.Models.VNPay;
using System.Text.RegularExpressions;

namespace EmploymentAdmin.Service.VNPay
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;

        public VnPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var pay = new VnPayLibrary();
            var urlCallBack = _configuration["Vnpay:PaymentBackReturnUrl"];
            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
            pay.AddRequestData("vnp_Amount", (model.Amount * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);
            pay.AddRequestData("vnp_OrderInfo", $"{model.Name} {model.OrderDescription} {model.Amount}");
            pay.AddRequestData("vnp_OrderType", model.OrderType);
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            pay.AddRequestData("vnp_TxnRef", tick);

            var paymentUrl =
                pay.CreateRequestUrl(_configuration["Vnpay:BaseUrl"], _configuration["Vnpay:HashSecret"]);

            return paymentUrl;
        }
        //public string CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
        //{
        //    // Lấy thông tin múi giờ từ cấu hình (SE Asia Standard Time)
        //    var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);

        //    // Lấy thời gian hiện tại và chuyển đổi từ UTC sang múi giờ của bạn (SE Asia Standard Time)
        //    var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);

        //    // Tạo mã tham chiếu giao dịch sử dụng thời gian hiện tại (Để đảm bảo độc nhất)
        //    var tick = DateTime.UtcNow.ToString("yyyyMMddHHmmssfff"); // sử dụng thời gian UTC để đảm bảo tính duy nhất

        //    var pay = new VnPayLibrary();
        //    var urlCallBack = _configuration["Vnpay:PaymentBackReturnUrl"];

        //    // Thêm các dữ liệu yêu cầu cho URL thanh toán
        //    pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
        //    pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
        //    pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
        //    pay.AddRequestData("vnp_Amount", ((int)model.Amount * 100).ToString()); // Số tiền tính bằng đồng (VND)
        //    pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss")); // Thời gian tạo giao dịch
        //    pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
        //    pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context)); // Địa chỉ IP của khách hàng
        //    pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);
        //    pay.AddRequestData("vnp_OrderInfo", $"{model.Name} {model.OrderDescription} {model.Amount}");
        //    pay.AddRequestData("vnp_OrderType", model.OrderType);
        //    pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
        //    pay.AddRequestData("vnp_TxnRef", tick); // Mã tham chiếu giao dịch

        //    // Tạo URL thanh toán và trả về
        //    var paymentUrl = pay.CreateRequestUrl(_configuration["Vnpay:BaseUrl"], _configuration["Vnpay:HashSecret"]);

        //    return paymentUrl;
        //}

        //public PaymentResponseModel PaymentExecute(IQueryCollection collections)
        //{
        //    var pay = new VnPayLibrary();
        //    //var response = pay.GetFullResponseData(collections, _configuration["Vnpay:HashSecret"]);
        //    foreach (var (key,value) in collections)
        //    {
        //        if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
        //        {
        //            pay.AddResponseData(key, value.ToString());
        //        }
        //    }

        //    var vnp_orderId =Convert.ToInt64(pay.GetResponseData("vnp_TxnRef"));
        //    var vnp_TransactionId = Convert.ToInt64(pay.GetResponseData("vnp_TransactionNo"));
        //    var vnp_SecureHash = collections.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
        //    var vnp_OderInfo = pay.GetResponseData("vnp_OrderInfo");
        //    var vnp_ResponseCode = pay.GetResponseData("vnp_ResponseCode");
        //    bool checkSignature = pay.ValidateSignature(vnp_SecureHash, _configuration["Vnpay:HashSecret"]);
        //    if(!checkSignature)
        //    {
        //        return new PaymentResponseModel
        //        {
        //            Success = false
        //        };
        //    }
        //    return new PaymentResponseModel {
        //        Success = true,
        //        OrderId = vnp_orderId.ToString(),
        //        TransactionId = vnp_TransactionId.ToString(),
        //        OrderDescription = vnp_OderInfo,
        //        VnPayResponseCode = vnp_ResponseCode,
        //        Token = vnp_SecureHash,
        //        PaymentMethod = "VNPay"
        //    };
        //}

        public PaymentResponseModel PaymentExecute(IQueryCollection collections)
        {
            var pay = new VnPayLibrary();
            var response = pay.GetFullResponseData(collections, _configuration["Vnpay:HashSecret"]);

            return response;
        }

    }
}
