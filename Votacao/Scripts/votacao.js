var body = top.document.getElementById('childframe');

var $dialog = null;
var waitingDialog = (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    $dialog = $(
		'<div class="modal fade" id="ModalAguarde" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
			'</div>' +
		'</div></div></div>');

    return {
        /**
		 * Opens our dialog
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
        show: function (message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {};
            }
            if (typeof message === 'undefined') {
                message = 'Loading';
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: '',
                onHide: null // This callback runs after the dialog was hidden
            }, options);

            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h3').text(message);
            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    settings.onHide.call($dialog);
                });
            }
            // Opening dialog
            $dialog.modal();
        },
        /**
		 * Closes dialog
		 */
        hide: function () {
            $dialog.modal('hide');
        }
    };

})(jQuery);

var Votacao = function () {
    return {
        Aguarde: function () {
            function ajustaMensagem(mensagem) {
                if (mensagem == "" || mensagem == undefined) {
                    return "Processando, por favor aguarde...";
                }

                return mensagem;
            }

            return {
                Exibir: function (mensagem, width) {
                    waitingDialog.show('Aguarde...', { dialogSize: 'sm' });
                },
                Fechar: function () {
                    $(dialog).close();
                    $(".modal-dialog", $(document)).dialog('close');
                    $(".modal-dialog", $(document)).remove();

                    try {
                        top.$("#ModalAguarde").dialog('close');
                        top.$("#ModalAguarde").remove();
                    } catch (e) {
                    }

                }
            };
        }(),
        BarraDeProgresso: function () {
            return {
                Exibir: function (mensagem, valor, titulo) {
                    var top = $(body).parent().find("body");

                    var divProgressbar = $('<div class="ui-dialog-wait ui-dialog-default" id="ContainerBarraDeProgresso"><div id="progressbar"></div><label>' + mensagem + '</label></div>');
                    $("#progressbar", $(divProgressbar)).progressbar({
                        value: valor
                    });

                    $(top).append(divProgressbar);

                    if ($(document).filter("#ContainerBarraDeProgresso").length > 0) {
                        return;
                    }

                    $(divProgressbar).dialog({
                        autoOpen: true,
                        title: "Processando",
                        position: 'center',
                        resizable: false,
                        disabled: true,
                        draggable: false,
                        closeOnEscape: false,
                        height: 120,
                        modal: true,
                        hide: "fadeOut",
                        open: function (event, ui) {
                            $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
                        }
                    });
                },
                Incremento: function (valor, mensagem) {
                    $("#progressbar").progressbar({
                        value: valor
                    });

                    if (mensagem != undefined) {
                        $("#ContainerBarraDeProgresso").find("label").text(mensagem);
                    }
                },
                AlterarMensagem: function (mensagem) {
                    if (mensagem != undefined) {
                        $("#ContainerBarraDeProgresso").find("label").text(mensagem);
                    }
                },
                Fechar: function () {
                    $("#ContainerBarraDeProgresso").dialog('close');
                    $("#ContainerBarraDeProgresso").remove();
                }
            };
        }(),
        Paginacao: function () {

            function getContainer(info, div) {
                if (info != undefined && info.DivContainder != undefined) {
                    var seletor = info.DivContainder.selector;
                    return $(seletor);
                }

                return $(div).parents(".DivContainerListagemPesquisa:first");
            }

            return {
                Atualizar: function (div, dados, type, element) {
                    Votacao.Aguarde.Exibir();

                    var dataToPaginate = $(div).attr("data-DataToPaginate");
                    var functioDataToPaginate = dataToPaginate == undefined || dataToPaginate == "" ? window["getDataToPaginateGeneric"]() : window[dataToPaginate]();

                    if ($(div).length == 0) {
                        if (functioDataToPaginate != null && functioDataToPaginate != undefined && functioDataToPaginate.DivContainder != undefined) {
                            div = info.DivContainder;
                        }
                    }

                    var url = $(div).attr("data-url");
                    var pages = $(div).find(".Paginacao-CurrentPage");
                    var container = getContainer(functioDataToPaginate, div);
                    var currentPage = $(pages).val();

                    if (url == "" || url == undefined) {
                        url = $(div).attr("data-url");
                    }

                    if (container == null) {
                        if (functioDataToPaginate != null && functioDataToPaginate != undefined && functioDataToPaginate.DivContainder != undefined) {
                            container = info.DivContainder;
                        }
                    }

                    if (type == "NAV") {
                        /*BOTÕES DE NAVEGAÇÃO*/
                        if ($(element).hasClass("Paginacao-SetaPrimeira")) {
                            currentPage = 1;
                        } else if ($(element).hasClass("Paginacao-SetaAnterior")) {
                            currentPage--;
                        } else if ($(element).hasClass("Paginacao-SetaProxima")) {
                            currentPage++;
                        } else if ($(element).hasClass("Paginacao-SetaUltima")) {
                            currentPage = $(pages).find("option:last").val();
                        }
                    } else if (type == "DL" || type == "ORD") {
                        /*LINHAS POR PÁGINA*/
                        currentPage = 1;
                    }

                    var display = $(div).find(".Paginacao-DisplayLength").val();
                    var paginate = {
                        DisplayLength: display == undefined ? 20 : display,
                        CurrentPage: currentPage == undefined ? 1 : currentPage
                    };

                    if (type != "ORD") {
                        var ths = $(container).find("th");

                        $(ths).each(function() {
                            var direction = $(this).attr("data-direction");
                            if (direction != "" && direction != undefined) {
                                var orderedColumn = $(this).attr("data-order");
                                var directionOrder = $(this).attr("data-direction");

                                dados.OrderBy = orderedColumn;
                                dados.OrderByDescending = directionOrder == "DESC";

                                return;
                            }
                        });
                    } 

                    paginate = $.extend({}, { OrderBy: dados.OrderBy, OrderByDescending: dados.OrderByDescending }, paginate);

                    if (functioDataToPaginate != undefined && functioDataToPaginate.DivContainder != undefined) {
                        dados.DivContainder = null;
                    }

                    var dataToSend = $.extend({}, functioDataToPaginate, paginate);

                    $.ajax({
                        data: dataToSend,
                        type: 'POST',
                        url: url,
                        success: function (html) {

                            // remove legenda da tela de aprovação
                            var inicioLeg = html.indexOf("<legenda>");
                            var fimLeg = html.indexOf("</legenda>");

                            if (inicioLeg > -1 && fimLeg > -1) {
                                var htmlLeg = html.substring(inicioLeg + 9, fimLeg);
                                html = html.replace(htmlLeg, "");
                            }
                            // fim

                            var inicio = html.indexOf("<tbody>");
                            var fim = html.indexOf("</tbody>");
                            var htmlTbody = html.substring(inicio + 7, fim);
                            var htmlNew = html.replace(htmlTbody, replaceHtmlAjax(htmlTbody));

                            if (inicio == -1 && fim == -1) {
                                htmlNew = html;
                            }
                            
                            $(container).empty().append(htmlNew);
                            //$("table tbody", $(container)).append();

                            if (dados.OrderBy != "") {
                                //var th = $(container).find("th:eq(" + dados.OrderBy + ")");
                                var th = $(container).find("th[data-order=" + dados.OrderBy + "]");
                                $(th).attr("data-direction", dados.OrderByDescending ? "DESC" : "ASC");

                                var span = $(this).find("span");

                                if ($(span).length == 0) {
                                    span = $("<span></span>");
                                    $(th).append($(span));
                                    if (dados.OrderByDescending) {
                                        $(span).addClass("SorterDesc");
                                    } else {
                                        $(span).addClass("SorterAsc");
                                    }
                                } else {
                                    if (dados.OrderByDescending == "DESC") {
                                        $(span).removeClass("SorterAsc").addClass("SorterDesc");
                                    } else {
                                        $(span).removeClass("SorterDesc").addClass("SorterAsc");
                                    }
                                }
                            }

                            var table = $(".ordenacao_ajax, .paginacao_ajax", $(container)).closest("table");
                            AplicaCorDasTabelas($(table));

                            CriarBindOrdenacao($(".ordenacao_ajax th"));

                            try {
                                AposOrdenar();
                            } catch (e) {

                            }
                            Votacao.Aguarde.Fechar();
                        },
                        error: function (erro) {
                            Votacao.Aguarde.Fechar();
                            Votacao.MessageBox.Aviso("Erro");
                        }
                    });
                }
            };
        }(),
        MessageBox: function () {
            return {
                Botoes: function () {
                    return {
                        Ocultar: function (identificador, textoDoBotao) {
                            $(".ui-dialog-buttonpane button:contains('" + textoDoBotao + "')", top.$("#" + identificador).closest(".ui-dialog")).hide();
                        },
                        Exibir: function (identificador, textoDoBotao) {
                            $(".ui-dialog-buttonpane button:contains('" + textoDoBotao + "')", top.$("#" + identificador).closest(".ui-dialog")).show();
                        },
                    };
                }(),
                Fechar: function (identificador, inFrame) {
                    if (inFrame == undefined || !inFrame) {
                        top.$('#' + identificador).dialog("close");
                    }
                    else {
                        $('#' + identificador).dialog("close");
                    }
                },
                FecharTodos: function ( ) {
                    $(".ui-dialog-content").dialog("close");
                },
                Aviso: function (mensagem, titulo, funcFechar, parms, funcOpen, botaoParam, width, height) {
                    if (titulo == "" || titulo == undefined) {
                        titulo = 'Atenção';
                    }

                    var dialog = new BootstrapDialog({
                        title: titulo,
                        message: mensagem,
                        buttons: [{
                            cssClass: 'btn-primary',
                            label: 'Fechar',
                            action: function (dialog) {
                                dialog.close();
                            },
                            //icon: 'glyphicon glyphicon-check',
                        }],
                        autodestroy: false,
                        onhidden: function (dialogRef) {
                            if (jQuery.isFunction(funcFechar)) {
                                funcFechar(parms);
                            }
                        }
                    });

                    $(dialog).find(".modal").css("overflow-y", "hidden");

                    dialog.open();
                },
                Modal: function (conteudo, titulo, funcOnClose, parms, funcOnOpen, botaoParam, width, height, funcOnClickBotaoFechar, identificador) {
                    
                    var guid = identificador == undefined ? NewGuid() : identificador;
                    
                    var divModal = $('<div class="ui-dialog-alert ui-dialog-default" id=\"{0}\"></div>'.replace("{0}", guid)).html([
                        "<div class=\"CondominioModal\" data-dialog=\"{0}\">",
                        conteudo,
                        "</div>"
                    ].join('').replace("{0}", guid)
                    );
                    
                    $(this.top).append(divModal);

                    if (titulo == "" || titulo == undefined) {
                        titulo = '';
                    }

                    var botoesFinal = $.extend({}, botaoParam);

                    var botaoFechar = {
                        Fechar: function () {
                            if (jQuery.isFunction(funcOnClickBotaoFechar)) {
                                funcOnClickBotaoFechar(parms);
                            }

                            $(divModal).dialog('close');
                            $(divModal).remove();
                        }
                    };

                    if (botaoParam != undefined) {
                        botoesFinal = $.extend({}, botaoFechar, botoesFinal);
                    } else {
                        botoesFinal = $.extend({}, botaoFechar);
                    }

                    var opcoes = {
                        autoOpen: true,
                        title: titulo,
                        modal: true,
                        position: 'center',
                        resizable: false,
                        disabled: true,
                        minWidth: width == undefined ? 400 : width,
                        height: height == undefined ? "auto" : height,
                        draggable: false,
                        closeOnEscape: false,
                        open: function () {
                            $(this).parent().children().children('.ui-dialog-titlebar-close').hide();

                            Votacao.Aguarde.Fechar();

                            if (jQuery.isFunction(funcOnOpen)) {
                                funcOnOpen(parms);
                            }
                        },
                        close: function () {
                            if (jQuery.isFunction(funcOnClose)) {
                                funcOnClose(parms);
                            }

                            //if (jQuery.isFunction(titulo)) {
                            //    titulo(parms);
                            //}

                            $(divModal).empty();
                            $(divModal).remove();
                        },
                        buttons: botoesFinal
                    };

                    if (width != undefined) {
                        opcoes = $.extend({}, opcoes, { Width: width });
                    }

                    $(divModal).dialog(opcoes);
                    AplicaCorDasTabelasCondominio($(".aplicarCoresModal"));

                    return guid;
                },
                Confirmacao: function (mensagem, titulo, funcSim, funcNao, funcFechar, parms, width, height) {
                    //var divConfirmacao = $('<div class="ui-dialog-alert ui-dialog-default"></div>').html([
                    //        "<div class=\"CondominioModal AvisoModal\"><p>",
                    //        mensagem,
                    //        "</p></div>"
                    //].join('')
                    //);
                    if (titulo == "" || titulo == undefined) {
                        titulo = 'Confirmação:';
                    }

                    //$(divConfirmacao).dialog({
                    //    autoOpen: true,
                    //    title: titulo,
                    //    modal: true,
                    //    //position: 'center',
                    //    resizable: false,
                    //    minWidth: 400,
                    //    Width: width == undefined ? 400 : width,
                    //    height: height == undefined ? "auto" : height,
                    //    disabled: true,
                    //    draggable: false,
                    //    closeOnEscape: false,
                    //    open: function (event, ui) {
                    //        $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
                    //    },
                    //    close: function () {
                    //        $(divConfirmacao).empty();
                    //        $(divConfirmacao).remove();
                    //    },
                    //    buttons: {
                    //        Sim: function () {
                    //            $(divConfirmacao).dialog('close');
                    //            $(divConfirmacao).remove();

                    //            if (jQuery.isFunction(funcSim)) {
                    //                funcSim(parms);
                    //            } else {
                    //                if (jQuery.isFunction(funcFechar)) {
                    //                    funcFechar(parms);
                    //                }

                    //                return true;
                    //            }

                    //            if (jQuery.isFunction(funcFechar)) {
                    //                funcFechar(parms);
                    //            }

                    //            return true;
                    //        },
                    //        "Não": function () {
                    //            $(divConfirmacao).dialog('close');
                    //            $(divConfirmacao).remove();

                    //            if (jQuery.isFunction(funcNao)) {
                    //                funcNao(parms);
                    //            } else {
                    //                if (jQuery.isFunction(funcFechar)) {
                    //                    funcFechar(parms);
                    //                }
                    //                return false;
                    //            }

                    //            if (jQuery.isFunction(funcFechar)) {
                    //                funcFechar(parms);
                    //            }

                    //            return false;
                    //        }
                    //    }
                    //});

                    new BootstrapDialog({
                        title: 'Confirmação',
                        message: mensagem,
                        closable: false,
                        //data: {
                        //    'callback': funcSim
                        //},
                        buttons: [{
                            label: 'Não',
                            action: function (dialog) {
                                //typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
                                if (jQuery.isFunction(funcNao)) {
                                    funcNao(parms);
                                }
                                dialog.close();
                            }
                        }, {
                            label: 'Sim',
                            cssClass: 'btn-primary',
                            action: function (dialog) {
                                //typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
                                if (jQuery.isFunction(funcSim)) {
                                    funcSim(parms);
                                }
                                dialog.close();
                            }
                        }]
                    }).open();

                },
                Salvar: function (mensagem, titulo, funcSalvar, funcCancelar, funcFechar, parms, width, height) {
                    var divConfirmacao = $('<div class="ui-dialog-alert ui-dialog-default"></div>').html([
                            "<div class=\"CondominioModal AvisoModal\">",
                            mensagem,
                            "</div>"
                    ].join('')
                    );
                    if (titulo == undefined) {
                        titulo = '';
                    }

                    $(divConfirmacao).dialog({
                        autoOpen: true,
                        title: titulo,
                        modal: true,
                        position: 'center',
                        resizable: false,
                        minWidth: width == undefined ? 420 : width,
                        disabled: true,
                        draggable: false,
                        closeOnEscape: false,
                        open: function (event, ui) {
                            //$(this).parent().children().children('.ui-dialog-titlebar-close').hide();
                        },
                        close: function () {
                            $(divConfirmacao).empty();
                            $(divConfirmacao).remove();
                        },
                        buttons: {
                            "Salvar": function () {
                                $(divConfirmacao).dialog('close');
                                $(divConfirmacao).remove();

                                if (jQuery.isFunction(funcSalvar)) {
                                    funcSalvar(parms);
                                } else {
                                    if (jQuery.isFunction(funcFechar)) {
                                        funcFechar(parms);
                                    }

                                    return true;
                                }

                                if (jQuery.isFunction(funcFechar)) {
                                    funcFechar(parms);
                                }
                            },
                            "Cancelar": function () {
                                $(divConfirmacao).dialog('close');
                                $(divConfirmacao).remove();

                                if (jQuery.isFunction(funcCancelar)) {
                                    funcCancelar(parms);
                                } else {
                                    if (jQuery.isFunction(funcFechar)) {
                                        funcFechar(parms);
                                    }
                                    return false;
                                }

                                if (jQuery.isFunction(funcFechar)) {
                                    funcFechar(parms);
                                }
                            }
                        }
                    });
                }
            };
        }(),
        Storage: function () {
            return {
                IsSupported: function () {
                    try {
                        return 'localStorage' in window && window['localStorage'] !== null;
                    } catch (e) {
                        return false;
                    }
                },
                Set: function (key, value, json) {
                    if (json != undefined) {
                        value = JSON.stringify(value);
                    }

                    localStorage.setItem(key, value);
                },
                Get: function (key, json) {
                    if (json != undefined) {
                        return JSON.parse(localStorage.getItem(key));
                    }
                    return localStorage.getItem(key);
                },
                Remove: function (key) {
                    return localStorage.removeItem(key);
                },
                Clear: function () {
                    localStorage.clear();
                }
            };
        }(),
        Elementos: function () {
            return {
                SetFocus: function (seletor) {
                    //parent.Votacao.Aguarde.Exibir(mensagem);
                }
            };
        }(),
        UI: function () {
            return {
                Div: function () {
                    return $('<div></div>', parent.document);
                },
                ShowJanelaMensagem: function (parametros, url, executaConsulta, width, height, showCopiarButton) {

                    var _W = 950;
                    if (width != undefined) {
                        _W = width;
                    }

                    var _H = 600;
                    if (height != undefined) {
                        _H = height;
                    }

                    var funcOnOpen = (function () {
                        top.inicializaCabecalhoMensagens();

                        Votacao.UI.DesabilitaBotaoModal('Copiar', true);

                        if (executaConsulta == undefined || executaConsulta == '') { executaConsulta = false; }

                        if (executaConsulta) {
                            top.executaPesquisa();
                            Votacao.Aguarde.Fechar();
                        }
                        else {
                            Votacao.Aguarde.Fechar();
                        }

                        if (parametros.metrCd != 0) {
                            Votacao.UI.DesabilitaBotaoModal('Salvar', true);
                        }

                    });


                    var buttons = {
                        "Salvar": function () {

                            Votacao.Aguarde.Exibir();

                            window.setTimeout(function () {
                                top.salvar();
                            }, 500);

                        },
                        "Nova Mensagem": function () {
                            top.novaMensagem();
                        },

                        "Copiar": function () {
                            top.copiarCamposMensagem();
                        }
                    };

                    Votacao.Util.Ajax.Post({
                        url: url,
                        data: JSON.stringify(parametros),
                        success: function (resultado) {

                            if (resultado.Sucesso) {

                                try {

                                    return parent.Votacao.MessageBox.Modal(
                                        resultado.Conteudo,
                                        'Mensagem Cliente (Ações do Cliente - Vendedor)',
                                        undefined,
                                        undefined,
                                        funcOnOpen,
                                        buttons,
                                        _W,
                                        _H,
                                        undefined,
                                        undefined
                                    );


                                } catch (e) {
                                    Votacao.MessageBox.Aviso("Ocorreu um erro durante o processamento desta requisição. Detalhes: " + e.message, 'Alerta!');
                                }
                            }
                            else {
                                Votacao.Aguarde.Fechar();
                                Votacao.MessageBox.Aviso(resultado.Mensagem, 'Erro');
                            }
                        },
                        error: function (erro) {
                            Votacao.Aguarde.Fechar();
                            Votacao.MessageBox.Aviso(erro, 'Erro');
                        }
                    });
                },
                DesabilitaBotaoModal: function (labelBotao, disabled) {

                    $(".ui-button-text", top.$(".ui-dialog-buttonset")).each(function () {

                        var _textBotao = $(this).text().toUpperCase().trim();
                        var _labelBotao = labelBotao.toUpperCase().trim();

                        if (_textBotao == _labelBotao) {

                            var _botao = $(this).closest('button');

                            if (disabled) { _botao.attr('disabled', 'disabled'); }
                            else { _botao.removeAttr('disabled'); }

                            return false;
                        }
                    });
                }
            };
        }(),
        Util: function () {
            return {
                PaginaAnterior: function () {
                    parent.PaginaAnterior();
                },
                Guid: function () {
                    return NewGuid().replace("-", "");
                },
                Altura: function () {
                    return $.getDocumentHeight();
                },
                StringFormat: function () {
                    var _string = arguments[0];
                    var _valores = arguments[1];
                    for (var i = 0; i < arguments[1].length; i++) {
                        _string = _string.replace('{' + i + '}', _valores[i]);
                    }
                    return _string;
                },
                Encript: function (value) {
                    var xorKey = 129;
                    var theRes = "";
                    for (var i = 0; i < value.length; ++i) {
                        theRes += String.fromCharCode(xorKey ^ value.charCodeAt(i));
                    }
                    return theRes;
                },
                Right: function (str, n) {
                    if (n <= 0)
                        return "";
                    else if (n > String(str).length)
                        return str;
                    else {
                        var iLen = String(str).length;
                        return String(str).substring(iLen, iLen - n);
                    }
                },
                IsNullOrEmpty: function (value) {
                    return value == undefined || value == null || value == "" || value == "null" || jQuery.trim(value) == "";
                },
                Write: function (value) {
                    return Votacao.Util.IsNullOrEmpty(value) ? "" : value;
                },
                Replace: function (string, token, newtoken, all) {

                    string = String(string);

                    if (string != null && string != undefined) {
                        if (all) {
                            while (string.indexOf(token) != -1) {
                                string = string.replace(token, newtoken);
                            }
                        }
                        else {
                            string = string.replace(token, newtoken);
                        }
                    }

                    if (string == undefined) {
                        string = '';
                    }

                    return string;
                },
                Ajax: function () {
                    function executeAjax(type, parms) {
                        if (parms.url == undefined) {
                            CondominioMobile.MessageBox.Aviso("O parâmetro 'parms.url' não pode ser nulo.");
                            return false;
                        }

                        var parameters = {
                            //contentType: parms.contentType == undefined ? 'application/x-www-form-urlencoded; charset=UTF-8' : parms.contentType,
                            contentType: parms.contentType == undefined ? 'application/json; charset=utf-8' : parms.contentType,
                            async: parms.async == undefined ? false : parms.async,
                            data: parms.data == undefined ? {} : parms.data,
                            cache: parms.cache == undefined ? false : parms.ajax
                        };

                        var returnValue = null;
                        $.ajax({
                            type: type,
                            url: parms.url,
                            data: parameters.data,
                            async: parameters.async,
                            cache: parameters.cache,
                            contentType: parameters.contentType,
                            success: function (data) {
                                if (jQuery.isFunction(parms.success)) {
                                    parms.success(data);
                                }

                                returnValue = data;
                            },
                            error: function (e) {
                                if (jQuery.isFunction(parms.error)) {
                                    parms.error(e);
                                } else {

                                    Votacao.Aguarde.Fechar();

                                    var iniPos = e.responseText.indexOf("<title>") + 7;
                                    var fimPos = e.responseText.indexOf("</title>");

                                    var erroMsg = e.responseText.slice(iniPos, fimPos);
                                    Votacao.MessageBox.Aviso("Ocorreu um erro durante o processamento desta requisição. Detalhes: " + erroMsg, 'Alerta!');
                                }
                            }
                        });

                        return returnValue == null ? false : returnValue;
                    }

                    return {
                        Get: function (parms) {
                            if (parms == undefined) {
                                Votacao.MessageBox.Aviso("O parâmetro 'parms' não pode ser nulo.");
                                return false;
                            }

                            return executeAjax("GET", parms);
                        },
                        Post: function (parms) {
                            if (parms == undefined) {
                                Votacao.MessageBox.Aviso("O parâmetro 'parms' não pode ser nulo.");
                                return false;
                            }

                            return executeAjax("POST", parms);
                        },
                    };
                }()
            };
        }(),
    };
}();



