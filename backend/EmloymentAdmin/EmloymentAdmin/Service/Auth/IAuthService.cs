using EmploymentAdmin.Models.Dtos;
using EmploymentAdmin.Models.Entities;

namespace EmploymentAdmin.Service.Auth
{
    public interface IAuthService
    {
        Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request);
        Task<TokenResponseDto> CreateTokenResponse(AspUserModel user);
    }
}
