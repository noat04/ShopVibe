using EmloymentAdmin.Models.Entities;

namespace EmploymentAdmin.Models.Entities
{
    public class OrderInfo
    {
        public Guid Id { get; set; }
        public Customer Customer { get; set; }
        public DateTime Deliverydate { get; set; }
        public string State { get; set; }
        public string Address { get; set; }
        public DateTime Orderdate { get; set; }
        public string PaymentMethod {  get; set; }
        public DateTime EstimatedDeliverydate {  get; set; }
        public decimal TotalOrder {  get; set; }
    }
}
