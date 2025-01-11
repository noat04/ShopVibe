using AutoMapper;
using EmloymentAdmin.Data;
using EmloymentAdmin.Models.Entities;
using EmploymentAdmin.Models.Dtos;
using EmploymentAdmin.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

[Route("api/[controller]/[action]")]
[ApiController]
public class ProductsController : ControllerBase
{

    private readonly IMongoCollection<Products> _products;
    private readonly IMongoCollection<ProductVariants> _productVariants;
    private readonly IMapper _mapper;  // AutoMapper

    public ProductsController(MongoDBService mongoDBService, IMapper mapper)
    {
        _products = mongoDBService.Database?.GetCollection<Products>("Products");
        _productVariants = mongoDBService.Database?.GetCollection<ProductVariants>("ProductVariants");
        _mapper = mapper;
    }

    // Lấy tất cả sản phẩm
    [HttpGet]
    [Route("")]
    //[Authorize] // Yêu cầu xác thực bằng JWT
    public async Task<IEnumerable<ProductDto>> GetAllProducts()
    {
        var products = await _products.Find(FilterDefinition<Products>.Empty).ToListAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    //Lấy sản phẩm và phân trang
    [HttpGet]
    [Route("paged")]
    public async Task<IActionResult> GetPagedProducts(int page = 1, int pageSize = 8)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest("Page and PageSize must be greater than zero.");
        }

        // Truy vấn MongoDB với phân trang
        var products = await _products
            .Find(FilterDefinition<Products>.Empty)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        // Đếm tổng số sản phẩm
        var totalCount = await _products.CountDocumentsAsync(FilterDefinition<Products>.Empty);

