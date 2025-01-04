using EmploymentAdmin.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EmploymentAdmin.Data
{
    public class AuthDbContext : IdentityDbContext<IdentityUser> // Kế thừa IdentityDbContext để hỗ trợ Identity
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options)
            : base(options)
        {
        }

        // Nếu bạn muốn sử dụng một bảng tùy chỉnh cho người dùng thì có thể thêm ở đây.
        // public DbSet<Customers> Customers { get; set; }
    }


}
