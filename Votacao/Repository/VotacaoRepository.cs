using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Votacao.Models;
using Votacao.ViewModel;

namespace Votacao.Repository
{
    public class VotacaoRepository : Db
    {
        // data que define a data atual do sistema.
        // para testar outros dias da semana só mudar o valor na soma abaixo
        private DateTime dataAtual = DateTime.Now.AddDays(3);

        public DateTime GetDataMongo(DateTime data)
        {
            return new DateTime(data.Year, data.Month, data.Day, 0, 0, 0, DateTimeKind.Utc);
        }

        public List<VotacaoVM> GetVotacaoDia()
        {
            var retorno = new List<VotacaoVM>();

            var lstRestaurantes = this.GetRestaurantes(false);

            var collection = GetCollection("votacao");
            var filter = Builders<BsonDocument>.Filter.Eq("Data", GetDataMongo(dataAtual));
            var result = collection.Find(filter).ToList();

            lstRestaurantes.Select(c => { c.NrVotosTotal = result.Count; return c; }).ToList();

            foreach (var voto in result)
            {
                lstRestaurantes.Where(x => x.CdRestaurante == voto["CdRestaurante"].AsInt32).FirstOrDefault().NrVotos++;
            }

            return lstRestaurantes.OrderByDescending(x => Convert.ToInt32(x.NrVotos)).ToList();
        }

        public VotacaoSemanaVM GetVotacaoSemana()
        {
            var retorno = new VotacaoSemanaVM();

            var diasFinalizadosSemana = ((int) dataAtual.DayOfWeek) - 1;
            var auxData = dataAtual;

            for (var i = 0; i < diasFinalizadosSemana; i++)
            {
                auxData = auxData.AddDays(-1);

                var collection = GetCollection("votacao");
                var filter = Builders<BsonDocument>.Filter.Eq("Data", GetDataMongo(auxData));
                var result = collection.Find(filter).ToList();

                var lstRestaurantes = this.GetRestaurantes(false);
                lstRestaurantes.Select(c => { c.NrVotosTotal = result.Count; return c; }).ToList();

                foreach (var voto in result)
                {
                    lstRestaurantes.Where(x => x.CdRestaurante == voto["CdRestaurante"].AsInt32).FirstOrDefault().NrVotos++;
                }

                lstRestaurantes = lstRestaurantes.OrderByDescending(x => Convert.ToInt32(x.NrVotos)).ToList();

                switch ((int)auxData.DayOfWeek)
                {
                    case 1:
                        retorno.LsSegunda = lstRestaurantes;
                        break;
                    case 2:
                        retorno.LsTerca = lstRestaurantes;
                        break;
                    case 3:
                        retorno.LsQuarta = lstRestaurantes;
                        break;
                    case 4:
                        retorno.LsQuinta = lstRestaurantes;
                        break;
                    case 5:
                        retorno.LsSexta = lstRestaurantes;
                        break;
                }
            }

            return retorno;
        }

        public List<int> GetVencedoresSemana()
        {
            var retorno = new List<int>();

            var diasFinalizadosSemana = ((int)dataAtual.DayOfWeek) - 1;
            var auxData = dataAtual;

            for (var i = 0; i < diasFinalizadosSemana; i++)
            {
                auxData = auxData.AddDays(-1);

                var collection = GetCollection("votacao");
                var aggregate = collection.Aggregate()
                                          .Match(new BsonDocument { { "Data", GetDataMongo(auxData) } })
                                          .Group(new BsonDocument {
                                              { "_id", "$CdRestaurante" },
                                              { "count", new BsonDocument("$sum", "$Voto") }
                                          })
                                          .SortByDescending(x => x["count"]);
                var results = aggregate.FirstOrDefault();
                retorno.Add(results["_id"].AsInt32);
            }

            return retorno;
        }

        public List<VotacaoVM> GetRestaurantes(bool removerVencedores = true)
        {
            var collection = GetCollection("restaurantes");

            var result = collection.Find(_ => true).ToList();
            var retorno = new List<VotacaoVM>();

            foreach (var item in result)
            {
                retorno.Add(new VotacaoVM
                {
                    CdRestaurante = item["_id"].AsInt32,
                    NmRestaurante = item["NmRestaurante"].AsString
                });
            }

            if (removerVencedores)
            {
                var vencedores = GetVencedoresSemana();

                foreach (var cdRestaurante in vencedores)
                {
                    retorno.Remove(retorno.Where(x => x.CdRestaurante == cdRestaurante).FirstOrDefault());
                }
            }

            return retorno;
        }

        public bool ValidaUsuarioJaVotouDia(string idUsuario)
        {
            var collection = GetCollection("votacao");
            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.Eq("Data", GetDataMongo(dataAtual)) & builder.Eq("IdUsuario", idUsuario);
            var exists = collection.Find(filter).Any();

            return exists;
        }

        public void AddVoto(VotacaoVM model)
        {
            //var lstRestaurates = this.GetRestaurantes();
            //BsonDocument[] documentos = { };

            //foreach (var restaurante in lstRestaurates)
            //{
                var novo = new BsonDocument {
                    { "IdUsuario" , model.IdUsuario },
                    { "CdRestaurante" , model.CdRestaurante },
                    { "Data", GetDataMongo(dataAtual) },
                    { "Voto", 1 }
                };
            //    documentos[documentos.Length] = novo;
            //}

            var collection = GetCollection("votacao");

            collection.InsertOneAsync(novo);
        }
    }
}