        // Ánh xạ sang ProductDto
        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);

        // Trả về kết quả phân trang dưới dạng JSON
        return Ok(new
        {
            TotalCount = totalCount,
            CurrentPage = page,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
            Items = productDtos
        });
    }



    // Lấy sản phẩm theo loại sản phẩm
    //[HttpGet]
    //[Route("by-category/{category}")]
    //public async Task<IEnumerable<ProductDto>> GetAllProductsByCategories(string category)
    //{
    //    var filter = Builders<Products>.Filter.Eq(x => x.CategoryId, category);
    //    var products = await _products.Find(filter).ToListAsync();
    //    return _mapper.Map<IEnumerable<ProductDto>>(products);
    //}
    [HttpGet]
    [Route("by-category/{category}")]
    public async Task<IActionResult> GetAllProductsByCategories(string category, int page = 1, int pageSize = 8)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest("Page and PageSize must be greater than zero.");
        }

        // Tạo bộ lọc theo CategoryId
        var filter = Builders<Products>.Filter.Eq(x => x.CategoryId, category);

        // Lấy tổng số sản phẩm thuộc category
        var totalCount = await _products.CountDocumentsAsync(filter);

        // Lấy sản phẩm với phân trang
        var products = await _products.Find(filter)
                                       .Skip((page - 1) * pageSize) // Bỏ qua các mục trước đó
                                       .Limit(pageSize)             // Giới hạn số mục hiện tại
                                       .ToListAsync();

        // Map dữ liệu sang ProductDto
        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);

        // Trả về kết quả phân trang
        var result = new
        {
            TotalCount = totalCount,
            CurrentPage = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
            Items = productDtos
        };

        return Ok(result);
    }


    // Lấy sản phẩm theo id
    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<ProductDto>> GetById(string id)
    {
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

        var productDto = _mapper.Map<ProductDto>(product);
        return Ok(productDto);
    }

    // Lấy sản phẩm cùng với biến thể theo productId
    [HttpGet]
    [Route("variants/{id}")]
    public async Task<ActionResult<ProductDto>> GetByProductId(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest("Product ID không hợp lệ.");
        }

        var filter = Builders<Products>.Filter.Eq(x => x.ProductId, id);
        var product = await _products.Find(filter).FirstOrDefaultAsync();

        if (product == null)
        {
            return NotFound();
        }

        var variantsFilter = Builders<ProductVariants>.Filter.Eq(x => x.ProductId, id);
        var variants = await _productVariants.Find(variantsFilter).ToListAsync();

        var productDto = _mapper.Map<ProductDto>(product);
        productDto.Variants = _mapper.Map<List<ProductVariantDto>>(variants);

        return Ok(productDto);
    }

    //// Lấy sản phẩm theo thứ tự giảm dần
    //[HttpGet]
    //[Route("desc")]
    //public async Task<IEnumerable<ProductDto>> GetAllProductsDesc()
    //{
    //    var products = await _products.Find(FilterDefinition<Products>.Empty).SortByDescending(x => x.Price).ToListAsync();
    //    return _mapper.Map<IEnumerable<ProductDto>>(products);
    //}

    //// Lấy sản phẩm theo thứ tự tăng dần
    //[HttpGet]
    //[Route("asc")]
    //public async Task<IEnumerable<ProductDto>> GetAllProductsAsc()
    //{
    //    var products = await _products.Find(FilterDefinition<Products>.Empty).SortBy(x => x.Price).ToListAsync();
    //    return _mapper.Map<IEnumerable<ProductDto>>(products);
    //}

    // Lấy sản phẩm theo thứ tự giảm dần
    [HttpGet]
    [Route("desc")]
    public async Task<IActionResult> GetAllProductsDesc(int page = 1, int pageSize = 8)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest("Page and PageSize must be greater than zero.");
        }

        // Đếm tổng số sản phẩm
        var totalCount = await _products.CountDocumentsAsync(FilterDefinition<Products>.Empty);

        // Lấy sản phẩm theo thứ tự giảm dần với phân trang
        var products = await _products.Find(FilterDefinition<Products>.Empty)
                                       .SortByDescending(x => x.Price)
                                       .Skip((page - 1) * pageSize)
                                       .Limit(pageSize)
                                       .ToListAsync();

        // Map sang DTO
        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);

        // Trả về kết quả phân trang
        var result = new
        {
            TotalCount = totalCount,
            CurrentPage = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
            Items = productDtos
        };

        return Ok(result);
    }

    // Lấy sản phẩm theo thứ tự tăng dần
    [HttpGet]
    [Route("asc")]
    public async Task<IActionResult> GetAllProductsAsc(int page = 1, int pageSize = 8)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest("Page and PageSize must be greater than zero.");
        }

        // Đếm tổng số sản phẩm
        var totalCount = await _products.CountDocumentsAsync(FilterDefinition<Products>.Empty);

        // Lấy sản phẩm theo thứ tự tăng dần với phân trang
        var products = await _products.Find(FilterDefinition<Products>.Empty)
                                       .SortBy(x => x.Price)
                                       .Skip((page - 1) * pageSize)
                                       .Limit(pageSize)
                                       .ToListAsync();

        // Map sang DTO
        var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);

        // Trả về kết quả phân trang
        var result = new
        {
            TotalCount = totalCount,
            CurrentPage = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
            Items = productDtos
        };

        return Ok(result);
    }

    // Lấy sản phẩm theo thứ tự giảm dần theo categories

    [HttpGet]
    [Route("desc/{categories}")]
    public async Task<IEnumerable<ProductDto>> GetAllProductsDescByCategories(string categories)
    {
        var filter = Builders<Products>.Filter.Eq(x => x.CategoryId, categories);
        var products = await _products.Find(filter).SortByDescending(x => x.Price).ToListAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    // Lấy sản phẩm theo thứ tự tăng dầntheo categories
   
    [HttpGet]
    [Route("asc/{categories}")]
    public async Task<IEnumerable<ProductDto>> GetAllProductsAscByCategories(string categories)
    {
        var filter = Builders<Products>.Filter.Eq(x => x.CategoryId, categories);
        var products = await _products.Find(FilterDefinition<Products>.Empty).SortBy(x => x.Price).ToListAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
    // Thêm sản phẩm mới
    [HttpPost]
    [Route("")]
    public async Task<ActionResult> AddProduct(ProductDto productDto)
    {
        var product = _mapper.Map<Products>(productDto);
        await _products.InsertOneAsync(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id.ToString() }, product);
    }

    // Cập nhật sản phẩm
    [HttpPut]
    [Route("")]
    public async Task<ActionResult> UpdateProduct(ProductDto productDto)
    {
        var product = _mapper.Map<Products>(productDto);
        var filter = Builders<Products>.Filter.Eq(x => x.Id, product.Id);
        await _products.ReplaceOneAsync(filter, product);
        return Ok();
    }

    // Xóa sản phẩm theo id
    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> DeleteProduct(string id)
    {
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
