using EmloymentAdmin.Data;
using EmploymentAdmin.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace EmploymentAdmin.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CartDetailController : ControllerBase
    {
        private readonly IMongoCollection<CartDetails> _cartDetails;
        public CartDetailController(MongoDBService mongoDBService)
        {
            _cartDetails = mongoDBService.Database?.GetCollection<CartDetails>("CartDetails");
        }
        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<CartDetails>> GetCartDetails()
        {
            return await _cartDetails.Find(FilterDefinition<CartDetails>.Empty).ToListAsync();
        }
    }
}
