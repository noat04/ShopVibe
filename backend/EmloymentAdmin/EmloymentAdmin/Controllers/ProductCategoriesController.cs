using EmloymentAdmin.Data;
using EmloymentAdmin.Models.Entities;
using EmploymentAdmin.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EmploymentAdmin.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    public class ProductCategoriesController : ControllerBase
    {
        private readonly IMongoCollection<ProductCategories> _productCategories;

        public ProductCategoriesController(MongoDBService mongoDBService)
        {
            _productCategories = mongoDBService.Database?.GetCollection<ProductCategories>("ProductCategories");
        }   

        // Lấy tất cả loại sản phẩm
        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<ProductCategories>> GetAllProductCategories()
        {
            return await _productCategories.Find(FilterDefinition<ProductCategories>.Empty).ToListAsync();
        }


    }
}
