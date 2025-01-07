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

        [BsonElement("quality")]
        public decimal Quality { get; set; }

    }
}
