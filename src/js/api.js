const API_KEY = "921dffdcf9f45632fab536a0fc7a6850";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

let activeController = null;

function montarUrl(parametros) {
    const url = new URL(API_URL);

    url.search = new URLSearchParams({
        ...parametros,
        appid: API_KEY,
        lang: "pt_br",
        units: "metric"
    }).toString();

    return url.toString();
}

async function lerJson(resposta) {
    try {
        return await resposta.json();
    } catch {
        return null;
    }
}

function obterMensagemErro(status, dados) {
    const codigo = Number(dados?.cod || status);

    const mensagens = {
        401: "Chave da API inválida.",
        404: "Cidade não encontrada.",
        429: "Limite da API atingido. Tente novamente mais tarde."
    };

    return mensagens[codigo] || "Não foi possível buscar o clima agora.";
}

export function dadosClimaticosValidos(dados) {
    const clima = Array.isArray(dados?.weather)
        ? dados.weather[0]
        : null;

    const temperatura = dados?.main?.temp;
    const umidade = dados?.main?.humidity;

    return Boolean(
        dados &&
        dados.main &&
        clima && typeof clima === "object" &&
        Number.isFinite(temperatura) &&
        Number.isFinite(umidade) && umidade >= 0 && umidade <= 100
    );
}

export function cancelarRequisicaoAtiva() {
    if (!activeController) {
        return;
    }

    activeController.abort();
    activeController = null;
}

export async function buscarClima(parametros) {
    
    if (!API_KEY.trim()) {
        throw new Error("Chave da API não configurada.");
    }

    cancelarRequisicaoAtiva();

    const controller = new AbortController();
    activeController = controller;

    try {
        const resposta = await fetch(montarUrl(parametros), {
            signal: controller.signal
        });

        const dados = await lerJson(resposta);
        const codigoApi = Number(dados?.cod);

        if (!resposta.ok || (codigoApi && codigoApi !== 200)) {
            throw new Error(
                obterMensagemErro(resposta.status, dados)
            );
        }

        if (!dadosClimaticosValidos(dados)) {
            throw new Error("Dados do clima indisponíveis.");
        }

        return dados;

    } catch (erro) {
        if (erro.name === "AbortError") {
            throw erro;
        }

        if (erro instanceof TypeError) {
            throw new Error(
                "Falha de conexão. Verifique sua internet."
            );
        }

        throw erro;

    } finally {
        if (activeController === controller) {
            activeController = null;
        }
    }
}
