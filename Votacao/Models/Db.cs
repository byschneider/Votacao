using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Votacao.Models
{
    public class Db
    {
        public IMongoCollection<BsonDocument> GetCollection(string nmCollection)
        {
            String uri = "mongodb://votacao:dbserver@ds056979.mlab.com:56979/dbserver";

            var client = new MongoClient(uri);
            var db = client.GetDatabase("dbserver");
            var collection = db.GetCollection<BsonDocument>(nmCollection);
            
            return collection;
        }
    }
}