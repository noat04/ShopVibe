using Microsoft.AspNetCore.Identity;

namespace EmploymentAdmin.Models.Entities
{
    public class AspUserModel : IdentityUser
    {
        public string? Token { get; set; }
        // Các thuộc tính khác tùy theo yêu cầu của ứng dụng
        public string? RefeshToken { get; set; }
        public DateTime? RefeshTokenExpirytime { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }
    }
}
