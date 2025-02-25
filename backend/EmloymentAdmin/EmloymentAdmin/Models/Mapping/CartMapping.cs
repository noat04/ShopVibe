using AutoMapper;
using EmploymentAdmin.Models.Dtos;
using EmploymentAdmin.Models.Entities;

namespace EmploymentAdmin.Models.Mapping
{
    public class CartMapping : Profile
    {
        public CartMapping()
        {
            CreateMap<Cart, Cart_CustomerDto>();
            CreateMap<CartDetails, CartDetailDto>();
        }
    }
}
