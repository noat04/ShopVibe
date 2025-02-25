namespace EmploymentAdmin.Models.Dtos
{
    public class CartDetailDto
    {
        //public string Id { get; set; }  // Đảm bảo kiểu dữ liệu là ObjectId
        //public string CartId { get; set; }
        public string ProductId { get; set; }
        public string Size { get; set; }
        public string Color { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
