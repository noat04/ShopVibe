using AutoMapper;
using EmloymentAdmin.Data;
using EmloymentAdmin.Models.Entities;
using EmploymentAdmin.Models.Dtos;
using EmploymentAdmin.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Claims;
using System.Text.Json;

namespace EmploymentAdmin.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly IMongoCollection<Cart> _cart;
        private readonly IMongoCollection<CartDetails> _cartDetails;
        private readonly IMapper _mapper;  // AutoMapper

        public CartController(MongoDBService mongoDBService, IMapper mapper)
        {
            _cart = mongoDBService.Database?.GetCollection<Cart>("Cart");
            _cartDetails = mongoDBService.Database?.GetCollection<CartDetails>("CartDetails");
            _mapper = mapper;
        }


        // Lấy giỏ hàng có chi tiết giỏ hàng
        [HttpGet]
        //[Route("")]
        public async Task<IEnumerable<Cart_CustomerDto>> GetAllCart()
        {
            var cart = await _cart.Find(FilterDefinition<Cart>.Empty).ToListAsync();
            return _mapper.Map<IEnumerable<Cart_CustomerDto>>(cart);
        }

        // Lấy giỏ hàng có chi tiết giỏ hàng của khách hàng
        [HttpGet]
        [Route("{customerId}")]
        public async Task<ActionResult<Cart_CustomerDto>> GetCartDetails(string customerId)
        {
            if (string.IsNullOrWhiteSpace(customerId))
            {
                return BadRequest("Customer ID không hợp lệ.");
            }

            // Tìm giỏ hàng dựa trên customerId
            var cartFilter = Builders<Cart>.Filter.Eq(x => x.customerId, customerId);
            var cart = await _cart.Find(cartFilter).FirstOrDefaultAsync();

            if (cart == null)
            {
                return NotFound("Giỏ hàng không tồn tại.");
            }

            // Tìm chi tiết giỏ hàng dựa trên cartId
            var cartDetailsFilter = Builders<CartDetails>.Filter.Eq(x => x.CartId, cart.cartId);
            var cartDetails = await _cartDetails.Find(cartDetailsFilter).ToListAsync();

            if (cartDetails == null || cartDetails.Count == 0)
            {
                return Ok(new
                {
                    Message = "Giỏ hàng chưa có sản phẩm nào.",
                    Cart = new Cart_CustomerDto
                    {
                        Id = cart.Id.ToString(),
                        cartId = cart.cartId,
                        customerId = cart.customerId,
                        CartDetails = new List<CartDetailDto>() // Danh sách trống
                    }
                });
            }


            // Ánh xạ từ CartDetails sang CartDetailDto
            var cartDetailDtos = _mapper.Map<List<CartDetailDto>>(cartDetails);


            return Ok(new
            {
                Message ="Có tồn tại sản phẩm",
                Cart = new Cart_CustomerDto
                {
                    Id = cart.Id.ToString(),
                    cartId = cart.cartId,
                    customerId = cart.customerId,
                    CartDetails = cartDetailDtos
                }
            });
        }
        [HttpPost]
        [Route("{customer}")]
        public async Task<IActionResult> CreateCart(string customer)
        {
            if (string.IsNullOrWhiteSpace(customer))
            {
                return BadRequest("Customer ID không hợp lệ.");
            }
            var cartFilter = Builders<Cart>.Filter.Eq(x => x.customerId, customer);
            if(await _cart.Find(cartFilter).AnyAsync())
            {
                return BadRequest("Giỏ hàng đã tồn tại.");
            }
            // Tạo giỏ hàng mới
            var cart = new Cart
            {
                Id = ObjectId.GenerateNewId(),
                cartId = Guid.NewGuid().ToString(),
                customerId = customer
            };
            // Lưu giỏ hàng vào MongoDB
            await _cart.InsertOneAsync(cart);
            return Ok(new { Message = "Tạo giỏ hàng thành công.", Cart = cart });
        }
        //[HttpPost]
        //[Route("{cartId}")]
        //public async Task<IActionResult> AddCartDetails(string cartId, [FromBody] List<CartDetailDto> cartDetailsDto)
        //{
        //    //Console.WriteLine($"Received cartId: {cartId}");
        //    //Console.WriteLine($"Received cartDetailsDto: {System.Text.Json.JsonSerializer.Serialize(cartDetailsDto)}");

        //    if (string.IsNullOrWhiteSpace(cartId))
        //    {
        //        Console.WriteLine("Cart ID không hợp lệ.");
        //        return BadRequest("Cart ID không hợp lệ.");
        //    }

        //    if (cartDetailsDto == null || !cartDetailsDto.Any())
        //    {
        //        Console.WriteLine("Danh sách sản phẩm trống hoặc không hợp lệ.");
        //        return BadRequest("Danh sách sản phẩm không hợp lệ.");
        //    }

        //    var cartFilter = Builders<Cart>.Filter.Eq(x => x.cartId, cartId);
        //    var cart = await _cart.Find(cartFilter).FirstOrDefaultAsync();

        //    if (cart == null)
        //    {
        //        Console.WriteLine($"Giỏ hàng với cartId {cartId} không tồn tại.");
        //        return NotFound("Giỏ hàng không tồn tại.");
        //    }

        //    // Chuyển đổi CartDetailDto thành CartDetails
        //    var cartDetails = cartDetailsDto.Select(cartDetailsDto => new CartDetails
        //    {
        //        Id = ObjectId.GenerateNewId(), // Tạo ID mới cho mỗi sản phẩm
        //        CartId = cartId,
        //        ProductId = cartDetailsDto.ProductId,
        //        Quantity = cartDetailsDto.Quantity,
        //        Price = cartDetailsDto.Price,
        //        Color = cartDetailsDto.Color,
        //        Size = cartDetailsDto.Size
        //    }).ToList();
        //    Console.WriteLine($"Adding {cartDetails.Count} items to cart...");

        //    try
        //    {
        //        await _cartDetails.InsertManyAsync(cartDetails);
        //        Console.WriteLine($"Added {cartDetails.Count} products to cart with cartId: {cartId}");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error while inserting cart details: {ex.Message}");
        //        return StatusCode(500, "Đã xảy ra lỗi khi thêm chi tiết giỏ hàng.");
        //    }

        //    return Ok(new { Message = "Thêm chi tiết giỏ hàng thành công.", CartDetails = cartDetails });
        //}
        [HttpPost]
        [Route("{cartId}")]
        public async Task<IActionResult> AddCartDetails(string cartId, [FromBody] List<CartDetailDto> cartDetailsDto)
        {
            if (string.IsNullOrWhiteSpace(cartId))
            {
                Console.WriteLine("Cart ID không hợp lệ.");
                return BadRequest("Cart ID không hợp lệ.");
            }

            if (cartDetailsDto == null || !cartDetailsDto.Any())
            {
                Console.WriteLine("Danh sách sản phẩm trống hoặc không hợp lệ.");
                return BadRequest("Danh sách sản phẩm không hợp lệ.");
            }

            var cartFilter = Builders<Cart>.Filter.Eq(x => x.cartId, cartId);
            var cart = await _cart.Find(cartFilter).FirstOrDefaultAsync();

            if (cart == null)
            {
                Console.WriteLine($"Giỏ hàng với cartId {cartId} không tồn tại.");
                return NotFound("Giỏ hàng không tồn tại.");
            }

            try
            {
                foreach (var detailDto in cartDetailsDto)
                {
                    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng
                    var existingDetailFilter = Builders<CartDetails>.Filter.And(
                        Builders<CartDetails>.Filter.Eq(x => x.CartId, cartId),
                        Builders<CartDetails>.Filter.Eq(x => x.ProductId, detailDto.ProductId),
                        Builders<CartDetails>.Filter.Eq(x => x.Color, detailDto.Color),
                        Builders<CartDetails>.Filter.Eq(x => x.Size, detailDto.Size)
                    );

                    var existingDetail = await _cartDetails.Find(existingDetailFilter).FirstOrDefaultAsync();

                    if (existingDetail != null)
                    {
                        // Nếu tồn tại, cập nhật số lượng
                        var update = Builders<CartDetails>.Update.Inc(x => x.Quantity, detailDto.Quantity);
                        await _cartDetails.UpdateOneAsync(existingDetailFilter, update);
                        Console.WriteLine($"Updated quantity for ProductId: {detailDto.ProductId}, New Quantity: {existingDetail.Quantity + detailDto.Quantity}");
                    }
                    else
                    {
                        // Nếu chưa tồn tại, thêm mới
                        var newCartDetail = new CartDetails
                        {
                            Id = ObjectId.GenerateNewId(),
                            CartId = cartId,
                            ProductId = detailDto.ProductId,
                            Quantity = detailDto.Quantity,
                            Price = detailDto.Price,
                            Color = detailDto.Color,
                            Size = detailDto.Size
                        };
                        await _cartDetails.InsertOneAsync(newCartDetail);
                        Console.WriteLine($"Added new product to cart: {detailDto.ProductId}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error while processing cart details: {ex.Message}");
                return StatusCode(500, "Đã xảy ra lỗi khi thêm chi tiết giỏ hàng.");
            }

            return Ok(new { Message = "Thêm chi tiết giỏ hàng thành công." });
        }

        [HttpPost]
        [Route("{cartId}")]
        public async Task<ActionResult<CartDetailDto>> DeleteCart(string cartId, [FromBody] List<CartDetailDto> cartDetailsDto)
        {
            var cartFilter = Builders<Cart>.Filter.Eq(x => x.cartId, cartId);
            var cart = await _cart.Find(cartFilter).FirstOrDefaultAsync();
            // Chuyển đổi CartDetailDto thành CartDetails
            var cartDetails = cartDetailsDto.Select(cartDetailsDto => new CartDetails
            {
                Id = ObjectId.GenerateNewId(), // Tạo ID mới cho mỗi sản phẩm
                CartId = cartId,
                ProductId = cartDetailsDto.ProductId,
                Quantity = cartDetailsDto.Quantity,
                Price = cartDetailsDto.Price,
                Color = cartDetailsDto.Color,
                Size = cartDetailsDto.Size
            }).ToList();

            // Xóa các sản phẩm trong cartDetailsDto
            try
            {
                var deleteFilters = Builders<CartDetails>.Filter.And(
                    Builders<CartDetails>.Filter.Eq(x => x.CartId, cartId),
                    Builders<CartDetails>.Filter.In(x => x.ProductId, cartDetailsDto.Select(dto => dto.ProductId))
                );

                var deleteResult = await _cartDetails.DeleteManyAsync(deleteFilters);

                if (deleteResult.DeletedCount == 0)
                {
                    Console.WriteLine($"Không có sản phẩm nào được xóa từ giỏ hàng với cartId: {cartId}.");
                    return NotFound("Không tìm thấy sản phẩm nào để xóa.");
                }

                Console.WriteLine($"Đã xóa {deleteResult.DeletedCount} sản phẩm khỏi giỏ hàng với cartId: {cartId}.");
                return Ok(new { Message = "Đã xóa sản phẩm thành công.", deleteResult.DeletedCount });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi xóa chi tiết giỏ hàng: {ex.Message}");
                return StatusCode(500, "Đã xảy ra lỗi khi xóa chi tiết giỏ hàng.");
            }
        }
        [HttpPost]
        [Route("{cartId}")]
        public async Task<ActionResult> DeleteCartOne(string cartId, CartDetailDto cartDetailsDto)
        {
            if (cartDetailsDto == null)
            {
                return BadRequest("Dữ liệu xóa không hợp lệ.");
            }

            var cartFilter = Builders<Cart>.Filter.Eq(x => x.cartId, cartId);
            var cart = await _cart.Find(cartFilter).FirstOrDefaultAsync();

            if (cart == null)
            {
                return NotFound($"Không tìm thấy giỏ hàng với cartId: {cartId}.");
            }

            try
            {
                // Tạo bộ lọc xóa sản phẩm cụ thể
                var deleteFilter = Builders<CartDetails>.Filter.And(
                    Builders<CartDetails>.Filter.Eq(x => x.CartId, cartId),
                    Builders<CartDetails>.Filter.Eq(x => x.ProductId, cartDetailsDto.ProductId)
                );

                // Thực hiện xóa sản phẩm
                var deleteResult = await _cartDetails.DeleteOneAsync(deleteFilter);

                if (deleteResult.DeletedCount == 0)
                {
                    Console.WriteLine($"Không tìm thấy sản phẩm cần xóa trong giỏ hàng với cartId: {cartId}.");
                    return NotFound("Không tìm thấy sản phẩm để xóa.");
                }

                Console.WriteLine($"Đã xóa 1 sản phẩm khỏi giỏ hàng với cartId: {cartId}.");
                return Ok(new { Message = "Đã xóa sản phẩm thành công." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi xóa sản phẩm khỏi giỏ hàng: {ex.Message}");
                return StatusCode(500, $"Đã xảy ra lỗi: {ex.Message}");
            }
        }


        //Lấy giỏ hàng khi nhập mã khách hàng
        //[HttpGet]
        //[Route("{customerId}")]
        //public async Task<ActionResult<Cart_CustomerDto>> GetCartByCustomerId(string customerId)
        //{
        //    if (string.IsNullOrWhiteSpace(customerId))
        //    {
        //        return BadRequest("Customer ID không hợp lệ.");
        //    }

        //    // Lấy thông tin giỏ hàng của khách hàng
        //    var cartFilter = Builders<Cart>.Filter.Eq(x => x.customerId, customerId);
        //    var cart = await _cart.Find(cartFilter).FirstOrDefaultAsync();

        //    if (cart == null)
        //    {
        //        return NotFound("Giỏ hàng không tồn tại.");
        //    }

        //    // Lấy chi tiết các sản phẩm trong giỏ hàng
        //    var cartItemsFilter = Builders<CartDetails>.Filter.Eq(x => x.CartId, cart.cartId);
        //    var cartDetails = await _cartDetails.Find(cartItemsFilter).ToListAsync();

        //    if (cartDetails == null || cartDetails.Count == 0)
        //    {
        //        return NotFound("Giỏ hàng không có sản phẩm.");
        //    }

        //    // Ánh xạ từ Cart và CartDetails sang CartDto và CartDetailDto
        //    var cartDetailDtos = _mapper.Map<List<CartDetailDto>>(cartDetails);

        //    // Tạo CartDto và gán các chi tiết giỏ hàng vào
        //    var cartDto = new Cart_CustomerDto
        //    {
        //        cartId = cart.cartId,
        //        customerId = cart.customerId,
        //        CartDetails = cartDetailDtos
        //    };

        //    return Ok(cartDto);
        //}


        //// Lấy giỏ hàng có chi tiết giỏ hàng của khách hàng từ JWT
        //[HttpGet]
        //[Route("{cartId}")]
        //public async Task<ActionResult<Cart_CustomerDto>> GetCartByCartId(string cartId)
        //{
        //    if (string.IsNullOrWhiteSpace(cartId))
        //    {
        //        return BadRequest("Cart ID không hợp lệ.");
        //    }

        //    // Lấy thông tin giỏ hàng dựa trên cartId
        //    var cartFilter = Builders<Cart>.Filter.Eq(x => x.cartId, cartId);
        //    var cart = await _cart.Find(cartFilter).FirstOrDefaultAsync();

        //    if (cart == null)
        //    {
        //        return NotFound("Giỏ hàng không tồn tại.");
        //    }

        //    // Lấy chi tiết giỏ hàng dựa trên cartId
        //    var cartDetailsFilter = Builders<CartDetails>.Filter.Eq(x => x.CartId, cartId);
        //    var cartDetails = await _cartDetails.Find(cartDetailsFilter).ToListAsync();

        //    if (cartDetails == null || !cartDetails.Any())
        //    {
        //        return NotFound("Không có chi tiết sản phẩm nào trong giỏ hàng.");
        //    }

        //    // Ánh xạ từ CartDetails sang CartDetailDto
        //    var cartDetailDtos = _mapper.Map<List<CartDetailDto>>(cartDetails);

        //    // Tạo Cart_CustomerDto để trả về
        //    var cartDto = new Cart_CustomerDto
        //    {
        //        cartId = cart.cartId,
        //        customerId = cart.customerId,
        //        CartDetails = cartDetailD tos
        //    };

        //    return Ok(cartDto);
        //}
    }
}