function RemoveUltimoCaracter(v) {
    var chars = v;
    chars = chars.substring(0, (chars.length - 1));
    return chars;
}

function IsNumberYes(v) {
    var validChars = "0123456789";
    var isNumber = true;
    var chars;

    for (var i = 0; i < v.length && isNumber == true; i++) {
        chars = v.charAt(i);
        if (validChars.indexOf(chars) == -1) {
            isNumber = false;
        }
    }
    return isNumber;
}

function AplicaCorDasTabelasCondominio(tabela) {
    $('tbody tr:even', $(tabela)).css('background', '#FFF');
    $('tbody tr:odd', $(tabela)).css('background', '#FDE9D9');
}

function replaceHtmlAjax(html) {
    if (html == undefined || html == "") {
        return "";
    }
    
    return html.replace(/th>\s+<th/g, 'th><th').replace(/td>\s+<td/g, 'td><td').replace(/\r\n/g, '').replace(/\s+/g, ' ');
};

function reIndex(tableSelector, element) {
    var tbody = $(tableSelector).find("tbody");
    var tr = $(element).closest("tr");
    var trs = $(tbody).find("tr");
    var name = $(tr).find("input[type!=radio]:first").attr("name");
    var index = getIndexByName(name);
    var count = 0;

    $(trs).each(function () {
        var input = $(this).find("input[type!=radio]:first");
        var trIndex = getIndexByName($(input).attr("name"));

        if (parseInt(trIndex) > parseInt(index)) {
            var inputs = $(this).find("input, select");
            var newIndex = parseInt(index) + parseInt(count);

            $(inputs).each(function () {
                var oldName = $(this).attr("name");
                //var oldID = $(this).attr("id");
                var newName = oldName.substring(0, oldName.indexOf("[") + 1) + newIndex + oldName.substring(oldName.indexOf("]"), oldName.length);

                $(this).attr("name", newName);
                
                //if (oldID) {
                //    var lastPosition = oldID.lastIndexOf("__");
                //    var beginPosition = oldID.lastIndexOf("_", lastPosition -1);
                //    var newID = oldID.substring(0, beginPosition + 1) + newIndex + oldID.substring(lastPosition, oldID.length);

                //    $(this).attr("id", newID);
                //}
            });
            count++;
        }
    });
}

