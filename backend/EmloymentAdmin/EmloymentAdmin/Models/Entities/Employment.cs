namespace EmloymentAdmin.Models.Entities
{
    public class Employment
    {
        public Guid Id { get; set; }
        public [Required][StringLength(50)] string Name { get; set; }
        public [Required][StringLength(50)] string Email {  get; set; }   
        public [Required][StringLength(10)] Phone { get; set; }
        public [Range(1, 100)] decimal Salary {  get; set; }

    }
}
