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
    //{
    //public static ProductDto ToProduct(this Products product)
    //{
    //    return new ProductDto()
    //    {
    //        Id = product.Id.ToString(),
    //        ProductId = product.ProductId,
    //        ProductName = product.ProductName,
    //        Price = product.Price,
    //        ManufactureDate = product.ManufactureDate,
    //        ImportDate = product.ImportDate,
    //        CategoryId = product.CategoryId,
    //        Image = product.Image,
    //        //// Dữ liệu Variants được ánh xạ từ Entity nếu có thông tin nào đó cần thiết
    //        //Variants = product.Variants?.Select(v => v.ToProductVariantDto()).ToList() ?? new List<ProductVariantDto>()
    //    };
    //}
    //public static ProductVariantDto ToProductVariantDto(this ProductVariants productVariant)
    //{
    //    return new ProductVariantDto()
    //    {
    //        Id = productVariant.Id.ToString(),
    //        ProductId = productVariant.ProductId,
    //        Size = productVariant.Size,
    //        Color = productVariant.Color,
    //        Quantity = productVariant.Quantity,
    //        Image = productVariant.Image
    //    };
    //}
}