function getIndexByName(name) {
    if (name == undefined || name == "") {
        return -1;
    }

    var start = name.indexOf("[") + 1;
    var end = name.indexOf("]");

    return name.substring(start, end);
}

function NewGuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

$.getDocumentHeight = function () {
    return Math.max(
        $(document).parent().height(),
        $(window).parent().height(),
        document.documentElement.clientHeight
    );
};

$.getDocumentWidth = function () {
    return Math.max(
        $(document).parent().width(),
        $(window).parent().width(),
        document.documentElement.clientWidth
    );
};

$.fn.ForceNumericOnly = function () {
    return this.each(function () {
        $(this).keydown(function (event) {
            if (!(!event.shiftKey //Disallow: any Shift+digit combination
                && !(event.keyCode < 48 || event.keyCode > 57) //Disallow: everything but digits
                || !(event.keyCode < 96 || event.keyCode > 105) //Allow: numeric pad digits
                || event.keyCode == 46 // Allow: delete
                || event.keyCode == 8  // Allow: backspace
                || event.keyCode == 9  // Allow: tab
                || event.keyCode == 27 // Allow: escape
                || event.keyCode == 13 // Allow: enter
                || (event.keyCode == 65 && (event.ctrlKey === true || event.metaKey === true)) // Allow: Ctrl+A
                || (event.keyCode == 67 && (event.ctrlKey === true || event.metaKey === true)) // Allow: Ctrl+C
                //Uncommenting the next line allows Ctrl+V usage, but requires additional code from you to disallow pasting non-numeric symbols
                || (event.keyCode == 86 && (event.ctrlKey === true || event.metaKey === true)) // Allow: Ctrl+Vpasting 
                || (event.keyCode >= 35 && event.keyCode <= 39) // Allow: Home, End
            )) {
                event.preventDefault();
            }
        });
    });
};



