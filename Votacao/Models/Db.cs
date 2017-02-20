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
            String uri = "mongodb://votacao_user:votacao_senha@ds157529.mlab.com:57529/votacao";

            var client = new MongoClient(uri);
            var db = client.GetDatabase("votacao");
            var collection = db.GetCollection<BsonDocument>(nmCollection);
            
            return collection;
        }
    }
}