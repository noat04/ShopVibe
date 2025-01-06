using EmploymentAdmin.Models.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EmloymentAdmin.Models.Entities
{
    public class Products
    {
        [BsonId]
        public ObjectId Id { get; set; }  // Đảm bảo kiểu dữ liệu là ObjectId

        [BsonElement("productId")]
        public string? ProductId { get; set; }

        [BsonElement("productName")]
        public string? ProductName { get; set; }

        [BsonElement("price")]
        public decimal Price { get; set; }  // Price should be a decimal, not an ObjectId

        [BsonElement("manufactureDate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime ManufactureDate { get; set; }

        [BsonElement("importDate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime ImportDate { get; set; }

        [BsonElement("categoryId")]
        public string CategoryId { get; set; }

        [BsonElement("image")]
        public string Image { get; set; }
        //public List<string>? Images { get; set; }  // Hình ảnh cho biến thể

        //[BsonIgnore]
        //public List<ProductVariants> Variants { get; set; } = new List<ProductVariants>();

    }
}
