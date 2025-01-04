using EmloymentAdmin.Data;
using EmloymentAdmin.Models.Entities;
using EmloymentAdmin.Models.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmloymentAdmin.Controllers
{
    // localhost:xxxx/api/employees
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDBConText dBContext;

        public EmployeesController(ApplicationDBConText dBConText)
        {
            this.dBContext = dBConText;
        }

        [HttpGet]
        public IActionResult GetAllEmployees()
        {
            return Ok(dBContext.Employee.ToList());
        }

        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetEmployeesId(Guid id)
        {
            var employee = dBContext.Employee.Find(id);
            if (employee == null)
            {
                return NotFound();
            }
            return Ok(employee);
        }

        [HttpPost]
        public IActionResult AddEmployees(AddEmployeeDto addEmployeeDto)
        {
            var employeeEntity = new Employment()
            {
                Name = addEmployeeDto.Name,
                Email = addEmployeeDto.Email,
                Phone = addEmployeeDto.Phone,
                Salary = addEmployeeDto.Salary
            };
            dBContext.Employee.Add(employeeEntity);
            dBContext.SaveChanges();
            return Ok(employeeEntity);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateEmployee(Guid id, UpdateEmployeeDto updateEmployeeDto)
        {
            var employee = dBContext.Employee.Find(id);
            if (employee == null)
            {
                return NotFound();
            }
            employee.Name = updateEmployeeDto.Name;
            employee.Email = updateEmployeeDto.Email;
            employee.Phone = updateEmployeeDto.Phone;
            employee.Salary = updateEmployeeDto.Salary;

            dBContext.SaveChanges();
            return Ok(employee);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteEmployee(Guid id)
        {
            var employee = dBContext.Employee.Find(id);
            if (employee == null)
            {
                return NotFound();
            }
            dBContext.Employee.Remove(employee);
            dBContext.SaveChanges();
            return Ok();
        }
    }
}
