using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace EmploymentAdmin.Models.Entities
{
    public class ProductCategories
    {

        [BsonId]
        public ObjectId Id { get; set; }  // Đảm bảo kiểu dữ liệu là ObjectId

        [BsonElement("name")]
        public string? ProductCategoriesName { get; set; }

        [BsonElement("description")]
        public string? Description { get; set; }  // Price should be a decimal, not an ObjectId

        [BsonElement("createdAt")]
        [BsonDateTimeOptions]
        public DateTime? CreatedAt { get; set; }  // ImportDate should be DateTime
    }
}
