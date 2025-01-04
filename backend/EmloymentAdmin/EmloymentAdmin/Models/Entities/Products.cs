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
        public decimal? Price { get; set; }  // Price should be a decimal, not an ObjectId

        [BsonElement("manufactureDate")]
        [BsonDateTimeOptions]
        public DateTime? ManufactureDate { get; set; }  // ManufactureDate should be DateTime

        [BsonElement("importDate")]
        [BsonDateTimeOptions]
        public DateTime? ImportDate { get; set; }  // ImportDate should be DateTime

        [BsonElement("categoryId")]
        public string? CategoryId { get; set; }

        [BsonElement("image")]
        public string? Image { get; set; }

    }
}
