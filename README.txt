# Votacao
- Simples sistema de votação
- O sitema funciona da seguinte maneira:
    - os dados dos restaurantes disponíveis para votação ficam na collection restaurantes no banco;
    - o sistema só faz votações de segunda a sexta-feira;
    - aos sábados e domingos será exibida mensagem de que não há votação no dia;
    - o usuário deve selecionar o seu voto, informar seu Id de usuário e clicar no botão "Votar";
    - ocorrendo tudo certo será exibida mensagem de confirmação do voto e a parcial será atualizada;
    - após votar, o mesmo usuário não poderá votar no mesmo dia (controlado pelo Id do usuário);
    - o restaurante que vencer em um dia será excluído das votações dos outros dias da semana;
    - no menu "Resultados da Semana" são exibidos os resultados das votações da semana atual;
    - detalhe importante: para testar dias de votação diferentes do dia atual deve-se o valor da variável dataAtual no VotacaoRepository mudando o valor do parâmetro da função AddDays para mais ou menos.

# Requisitos
- Visual Studio 2015 Community ou superior
- Caso o Visual Studio não faça o restore automático do pacote do driver do MongoDB, deve ser feito a instalação com o NuGet:
    Install-Package MongoDB.Driver
- O sistema precisa de conexão com internet pois usa um banco MongoDB na nuvem mLab.

# O que destaco no código
- É um sistema web MVC feito em .Net utilizando javascript, jQuery, bootstrap e o banco de dados não relacional MongoDB.
- Possui um único Controller com 3 métodos:
    - Index: direciona para a view inicial com a votação aberta do dia e parcial da votação do dia;
    - Votar: recebe Request com Id do usuário e código do restaurante selecionado. Esse método valida se o usuário já votou no dia, 
             caso não tenha votado insere o voto no banco de dados. Caso já tenha votado retorna uma mensagem para a view;
    - VotacaoSemana: direciona para a view com os resultados da semana
- No repositório VotacaoRepository ficam os métodos de acesso ao banco onde são feitas as consultas e inserção dos votos

# O que pode ser melhorado
- Inclusão de validação do usuário com Id e senha;
- Incluir um cadastro de restaurantes, ou melhor, configuração o nome da votação para poder votar em outras coisas e não só restaurantes;
- A atualização da votação parcial após o registro de um voto deveria ser feita com um retorno via Json ou PartialView, mas por falta de
  tempo estou atualizando toda a tela.
