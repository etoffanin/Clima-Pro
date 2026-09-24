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
    registrarEventosBusca
} from "./ui.js";

import {
    obterLocalizacaoAtual
} from "./geolocation.js";

let identificadorBusca = 0;
let usuarioFezBuscaManual = false;
let appInicializado = false;
let cidadeEmBusca = null;

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

    const cidade = obterCidadeDigitada();

    if (cidade && cidade === cidadeEmBusca?.cidade) {
        return;
    }

    const buscaManual = cidade ? { cidade } : null;
    cidadeEmBusca = buscaManual;

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

    if (cidadeEmBusca === buscaManual) {
        cidadeEmBusca = null;
    }
}

async function buscarLocalizacaoInicial() {
    try {
        const {
            latitude,
            longitude
        } = await obterLocalizacaoAtual();

        /*
         * Evita que uma localização automática atrasada
         * sobrescreva uma cidade pesquisada manualmente.
         */
        if (usuarioFezBuscaManual) {
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
            "Localização não autorizada ou indisponível.",
            erro?.message || erro
        );
    }
}

function iniciarApp() {
    if (appInicializado || !inicializarUI()) {
        return;
    }

    appInicializado = true;

    registrarEventosBusca(buscarCidade);

    buscarLocalizacaoInicial();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarApp, { once: true });
} else {
    iniciarApp();
}