//$.widget("custom.autocompletewithheader", $.ui.autocomplete, {
//    // our fancy new _renderMenu function adds the header and footers!
//    _renderMenu: function (ul, items) {
//        var renderItemWithHead = function (ulHead, item) {
//            var partes = String(item.label).split('#|#');
//            var title = partes[0] + ' - ' + partes[1];
//            var linha = montarLinhaParaConsultaDeClientes(partes);

//            return $('<li style="z-index: 3;"></li>')
//                .data("item.autocomplete", item)
//                .append('<a class="ui-corner-all" title="' + title + '" style="z-index: 4;">' + linha + '</a>')
//                .appendTo(ulHead);
//        };
        
//        var montarLinhaParaConsultaDeClientes = (function (partes) {
//            if (partes.length == 1) {
//                return partes[0];
//            }

//            if (partes[1].length > 38) {
//                partes[1] = partes[1].substring(0, 38) + ' ...';
//            }

//            var opcaoDePesquisa = $('#OpcaoPesquisaCliente').val();

//            var tdCodigo = montarColunaParaConsultaDeClientes(50, partes[0], "", opcaoDePesquisa == "1");
//            var tdRazaoSocial = montarColunaParaConsultaDeClientes(270, partes[1], "", opcaoDePesquisa == "1");
//            var tdFantasia = montarColunaParaConsultaDeClientes(200, partes[2], "", opcaoDePesquisa == "1");
//            var tdCnpj = montarColunaParaConsultaDeClientes(100, partes[3], "", opcaoDePesquisa == "2");
//            var tdRota = montarColunaParaConsultaDeClientes(90, partes[5], "text_center");
//            var tdStatus = montarColunaParaConsultaDeClientes(90, partes[4], "text_center");
//            var tds = tdCodigo + tdRazaoSocial + tdFantasia + tdCnpj + tdRota + tdStatus;
//            var thead = montarCabecalhoColunaParaConsultaDeClientes();

