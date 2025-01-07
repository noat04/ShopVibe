namespace EmploymentAdmin.Models.Dtos
{
    public class CartDto
    {
        public string Id { get; set; }  // Đảm bảo kiểu dữ liệu là ObjectId
        public string cartId { get; set; }
        public string customerId { get; set; }
        public List<CartDetailDto> CartDetails { get; set; }
    }
}
