using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;
using EmploymentAdmin.Models.Entities;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using EmploymentAdmin.Data;
using Microsoft.EntityFrameworkCore;
using EmploymentAdmin.Reponsitory;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using EmploymentAdmin.Models.Dtos;
using EmloymentAdmin.Data;
using EmloymentAdmin.Models.Entities;
using System.Text.Json;
using System.Security.Cryptography;
using EmploymentAdmin.Service.VNPay;
using EmploymentAdmin.Service.Auth;
using Azure.Core;


namespace EmloymentAdmin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AspUserModel> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDBConText _database;
        private readonly AuthDbContext _authDBContext;
        private readonly MongoDBService _mongoDBService; 
        private readonly EmailSender _emailSender;
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;

        public AuthController(
         UserManager<AspUserModel> userManager,
         RoleManager<IdentityRole> roleManager,
         ApplicationDBConText dbContext,
         AuthDbContext context,
         MongoDBService mongoDBService,
         IEmailSender emailSender,
         IConfiguration configuration,
         IAuthService authService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _database = dbContext;
            _authDBContext = context;
            _authService = authService;
            _mongoDBService = mongoDBService;
            _emailSender = (EmailSender?)emailSender;  // <- Đảm bảo emailSender được truyền vào
            _configuration = configuration;
        }

        // Đăng ký người dùng(User)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            if (ModelState.IsValid)
            {
                var user = new AspUserModel { UserName = model.UserName, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    // Gán vai trò 'User' cho người dùng mới
                    if (!await _roleManager.RoleExistsAsync("User"))
                    {
                        // Nếu vai trò chưa tồn tại, tạo mới vai trò "User"
                        await _roleManager.CreateAsync(new IdentityRole("User"));
                    }

                    // Gán vai trò "User" cho người dùng
                    await _userManager.AddToRoleAsync(user, "User");

                    // Tạo thông tin khách hàng tương ứng
                    var customerEntity = new Customer()
                    {
                        FirstName = null,
                        LastName = null,
                        Address = null,
                        Sex = null,
                        Phone = null,
                        Email = user.Email,
                        UserId = user.Id
                    };

                    _database.Customers.Add(customerEntity);
                    await _database.SaveChangesAsync();

                    return Ok(new { Message = "User registered successfully" });
                }

                return BadRequest(result.Errors);
            }
            return BadRequest("Invalid model state");
        }


        // Đăng nhập người dùng và trả về token JWT
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"]!)),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)),
                            SecurityAlgorithms.HmacSha256)
                );  

                //var refreshToken = GenerateRefreshToken();
                //SetRefreshToken(refreshToken);
                var response = await _authService.CreateTokenResponse(user);
                return Ok(new
                {
                    response,
                    //Token = new JwtSecurityTokenHandler().WriteToken(token),
                    user
                });
            }

            return Unauthorized("Invalid login attempt");
        }

        [HttpPost("add-role")]
        public async Task<IActionResult> AddRole([FromBody] string role)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                var result = await _roleManager.CreateAsync(new IdentityRole(role));
                if (result.Succeeded)
                {
                    return Ok(new { Message = "Role created successfully" });
                }
                return BadRequest(result.Errors);
            }
            return BadRequest("Role already exists");
        }

        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] UserRole model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return BadRequest("User not found");
            }
            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                return BadRequest("Role not found");
            }
            var result = await _userManager.AddToRoleAsync(user, model.Role);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Role assigned successfully" });
            }
            return BadRequest(result.Errors);
        }

        //Xác thực tính hợp lệ của token
        [HttpPost("intospect")]
        public IActionResult Intospect([FromBody] IntrospectTokenDto token)
        {
            if (string.IsNullOrEmpty(token.Token))
            {
                return BadRequest(new { isValid = false, message = "Token is missing" });
            }

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!))
            };

            try
            {
                var handler = new JwtSecurityTokenHandler();
                handler.ValidateToken(token.Token, validationParameters, out _);
                return Ok(new { isValid = true, message = "Token is valid" });
            }
            catch
            {
                return Unauthorized(new { isValid = false, message = "Invalid token" });
            }
        }

        [HttpGet("NewPassword")]
        public async Task<IActionResult> NewPassword(string token, string email)
        {
            var checkUser = await _userManager.FindByEmailAsync(email) as AspUserModel;
            if (checkUser == null)
            {
                return BadRequest("Email not found");
            }
            if (checkUser.Token != token)
            {
                return BadRequest("Invalid token");
            }

            // Nếu token hợp lệ, chuyển hướng đến trang frontend
            string frontEndUrl = "http://localhost:3000/newPassword";
            var redirectUrl = $"{frontEndUrl}?token={token}&email={Uri.EscapeDataString(email)}";
            return Redirect(redirectUrl);
        }


        [HttpPost("SendMailForgotPassword")]
        public async Task<IActionResult> SendMailForgotPassword([FromBody] AspUserModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email) as AspUserModel;
            if (user == null)
            {
                return BadRequest("Email not found");
            }

            // Tạo token theo cách riêng hoặc sử dụng GUID
            string token = Guid.NewGuid().ToString();
            user.Token = token;

            _authDBContext.Update(user);
            await _authDBContext.SaveChangesAsync();

            var receiver = user.Email;
            var subject = "Reset Password for user: " + user.Email;
            var message = $"Please click the link below to reset your password:\n{Request.Scheme}://{Request.Host}/api/Auth/NewPassword?token={token}&email={Uri.EscapeDataString(user.Email)}";

            await _emailSender.SendEmailAsync(receiver, subject, message);

            //return RedirectToAction("");
            return Ok(new { Message = "Please check your email to reset your password." });
        }
        [HttpPost("UpdatePassword")]
        public async Task<IActionResult> UpdateNewPassword([FromBody] UpdatePasswordModel model)
        {
            // Giả sử model chứa Email, Token và NewPassword
            var checkUser = await _userManager.Users
                                .FirstOrDefaultAsync(u => u.Email == model.Email && u.Token == model.Token);
            if (checkUser != null)
            {
                // Tạo token mới để đảm bảo không sử dụng lại token cũ
                string newToken = Guid.NewGuid().ToString();

                var passwordHasher = new PasswordHasher<AspUserModel>();
                // Sử dụng NewPassword từ model để hash
                var passwordHash = passwordHasher.HashPassword(checkUser, model.NewPassword);

                checkUser.PasswordHash = passwordHash;
                checkUser.Token = newToken; 

                await _userManager.UpdateAsync(checkUser);
                return Ok(new { Message = "Cập nhật mật khẩu thành công" });
            }
            else
            {
                return BadRequest(new { Message = "Token hoặc Email không hợp lệ" });
            }
        }

        [HttpGet("login-google")]
        public async Task LoginByGoogle()
        {
            await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme, new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse")
            });
        }
        [HttpGet("GoogleResponse")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!result.Succeeded || result.Principal == null)
            {
                return BadRequest(new { error = "Authentication failed" });
            }

            var claims = result.Principal.Identities.FirstOrDefault().Claims.Select(c => new
            {
                c.Issuer,
                c.OriginalIssuer,
                c.Type,
                c.Value
            });

            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { error = "Email not found in claims" });
            }

            string UserName = email.Split('@')[0];
            var existingUser = await _userManager.FindByEmailAsync(email);

            if (existingUser == null)
            {
                var passwordHasher = new PasswordHasher<AspUserModel>();
                var hashedPassword = passwordHasher.HashPassword(null, "123456789");
                var newUser = new AspUserModel { UserName = UserName, Email = email };
                newUser.PasswordHash = hashedPassword;
                var createUserResult = await _userManager.CreateAsync(newUser);

                if (!createUserResult.Succeeded)
                {
                    return BadRequest(new { error = "User creation failed", details = createUserResult.Errors });
                }

                if (!await _roleManager.RoleExistsAsync("User"))
                {
                    await _roleManager.CreateAsync(new IdentityRole("User"));
                }

                await _userManager.AddToRoleAsync(newUser, "User");

                var customerEntity = new Customer()
                {
                    FirstName = null,
                    LastName = null,
                    Address = null,
                    Sex = null,
                    Phone = null,
                    Email = newUser.Email,
                    UserId = newUser.Id
                };

                _database.Customers.Add(customerEntity);
                await _database.SaveChangesAsync();

                // Nếu thành công, chuyển hướng người dùng
                return Redirect("http://localhost:3000/Home");
            }

            return Redirect("http://localhost:3000/404");
        }


        //[Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Nếu có logic khác cần thực hiện khi đăng xuất, thêm ở đây
            return Ok(new { message = "Đăng xuất thành công" });
        }

        [HttpGet("state")]
        public bool IsAccountCreatedSuccessfully(string jsonResponse)
        {
            if (string.IsNullOrEmpty(jsonResponse))
                return false;

            try
            {
                var response = JsonSerializer.Deserialize<Dictionary<string, string>>(jsonResponse);
                if (response != null && response.ContainsKey("Message") && response["Message"] == "Đã tạo tài khoản thành công")
                {
                    return true;
                }
            }
            catch (JsonException)
            {
                // Log lỗi nếu cần
            }

            return false;
        }

        //[HttpPost("refresh-token")]
        //public async Task<ActionResult<TokenResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto request)
        //{
        //    var result = await _authService.RefreshTokenAsync(request);
        //    if (result == null)
        //    {
        //        return BadRequest("Invalid token");
        //    }
        //    return Ok(result);
        //}
        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _authService.RefreshTokenAsync(request);
                if (result == null)
                {
                    return BadRequest(new ProblemDetails
                    {
                        Title = "Invalid token",
                        Detail = "The provided refresh token is invalid or has expired.",
                        Status = StatusCodes.Status400BadRequest
                    });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while refreshing the token.",
                    Error = ex.Message
                });
            }
        }

    }
}
