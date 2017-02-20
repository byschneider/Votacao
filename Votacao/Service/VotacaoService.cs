using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Votacao.Repository;
using Votacao.ViewModel;

namespace Votacao.Service
{
    public class VotacaoService
    {
        private VotacaoRepository _repository;
        public VotacaoRepository Repository
        {
            get { return _repository ?? (_repository = DependencyResolver.Current.GetService<VotacaoRepository>()); }
        }

        public List<VotacaoVM> GetRestaurantes()
        {
            //return new List<SelectListItem>
            //{
            //    new SelectListItem { Text = "Churrascaria", Value = "1" },
            //    new SelectListItem { Text = "Pizzaria", Value = "2" },
            //    new SelectListItem { Text = "Hamburgueria", Value = "3" },
            //    new SelectListItem { Text = "Buffet", Value = "4" },
            //    new SelectListItem { Text = "Galeteria", Value = "5" }
            //};
            return Repository.GetRestaurantes();
        }

        public List<VotacaoVM> GetVotacaoDia()
        {
            return Repository.GetVotacaoDia();
        }

        public bool ValidaUsuarioJaVotouDia(string idUsuario)
        {
            return Repository.ValidaUsuarioJaVotouDia(idUsuario);
        }

        public void AddVoto(VotacaoVM model)
        {
            Repository.AddVoto(model);
        }

        public VotacaoSemanaVM GetVotacaoSemana()
        {
            return Repository.GetVotacaoSemana();
        }
    }
}