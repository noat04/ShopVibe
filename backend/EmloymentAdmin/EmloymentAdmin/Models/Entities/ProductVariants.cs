using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace EmploymentAdmin.Models.Entities
{
    public class ProductVariants
    {
        [BsonId]
        public ObjectId Id { get; set; }  // Đảm bảo kiểu dữ liệu là ObjectId

        [BsonElement("productId")]
        public string? ProductId { get; set; }

        [BsonElement("size")]
        public string? Size { get; set; }

        [BsonElement("color")]
        public string? Color { get; set; }

        [BsonElement("quantity")]
        public decimal Quantity { get; set; }  // Price should be a decimal, not an ObjectId

        [BsonElement("image")]
        public string? Image { get; set; }

    }
}
