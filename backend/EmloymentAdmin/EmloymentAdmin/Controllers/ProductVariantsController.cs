using EmloymentAdmin.Data;
using EmploymentAdmin.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace EmploymentAdmin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantsController : ControllerBase
    {
        private readonly IMongoCollection<ProductVariants> _productVariants;

        public ProductVariantsController(MongoDBService mongoDBService)
        {
            _productVariants = mongoDBService.Database?.GetCollection<ProductVariants>("ProductVariants");
        }

        // Lấy tất cả biến thể của sản phẩm
        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<ProductVariants>> GetAllProductVariants()
        {
            return await _productVariants.Find(FilterDefinition<ProductVariants>.Empty).ToListAsync();
        }

        // Lấy biến thể của sản phẩm theo productId
        [HttpGet]
        [Route("{productId}")]
        public async Task<IEnumerable<ProductVariants>> GetProductVariantsByProductId(string productId)
        {
            var filter = Builders<ProductVariants>.Filter.Eq("productId", productId);
            return await _productVariants.Find(filter).ToListAsync();
        }

    }
}
