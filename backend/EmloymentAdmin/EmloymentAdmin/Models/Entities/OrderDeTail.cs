namespace EmloymentAdmin.Models.Entities
{
    public class OrderDeTail
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string OrderCode { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }

    }
}
