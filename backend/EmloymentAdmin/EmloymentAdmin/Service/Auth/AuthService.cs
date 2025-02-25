using EmploymentAdmin.Data;
using EmploymentAdmin.Models.Dtos;
using EmploymentAdmin.Models.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace EmploymentAdmin.Service.Auth
{
    public class AuthService(AuthDbContext _authDBContext, IConfiguration _configuration) : IAuthService
    {
        //public async Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request)
        //{
        //    var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
        //    if (user == null)
        //    {
        //        return null;
        //    }
        //    var token = CreateToken(user);
        //    var refreshToken = await GenerateAndRefreshTokenAsync(user);
        //    return await CreateTokenResponse(user);
        //}
        public async Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
            if (user == null)
            {
                throw new Exception("Refresh Token không hợp lệ hoặc đã hết hạn.");
            }

            var token = CreateToken(user);
            var refreshToken = await GenerateAndRefreshTokenAsync(user);
            return await CreateTokenResponse(user);
        }


        //private async Task<AspUserModel> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
        //{
        //    var userIdString = userId.ToString(); // Chuyển đổi Guid thành string
        //    var user = await _authDBContext.FindAsync<AspUserModel>(userIdString);
        //    if (user == null || user.RefeshTokenExpirytime < DateTime.Now)
        //    {
        //        return null;
        //    }
        //    return user;
        //}
        private async Task<AspUserModel?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var userIdString = userId.ToString(); // Chuyển đổi Guid thành string
            var user = await _authDBContext.FindAsync<AspUserModel>(userIdString);
            if (user == null || user.RefeshToken != refreshToken || user.RefeshTokenExpirytime < DateTime.Now)
            {
                return null;
            }
            return user;
        }

        private string CreateToken(AspUserModel user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"]));
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            var refeshToken = Convert.ToBase64String(randomNumber);
            return refeshToken;
        }
        //private async Task<string> GenerateAndRefreshTokenAsync(AspUserModel user)
        //{
        //    var refreshToken = GenerateRefreshToken();
        //    user.RefeshToken = refreshToken;
        //    user.RefeshTokenExpirytime = DateTime.Now.AddDays(7);
        //    await _authDBContext.SaveChangesAsync();
        //    return refreshToken;
        //}
        private async Task<string> GenerateAndRefreshTokenAsync(AspUserModel user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefeshToken = refreshToken;
            user.RefeshTokenExpirytime = DateTime.Now.AddDays(7);

            try
            {
                await _authDBContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Không thể cập nhật Refresh Token.", ex);
            }

            return refreshToken;
        }
        public async Task<TokenResponseDto> CreateTokenResponse(AspUserModel user)
        {
            return new TokenResponseDto
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndRefreshTokenAsync(user)
            };
        }
    }
}
