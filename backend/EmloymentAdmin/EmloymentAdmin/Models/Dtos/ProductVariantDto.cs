namespace EmploymentAdmin.Models.Dtos
{
    public class ProductVariantDto
    {
        public string Id { get; set; }  // Đảm bảo kiểu dữ liệu là ObjectId
        public string ProductId { get; set; }
        public string Size { get; set; }
        public string Color{ get; set; }
        public decimal Quantity { get; set; }  // Price should be a decimal, not an ObjectId
        public string Image { get; set; }
      
    }
}
