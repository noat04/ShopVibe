using AutoMapper;
using EmloymentAdmin.Data;
using EmloymentAdmin.Models.Entities;
using EmploymentAdmin.Models.Dtos;
using EmploymentAdmin.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;

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
        [Route("")]
        public async Task<IEnumerable<CartDto>> GetAllCart()
        {
            var cart = await _cart.Find(FilterDefinition<Cart>.Empty).ToListAsync();
            return _mapper.Map<IEnumerable<CartDto>>(cart);
        }

        //Lấy giỏ hàng khi nhập mã khách hàng
        [HttpGet]
        [Route("cart/{customerId}")]
        public async Task<ActionResult<CartDto>> GetCartByCustomerId(string customerId)
        {
            if (string.IsNullOrWhiteSpace(customerId))
            {
                return BadRequest("Customer ID không hợp lệ.");
            }

            // Lấy thông tin giỏ hàng của khách hàng
            var cartFilter = Builders<Cart>.Filter.Eq(x => x.customerId, customerId);
            var cart = await _cart.Find(cartFilter).FirstOrDefaultAsync();

            if (cart == null)
            {
                return NotFound("Giỏ hàng không tồn tại.");
            }

            // Lấy chi tiết các sản phẩm trong giỏ hàng
            var cartItemsFilter = Builders<CartDetails>.Filter.Eq(x => x.CartId, cart.cartId);
            var cartDetails = await _cartDetails.Find(cartItemsFilter).ToListAsync();

            if (cartDetails == null || cartDetails.Count == 0)
            {
                return NotFound("Giỏ hàng không có sản phẩm.");
            }

            // Ánh xạ từ Cart và CartDetails sang CartDto và CartDetailDto
            var cartDetailDtos = _mapper.Map<List<CartDetailDto>>(cartDetails);

            // Tạo CartDto và gán các chi tiết giỏ hàng vào
            var cartDto = new CartDto
            {
                cartId = cart.cartId,
                customerId = cart.customerId,
                CartDetails = cartDetailDtos
            };

            return Ok(cartDto);
        }


        // Lấy giỏ hàng có chi tiết giỏ hàng của khách hàng từ JWT
        [HttpGet]
        [Route("")]
        //[Authorize] // Yêu cầu xác thực bằng JWT
        public async Task<ActionResult<CartDto>> GetCart()
        {
            // Lấy thông tin customerId từ JWT token
            var customerId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Lấy customerId từ token JWT 
            if (string.IsNullOrEmpty(customerId))
            {
                return Unauthorized("Khách hàng không xác thực.");
            }

            // Lấy thông tin giỏ hàng của người dùng từ MongoDB
            var cartFilter = Builders<Cart>.Filter.Eq(x => x.customerId, customerId);
            var cart = await _cart.Find(cartFilter).FirstOrDefaultAsync();

            if (cart == null)
            {
                return NotFound("Giỏ hàng không tồn tại");
            }

            // Lấy các sản phẩm trong giỏ hàng từ CartDetails
            var cartItemsFilter = Builders<CartDetails>.Filter.Eq(x => x.CartId, cart.cartId);
            var cartDetails = await _cartDetails.Find(cartItemsFilter).ToListAsync();

            if (cartDetails == null || cartDetails.Count == 0)
            {
                return NotFound("Giỏ hàng không có sản phẩm.");
            }

            // Ánh xạ từ cartDetails sang CartDetailDto
            var cartDetailDtos = _mapper.Map<List<CartDetailDto>>(cartDetails);

            // Tạo CartDto để trả về
            var cartDto = new CartDto
            {
                cartId = cart.cartId,
                customerId = cart.customerId,
                CartDetails = cartDetailDtos
            };

            return Ok(cartDto);
        }



    }
}
