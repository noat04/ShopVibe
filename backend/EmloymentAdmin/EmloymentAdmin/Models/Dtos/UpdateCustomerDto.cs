namespace EmloymentAdmin.Models.Dtos
{
    public class UpdateCustomerDto
    {
        public required string firstName { get; set; }
        public required string lastName { get; set; }
        public required string Address { get; set; }
        public required string Sex { get; set; }
        public string? Phone { get; set; }
        public required string Email { get; set; }
        //public string? UsedId { get; set; }
    }
}
