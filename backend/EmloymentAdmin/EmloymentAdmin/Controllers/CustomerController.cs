using EmloymentAdmin.Data;
using EmloymentAdmin.Models.Entities;
using EmloymentAdmin.Models.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EmploymentAdmin.Models.Entities;
using EmploymentAdmin.Models.Dtos;

namespace EmloymentAdmin.Controllers
{
    // localhost:xxxx/api/customers
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDBConText dBContext;

        public CustomersController(ApplicationDBConText dBConText)
        {
            dBContext = dBConText;
        }

        // Get all customers
        [HttpGet]
        public IActionResult GetAllCustomers()
        {
            return Ok(dBContext.Customers.ToList());
        }

        // Get customer by ID
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetCustomerById(Guid id)
        {
            var customer = dBContext.Customers.Find(id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }  
        [HttpGet]
        [Route("{userId}")]
        public IActionResult GetCustomersByUserId(string userId)
        {
            // Lọc khách hàng dựa trên UserId
            var customers = dBContext.Customers
                .Where(c => c.UserId == userId)
                .ToList();

            // Nếu không tìm thấy khách hàng
            if (customers.Count == 0)
            {
                return NotFound($"No customers found with UserId: {userId}");
            }

            return Ok(customers);
        }
        // Add a new customer
        //[HttpPost]
        //public IActionResult AddCustomer(AddCustomerDto addCustomerDto)
        //{
        //    var customerEntity = new Customer()
        //    {
        //        FirstName = null,
        //        LastName = null,
        //        Address = null,
        //        Sex = null,
        //        Phone = null,
        //        Email = addCustomerDto.Email,
        //        UserId = addCustomerDto.UserId
        //    };
        //    dBContext.Customers.Add(customerEntity);
        //    dBContext.SaveChanges();
        //    return Ok(customerEntity);
        //}

        // Update customer details
       

        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateCustomer(Guid id, UpdateCustomerDto updateCustomerDto)
        {
            var customer = dBContext.Customers.Find(id);
            if (customer == null)
            {
                return NotFound();
            }
            customer.FirstName = updateCustomerDto.firstName;
            customer.LastName = updateCustomerDto.lastName;
            customer.Address = updateCustomerDto.Address;
            customer.Sex = updateCustomerDto.Sex;
            customer.Phone = updateCustomerDto.Phone;
            customer.Email = updateCustomerDto.Email;
            dBContext.SaveChanges();
            return Ok(customer);
        }
            
        // Delete customer
        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteCustomer(Guid id)
        {
            var customer = dBContext.Customers.Find(id);
            if (customer == null)
            {
                return NotFound();
            }
            dBContext.Customers.Remove(customer);
            dBContext.SaveChanges();
            return Ok();
        }
    }
}
