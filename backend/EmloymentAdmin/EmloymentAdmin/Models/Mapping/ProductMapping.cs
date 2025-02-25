using AutoMapper;
using EmloymentAdmin.Models.Entities;
using EmploymentAdmin.Models.Dtos;
using EmploymentAdmin.Models.Entities;
namespace EmploymentAdmin.Models.Mapping
{
    public class ProductMapping : Profile
    {
        public ProductMapping()
        {
            CreateMap<Products, ProductDto>();
            CreateMap<ProductVariants, ProductVariantDto>();
        }
    }
}
