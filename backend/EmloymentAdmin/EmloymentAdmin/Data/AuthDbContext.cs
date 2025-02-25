using EmloymentAdmin.Models.Entities;
using EmploymentAdmin.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EmploymentAdmin.Data
{
    public class AuthDbContext : IdentityDbContext<AspUserModel> // Kế thừa IdentityDbContext để hỗ trợ Identity
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options)
            : base(options)
        {
        }

        public DbSet<Employment> Employee { get; set; }
        public DbSet<Customer> Customers { get; set; }
    }


}   
