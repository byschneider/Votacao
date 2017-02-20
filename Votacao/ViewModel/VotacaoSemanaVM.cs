using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Votacao.ViewModel
{
    public class VotacaoSemanaVM
    {
        public List<VotacaoVM> LsSegunda = new List<VotacaoVM>();
        public List<VotacaoVM> LsTerca = new List<VotacaoVM>();
        public List<VotacaoVM> LsQuarta = new List<VotacaoVM>();
        public List<VotacaoVM> LsQuinta = new List<VotacaoVM>();
        public List<VotacaoVM> LsSexta = new List<VotacaoVM>();
    }
}