//            return '<table style="width: 800px;border: solid 0px #FFF;"><tbody><tr>' + tds + '</tr></tbody></table>';
//        });

//        var montarColunaParaConsultaDeClientes = (function (largura, texto, classe, negrito) {
//            var cssBordas = 'border-collapse: collapse; border: solid 0px #FFF;' + 'width: ' + largura + 'px;';
//            var styleNegrito = ""; //negrito ? 'font-weight: bold; ' : "";
//            return '<td style="' + styleNegrito + cssBordas + '" class="' + classe + '">' + texto + '</td>';
//        });

//        var montarCabecalhoColunaParaConsultaDeClientes = (function () {
//            var titulos = ["Código", "Razão Social", "Nome Fantasia", "Cnpj", "Rota", "Status"];
//            var textAlign = ["center", "left", "left", "left", "center", "center"];
//            var largura = [43, 278, 200, 100, 90, 90];
//            var ths = "";

//            for (var i = 0; i < titulos.length; i++) {
//                ths += '<th style="width: ' + largura[i] + 'px; color: #666666; border: solid 0px #C0C0C0; text-align: ' + textAlign[i] + ';">' + titulos[i] + '</th>';
//            }

//            var head = [
//                         '<thead>',
//                         '<tr style="border-top: solid 1px #C0C0C0; border-left: solid 1px #C0C0C0; border-right: solid 1px #C0C0C0;">',
//                         '<th colspan="6" style="text-align: left; color: #666666; border: solid 0px #C0C0C0;">Pesquisa realizada por: <i>' + $('#srcCliente').attr("title").replace("Busca por ", "").replace("...", "").replace("/", " / ") + '</i></th>',
//                         '</tr>',
//                         '<tr  style="border-bottom: solid 1px #C0C0C0; border-left: solid 1px #C0C0C0; border-right: solid 1px #C0C0C0;">',
//                         ths,
//                         '</tr>',
//                         '</thead>'
//            ].join('');

