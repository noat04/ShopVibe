using EmloymentAdmin.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EmloymentAdmin.Data
{
    public class ApplicationDBConText : DbContext
    {
        public ApplicationDBConText(DbContextOptions<ApplicationDBConText> options) : base(options)
        {

        }

        public DbSet<Employment> Employee { get; set; }
        public DbSet<Customer> Customers { get; set; }

    }
}
