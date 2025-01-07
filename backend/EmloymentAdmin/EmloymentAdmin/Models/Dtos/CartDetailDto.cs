namespace EmploymentAdmin.Models.Dtos
{
    public class CartDetailDto
    {
        public string Id { get; set; }  // Đảm bảo kiểu dữ liệu là ObjectId
        public string CartId { get; set; }
        public string ProductId { get; set; }
        public decimal Price { get; set; }
        public decimal Quality { get; set; }
    }
}
