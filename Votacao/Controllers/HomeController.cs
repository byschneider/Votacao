using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Votacao.Service;
using Votacao.ViewModel;

namespace Votacao.Controllers
{
    public class HomeController : Controller
    {
        private VotacaoService _service;
        public VotacaoService Service
        {
            get { return _service ?? (_service = DependencyResolver.Current.GetService<VotacaoService>()); }
        }

        public ActionResult Index()
        {
            var lstRestaurantes = Service.GetRestaurantes();
            ViewBag.LstRestaurantes = lstRestaurantes;

            var lstVotacao = Service.GetVotacaoDia();
            ViewBag.LstVotacao = lstVotacao;

            return View();
        }

        [HttpPost]
        public JsonResult Votar(VotacaoVM model)
        {
            try
            {
                var sucesso = true;
                var msg = "";
                var usuarioJaVotou = Service.ValidaUsuarioJaVotouDia(model.IdUsuario);

                if (!usuarioJaVotou)
                {
                    Service.AddVoto(model);
                } else
                {
                    sucesso = false;
                    msg = "Usuário " + model.IdUsuario + " já votou hoje.";
                }

                return Json(new { Sucesso = sucesso, Mensagem = msg }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { Sucesso = false, Mensagem = "Ocorreu o seguinte erro: " + e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult VotacaoSemana()
        {
            var model = Service.GetVotacaoSemana();

            return View(model);
        }
    }
}