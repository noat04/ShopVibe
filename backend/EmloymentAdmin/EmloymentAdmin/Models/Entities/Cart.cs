using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EmploymentAdmin.Models.Entities
{
    public class Cart
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("cartId")]
        public string cartId { get; set; }

        [BsonElement("customerId")]
        public string customerId { get; set; }
    }
}
