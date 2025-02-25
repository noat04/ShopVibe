using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace EmploymentAdmin.Models.VNPay
{
    public class PaymentInformationModel
    {
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9\s]*$", ErrorMessage = "OrderType chỉ được phép chứa chữ cái, số và khoảng trắng.")]
        public string OrderType { get; set; }

        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Amount phải là một số dương và lớn hơn 0.")]
        public double Amount { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-Z0-9\s]*$", ErrorMessage = "OrderDescription không được chứa dấu và ký tự đặc biệt.")]
        public string OrderDescription { get; set; }

        [Required]
        [RegularExpression(@"^[a-zA-Z0-9\s]*$", ErrorMessage = "Name không được chứa dấu và ký tự đặc biệt.")]
        public string Name { get; set; }
    }
}
