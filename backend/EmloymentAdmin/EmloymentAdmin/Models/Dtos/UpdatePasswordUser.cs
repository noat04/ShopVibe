namespace EmploymentAdmin.Models.Dtos
{
    public class UpdatePasswordModel
    {
        public required string Email { get; set; }
        public required string Token { get; set; }
        public required string NewPassword { get; set; }
    }
}
