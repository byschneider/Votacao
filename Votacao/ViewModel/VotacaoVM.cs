using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Votacao.ViewModel
{
    public class VotacaoVM
    {
        public int CdRestaurante { get; set; }
        public string NmRestaurante { get; set; }
        public decimal NrVotos { get; set; }
        public decimal NrVotosTotal { get; set; }
        public int PeVotos
        {
            get
            {
                return this.NrVotosTotal > 0 ? Convert.ToInt32((this.NrVotos / this.NrVotosTotal) * 100) : 0;
            }
        }
        public bool FlDesabilitado = false;

        private string _idUsuario;
        public string IdUsuario {
            get
            {
                return string.IsNullOrEmpty(_idUsuario) ? "" : _idUsuario.ToLower().Trim();
            }
            set
            {
                _idUsuario = value;
            }
        }
    }
}