//            return '<table style="width: 808px;border: solid 0px #FFF;">' + head + '</table>';
//        });

//        var self = this;
//        $.each(items, function(index, item) {
//            if (index == 0) {
//                ul.append('<li>' + montarCabecalhoColunaParaConsultaDeClientes( ) + '</li>');
//            }
            
//            renderItemWithHead(ul, item);

//            //if (index == items.length - 1) {
//            //    ul.append('<li><div style="width: 100%; margin: 5px; text-align: right;"><b>BUSCA FEITA POR: </b></div> </li>');
//            //}
//        });
//    }
//});

function MensagemAntecipacaoPedidos(data, funcClose) {
    var largura = 400;

    var msg = [
                "<label class='strong'>Qtde. Pedidos: </label>" + data.totalPedidos + "<br>",
                "<label class='strong'>Qtde. Antecipados: </label>" + data.totalAntecipados + "<br>",
                "<label class='strong'>Qtde. Não Antecipados: </label>" + data.totalFalha + "<br>"
    ].join('');

    if (data.listaNaoAntecipados.length > 0) {
        msg += [
                "<br>",
                "<center>",
                "<table class='tableparam Width100PorCento'>",
                "   <tr>",
                "       <th>Código Pedido</th>",
                "       <th>Código Cliente</th>",
                "       <th class='text_left'>Razão Social</th>",
                "       <th class='text_left'>Motivo</th>",
                "   </tr>"
        ].join('');

        $.each(data.listaNaoAntecipados, function (index, elem) {
            msg += [
                    "   <tr>",
                    "       <td>" + elem.CodPedido + "</td>",
                    "       <td>" + elem.CodCliente + "</td>",
                    "       <td class='text_left'>" + elem.Nome_Fantasia_Cliente + "</td>",
                    "       <td class='text_left'>" + elem.MotivoRejeicao + "</td>",
                    "   </tr>"
            ].join('');
        });

        msg += [
                "</table>",
                "</center>"
        ].join('');

        largura = 960;
    }

    var func = undefined;

    if (funcClose) {
        func = (function () { 
            Votacao.MessageBox.FecharTodos(); 
        });
    }

    Votacao.MessageBox.Aviso(msg, undefined, func, undefined, undefined, undefined, largura);
}

function AplicaCorDasTabelas(obj) {
    $('tbody tr:even', $(obj)).css('background-color', "#585858");
    $('tbody tr:odd', $(obj)).css('background-color', "#707070");
}