var myApp = angular.module("myApp", []);

myApp.controller("controller", ['$scope', '$http',
    function ($scope, $http) {
        var baseUrl = 'https://api.postmon.com.br/v1/cep/';
        var cepAnterior = null;
        var edicao = false;
        $scope.novoContato = {
            nome: null,
            telefones: [],
            email: null,
            observacoes: null,
            enderecos: [{}]
        };
        $scope.contatoSelecionado = {};

        $scope.contatos = [
            {
                nome: "Gustavo Telles",
                telefones: ["31992998047", "3134763613"],
                email: "gute@gmail.com",
                observacoes: "Gente fina!",
                enderecos: [
                    { logradouro: "Rua Colonita", numero: "07", cep: "31365140", localidade: "Santa Terezinha", municipio: "Belo Horizonte", uf: "MG" },
                    { logradouro: "Rua Johnson", numero: "34", cep: "31365160", localidade: "Santa Terezinha", municipio: "Belo Horizonte", uf: "MG" },
                ]
            },
            {
                nome: "Gabrielle Girodo",
                telefones: ["3199448047", "3132343613"],
                email: "gavri@gmail.com",
                observacoes: "Gente bonissima! talentosa",
                enderecos: [
                    { logradouro: "Rua Conceicao duvivier", numero: "07", cep: "31360140", localidade: "Santa Terezinha", municipio: "Belo Horizonte", uf: "MG" },
                    { logradouro: "Rua tchuplek", numero: "222", cep: "31360160", localidade: "Santa Terezinha", municipio: "Belo Horizonte", uf: "MG" },
                ]
            }
        ];

        $scope.buscaCep = function (cep) {

            if (cep != null && cep.length == 8) {
                cepAnterior = cep;
                $http.get(baseUrl + cep).then(function (response) {
                    var end = response.data;
                    $scope.novoContato.endereco.logradouro = end.logradouro;
                    $scope.novoContato.endereco.municipio = end.cidade;
                    $scope.novoContato.endereco.localidade = end.bairro;
                    $scope.novoContato.endereco.uf = end.estado;

                }, function (err) {
                    console.log(err);
                });
            } else {
                //alert("Digite um cep válido");
                toastr.error('Digite um cep válido', 'Error');
            }
        }

        $scope.novo = function () {
            $scope.novoContato = {};
            $scope.edicao = false;
        };

        $scope.editar = function (contato) {
            $scope.novoContato = contato;
            $scope.edicao = true;
        };

        $scope.salvar = function () {
            validacao = $scope.novoContato != null ? $scope.validaContato($scope.novoContato) : null;
            if (validacao.contatoValido && $scope.verificaEmail()) {
                $scope.contatos.push($scope.novoContato);
                $('#myModal').modal('toggle');
                $scope.novoContato = {};

            } else {
                alert(validacao.msgValidacao);
            }
        };

        $scope.verificaEmail = function () {
            $scope.contatos.forEach((contato) => {
                if (contato.email == $scope.novoContato.email) {
                    return false;
                }
            });
            return true;
        };

        $scope.validaContato = function () {
            var msgValidacao = "Preencha o(s) campo(s): ";
            var contatoValido = true;
            contato = $scope.novoContato;
            if (!contato.nome || contato.nome == null) {
                msgValidacao += "Nome, ";
                contatoValido = false;
            }
            if (!contato.email || contato.email == null) {
                msgValidacao += "Email, ";
                contatoValido = false;
            }
            if (!contato.telefones || contato.telefones == null) {
                msgValidacao += "Telefone, ";
                contatoValido = false;
            }
            if (!contato.enderecos || contato.enderecos == null) {
                msgValidacao += "Endereço ";
                contatoValido = false;
            }
            retorno = { contatoValido: contatoValido, msgValidacao: msgValidacao };
            return retorno;
        }

        $scope.excluirContato = function () {
            $scope.contatos.splice($scope.contatos.indexOf($scope.contatoSelecionado), 1);
        };

        $scope.adicionaTelefone = function (telefone) {
            if (!$scope.novoContato.telefones) {
                $scope.novoContato.telefones = [];
            }
            if ($scope.novoContato.telefones.indexOf(telefone) == -1) {
                $scope.novoContato.telefones.push(telefone);
                $scope.novoContato.telefone = null;
            } else {
                alert("Número já inserido");
            }
        };

        $scope.removeTelefone = function () {
            $scope.novoContato.telefones.pop();
        };

        $scope.adicionaEndereco = function (end) {
            if (!$scope.novoContato.enderecos) {
                $scope.novoContato.enderecos = [];
            }

            validacao = end != null ? $scope.validaEndereco(end) : null;
            if (validacao.enderecoValido) {
                $scope.novoContato.enderecos.push(end);
                $scope.novoContato.endereco = null;
            } else {
                alert(validacao.msgValidacao);
            }
        };

        $scope.validaEndereco = function (end) {
            var msgValidacao = "Preencha os campos: ";
            var enderecoValido = true
            if (!end.cep || end.cep == null) {
                msgValidacao += "CEP ";
                enderecoValido = false;
            }
            if (!end.logradouro || end.logradouro == null) {
                msgValidacao += "Logradouro ";
                enderecoValido = false;
            }
            if (!end.numero || end.numero == null) {
                msgValidacao += "Numero ";
                enderecoValido = false;
            }
            if (!end.localidade || end.localidade == null) {
                msgValidacao += "Localidade ";
                enderecoValido = false;
            }
            if (!end.municipio || end.municipio == null) {
                msgValidacao += "Municipio ";
                enderecoValido = false;
            }
            if (!end.uf || end.uf == null) {
                msgValidacao += "Uf ";
                enderecoValido = false;
            }
            retorno = { enderecoValido: enderecoValido, msgValidacao: msgValidacao };
            return retorno;
        }

        $scope.removeEndereco = function () {
            $scope.novoContato.enderecos.pop();
        };
    }]);