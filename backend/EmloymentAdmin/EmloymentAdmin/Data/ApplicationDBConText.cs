using EmloymentAdmin.Models.Entities;
using EmploymentAdmin.Models.VNPay;
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
        public DbSet<VNPayModel> VnpInfos { get; set; }
        public DbSet<OrderModel> Oders { get; set; }
        public DbSet<OrderDeTail> OrderDeTails { get; set; }
    }
}
