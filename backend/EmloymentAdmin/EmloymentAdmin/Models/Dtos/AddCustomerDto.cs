namespace EmloymentAdmin.Models.Dtos
{
    public class AddCustomerDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Address { get; set; }
        public string? Sex { get; set; }
        public string? Phone { get; set; }
        public required string Email {  get; set; }
        public string UserId { get; set; }
    }
}
