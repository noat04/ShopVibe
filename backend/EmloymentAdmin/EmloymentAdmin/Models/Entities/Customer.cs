    namespace EmloymentAdmin.Models.Entities
{
    public class Customer
    {
        public Guid Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public string? Sex { get; set; }
        public string? Phone { get; set; }
        public string Email { get; set; }
        public string UserId { get; set; }
    }
}
