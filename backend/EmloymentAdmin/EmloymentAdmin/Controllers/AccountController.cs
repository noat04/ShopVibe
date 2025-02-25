using Microsoft.AspNetCore.Mvc;

namespace EmploymentAdmin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        [HttpGet("Index")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("History")]
        public async Task<IActionResult> History()
        {
            return View();
        }
    }
}
