using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EmploymentAdmin.Models.Entities
{
    public class CartDetails
    {
       [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("cartId")]
        public string CartId { get; set; }

        [BsonElement("productId")]
        public string ProductId { get; set; }

        [BsonElement("price")]
        public decimal Price { get; set; }

        [BsonElement("quantity")]
        public int Quantity { get; set; }

        [BsonElement("size")]
        public string Size { get; set; }

        [BsonElement("color")]
        public string Color { get; set; }
    }
}
