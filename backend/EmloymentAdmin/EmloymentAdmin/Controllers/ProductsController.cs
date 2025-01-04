using EmloymentAdmin.Data;
using EmloymentAdmin.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EmloymentAdmin.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IMongoCollection<Products> _products;

        public ProductsController(MongoDBService mongoDBService)
        {
            _products = mongoDBService.Database?.GetCollection<Products>("Products");
        }

        // Lấy tất cả sản phẩm
        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<Products>> GetAllProducts()
        {
            return await _products.Find(FilterDefinition<Products>.Empty).ToListAsync();
        }

        // Lấy sản phẩm theo id
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<Products?>> GetById(string id)
        {
            // Kiểm tra id có hợp lệ (ObjectId)
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return BadRequest("Định dạng ObjectId không hợp lệ.");
            }

            var filter = Builders<Products>.Filter.Eq(x => x.Id, objectId);
            var product = await _products.Find(filter).FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
        // Lấy sản phẩm theo productId
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<Products?>> GetByProductId(string id)
        {
            // Kiểm tra nếu productId có hợp lệ (nếu cần)
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Product ID không hợp lệ.");
            }

            var filter = Builders<Products>.Filter.Eq(x => x.ProductId, id);  // Lọc theo productId
            var product = await _products.Find(filter).FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }


        // Thêm sản phẩm mới
        [HttpPost]
        [Route("")]
        public async Task<ActionResult> AddProduct(Products product)
        {
            await _products.InsertOneAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id.ToString() }, product);
        }

        // Cập nhật sản phẩm
        [HttpPut]
        [Route("")]
        public async Task<ActionResult> UpdateProduct(Products product)
        {
            var filter = Builders<Products>.Filter.Eq(x => x.Id, product.Id);
            await _products.ReplaceOneAsync(filter, product);
            return Ok();
        }

        // Xóa sản phẩm theo id
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> DeleteProduct(string id)
        {
            // Kiểm tra id có hợp lệ (ObjectId)
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return BadRequest("Định dạng ObjectId không hợp lệ.");
            }

            var filter = Builders<Products>.Filter.Eq(x => x.Id, objectId);
            var result = await _products.DeleteOneAsync(filter);

            if (result.DeletedCount == 0)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
