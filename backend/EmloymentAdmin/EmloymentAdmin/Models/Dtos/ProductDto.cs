using MongoDB.Bson;

namespace EmploymentAdmin.Models.Dtos
{
    public class ProductDto
    {
        public string Id { get; set; }  // Đảm bảo kiểu dữ liệu là ObjectId
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public DateTime ManufactureDate { get; set; }
        public DateTime ImportDate { get; set; }
        public string CategoryId { get; set; }
        public string Image { get; set; }
        // Lưu Variants trong DTO để sử dụng ngoài Entity (chỉ trong API trả về hoặc xử lý tạm thời)
        public List<ProductVariantDto> Variants { get; set; } = new List<ProductVariantDto>();
    }
}
