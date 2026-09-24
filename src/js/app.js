import {
    buscarClima,
    cancelarRequisicaoAtiva
} from "./api.js";

import {
    inicializarUI,
    mostrarCarregamento,
    removerCarregamento,
    mostrarErro,
    renderizarClima,
    obterCidadeDigitada,
    limparCampoCidade,
    focarCampoCidade,
    registrarEventosBusca,
    mostrarFeedback,
    esconderFeedback,
    definirLocalizacaoCarregando,
    registrarEventoLocalizacao
} from "./ui.js";

import {
    obterLocalizacaoAtual
} from "./geolocation.js";


let identificadorBusca = 0;
let usuarioFezBuscaManual = false;
let localizacaoEmAndamento = false;
let appInicializado = false;


async function carregarClima(
    parametros,
    mensagemCarregamento,
    limparBusca = false
) {
    const buscaAtual = ++identificadorBusca;

    mostrarCarregamento(mensagemCarregamento);

    try {
        const dados = await buscarClima(parametros);

        if (buscaAtual !== identificadorBusca) {
            return;
        }

        renderizarClima(dados);

        if (limparBusca) {
            limparCampoCidade();
        }

    } catch (erro) {
        if (erro.name === "AbortError") {
            return;
        }

        if (buscaAtual !== identificadorBusca) {
            return;
        }

        console.error(erro);

        mostrarErro(
            erro.message ||
            "Erro ao buscar dados do clima."
        );

    } finally {
        if (buscaAtual === identificadorBusca) {
            removerCarregamento();
        }
    }
}


async function buscarCidade() {
    usuarioFezBuscaManual = true;

    esconderFeedback();

    const cidade = obterCidadeDigitada();

    if (!cidade) {
        identificadorBusca++;

        cancelarRequisicaoAtiva();
        removerCarregamento();

        mostrarErro("Digite uma cidade.");
        focarCampoCidade();

        return;
    }

    await carregarClima(
        {
            q: cidade
        },
        "Buscando cidade...",
        true
    );
}


async function buscarPorLocalizacao({
    automatica = false
} = {}) {
    if (localizacaoEmAndamento) {
        return;
    }

    localizacaoEmAndamento = true;

    esconderFeedback();
    definirLocalizacaoCarregando(true);

    try {
        const {
            latitude,
            longitude
        } = await obterLocalizacaoAtual();

        /*
         * Se o usuário pesquisou manualmente enquanto
         * a localização automática estava sendo obtida,
         * não sobrescrevemos a pesquisa dele.
         */
        if (automatica && usuarioFezBuscaManual) {
            return;
        }

        await carregarClima(
            {
                lat: latitude,
                lon: longitude
            },
            "Buscando sua localização..."
        );

    } catch (erro) {
        console.warn(
            "Falha na geolocalização:",
            erro
        );

        mostrarFeedback(
            erro.message ||
            "Não foi possível obter sua localização."
        );

    } finally {
        localizacaoEmAndamento = false;

        definirLocalizacaoCarregando(false);
    }
}


function iniciarApp() {
    if (
        appInicializado ||
        !inicializarUI()
    ) {
        return;
    }

    appInicializado = true;

    registrarEventosBusca(buscarCidade);

    registrarEventoLocalizacao(() => {
        buscarPorLocalizacao();
    });

    buscarPorLocalizacao({
        automatica: true
    });
}


iniciarApp();