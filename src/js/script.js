(() => {
    // Em GitHub Pages o projeto é front-end puro; por isso a chave fica visível no navegador.
    const API_KEY = "921dffdcf9f45632fab536a0fc7a6850";
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";

    const inputCidade = document.querySelector(".input-cidade");
    const botaoBusca = document.querySelector(".search-button");
    const cidadeElemento = document.querySelector(".cidade");
    const temperaturaElemento = document.querySelector(".temp");
    const previsaoElemento = document.querySelector(".texto-previsao");
    const umidadeElemento = document.querySelector(".umidade");
    const iconeElemento = document.querySelector(".img-previsao");
    const weatherContent = document.querySelector(".weather-content");

    let activeRequest = null;

    function elementoExiste(elemento, seletor) {
        if (!elemento) {
            console.warn(`Elemento não encontrado no HTML: ${seletor}`);
            return false;
        }

        return true;
    }

    function appPodeIniciar() {
        return [
            elementoExiste(inputCidade, ".input-cidade"),
            elementoExiste(botaoBusca, ".search-button"),
            elementoExiste(cidadeElemento, ".cidade"),
            elementoExiste(temperaturaElemento, ".temp"),
            elementoExiste(previsaoElemento, ".texto-previsao"),
            elementoExiste(umidadeElemento, ".umidade"),
            elementoExiste(weatherContent, ".weather-content")
        ].every(Boolean);
    }

    function atualizarTexto(elemento, texto) {
        if (elemento) {
            elemento.textContent = texto;
        }
    }

    function esconderIcone() {
        if (!iconeElemento) {
            return;
        }

        iconeElemento.hidden = true;
        iconeElemento.removeAttribute("src");
        iconeElemento.alt = "Ícone do clima";
    }

    function mostrarIcone(codigoIcone, descricao) {
        if (!iconeElemento || !codigoIcone) {
            esconderIcone();
            return;
        }

        iconeElemento.src = `https://openweathermap.org/img/wn/${encodeURIComponent(codigoIcone)}@2x.png`;
        iconeElemento.alt = descricao ? `Ícone do clima: ${descricao}` : "Ícone do clima";
        iconeElemento.hidden = false;
    }

    function mostrarCarregamento(mensagem = "Buscando cidade...") {
        atualizarTexto(cidadeElemento, mensagem);
        atualizarTexto(temperaturaElemento, "--°C");
        atualizarTexto(previsaoElemento, "Carregando...");
        atualizarTexto(umidadeElemento, "Umidade: --%");
        esconderIcone();

        weatherContent?.classList.add("loading");

        if (botaoBusca) {
            botaoBusca.disabled = true;
        }
    }

    function removerCarregamento() {
        weatherContent?.classList.remove("loading");

        if (botaoBusca) {
            botaoBusca.disabled = false;
        }
    }

    function mostrarErro(mensagem) {
        atualizarTexto(cidadeElemento, mensagem);
        atualizarTexto(temperaturaElemento, "--°C");
        atualizarTexto(previsaoElemento, "---");
        atualizarTexto(umidadeElemento, "Umidade: --%");
        esconderIcone();
        weatherContent?.classList.remove("show");
    }

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

    function mensagemErroApi(status, dados) {
        const codigo = Number(dados?.cod || status);

        if (codigo === 401) {
            return "Chave da API inválida.";
        }

        if (codigo === 404) {
            return "Cidade não encontrada.";
        }

        if (codigo === 429) {
            return "Limite da API atingido. Tente novamente mais tarde.";
        }

        return "Não foi possível buscar o clima agora.";
    }

    function erroDeConexao(erro) {
        return (
            erro instanceof TypeError ||
            erro?.name === "TypeError" ||
            /failed to fetch|network/i.test(erro?.message || "")
        );
    }

    function dadosValidos(dados) {
        const clima = Array.isArray(dados?.weather) ? dados.weather[0] : null;
        const temperatura = Number(dados?.main?.temp);
        const umidade = Number(dados?.main?.humidity);

        return Boolean(
            dados &&
            dados.main &&
            clima &&
            Number.isFinite(temperatura) &&
            Number.isFinite(umidade)
        );
    }

    async function lerJson(resposta) {
        try {
            return await resposta.json();
        } catch (erro) {
            return null;
        }
    }

    function cancelarBuscaAnterior() {
        if (activeRequest) {
            activeRequest.abort();
            activeRequest = null;
        }
    }

    async function buscarClima(parametros, mensagemCarregamento) {
        if (!API_KEY) {
            throw new Error("Chave da API não configurada.");
        }

        cancelarBuscaAnterior();

        const controller = new AbortController();
        activeRequest = controller;
        mostrarCarregamento(mensagemCarregamento);

        try {
            const resposta = await fetch(montarUrl(parametros), {
                signal: controller.signal
            });
            const dados = await lerJson(resposta);
            const codigoApi = Number(dados?.cod);

            if (!resposta.ok || (codigoApi && codigoApi !== 200)) {
                throw new Error(mensagemErroApi(resposta.status, dados));
            }

            if (!dadosValidos(dados)) {
                throw new Error("Dados do clima indisponíveis.");
            }

            return dados;
        } catch (erro) {
            if (erro.name === "AbortError") {
                return null;
            }

            throw erro;
        } finally {
            if (activeRequest === controller) {
                activeRequest = null;
                removerCarregamento();
            }
        }
    }

    function colocarDadosNaTela(dados) {
        if (!dadosValidos(dados)) {
            mostrarErro("Dados do clima indisponíveis.");
            return;
        }

        const clima = dados.weather[0];
        const nomeCidade = dados.name || "sua localização";
        const descricao = clima.description || "---";

        atualizarTexto(cidadeElemento, `Tempo em ${nomeCidade}`);
        atualizarTexto(temperaturaElemento, `${Math.floor(Number(dados.main.temp))}°C`);
        atualizarTexto(previsaoElemento, descricao);
        atualizarTexto(umidadeElemento, `Umidade: ${dados.main.humidity}%`);
        mostrarIcone(clima.icon, descricao);

        weatherContent?.classList.add("show");

        if (inputCidade) {
            inputCidade.value = "";
        }
    }

    function tratarErroBusca(erro) {
        const mensagem = erroDeConexao(erro)
            ? "Falha de conexão. Verifique sua internet."
            : erro.message || "Erro ao buscar dados do clima.";

        console.error(erro);
        mostrarErro(mensagem);
    }

    async function buscarCidade(cidade) {
        const cidadeTratada = String(cidade || "").trim();

        if (!cidadeTratada) {
            cancelarBuscaAnterior();
            removerCarregamento();
            mostrarErro("Digite uma cidade.");
            inputCidade?.focus();
            return;
        }

        try {
            const dados = await buscarClima(
                { q: cidadeTratada },
                "Buscando cidade..."
            );

            if (dados) {
                colocarDadosNaTela(dados);
            }
        } catch (erro) {
            tratarErroBusca(erro);
        }
    }

    async function buscarPorCoordenadas(lat, lon) {
        const latitude = Number(lat);
        const longitude = Number(lon);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            console.warn("Coordenadas inválidas.");
            return;
        }

        try {
            const dados = await buscarClima(
                { lat: latitude, lon: longitude },
                "Buscando sua localização..."
            );

            if (dados) {
                colocarDadosNaTela(dados);
            }
        } catch (erro) {
            tratarErroBusca(erro);
        }
    }

    function pegarLocalizacao() {
        if (!("geolocation" in navigator)) {
            console.warn("Geolocalização não suportada neste navegador.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                buscarPorCoordenadas(
                    posicao.coords.latitude,
                    posicao.coords.longitude
                );
            },
            (erro) => {
                console.warn("Localização não autorizada ou indisponível.", erro.message);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 600000,
                timeout: 10000
            }
        );
    }

    function cliqueiNoBotao() {
        buscarCidade(inputCidade?.value);
    }

    function buscarComEnter(evento) {
        if (evento.key === "Enter") {
            evento.preventDefault();
            cliqueiNoBotao();
        }
    }

    function iniciarApp() {
        if (!appPodeIniciar()) {
            return;
        }

        esconderIcone();

        if (iconeElemento) {
            iconeElemento.addEventListener("error", esconderIcone);
        }

        botaoBusca.addEventListener("click", cliqueiNoBotao);
        inputCidade.addEventListener("keydown", buscarComEnter);
        pegarLocalizacao();
    }

    window.cliqueiNoBotao = cliqueiNoBotao;
    window.buscarCidade = buscarCidade;
    window.buscarPorCoordenadas = buscarPorCoordenadas;
    window.pegarLocalizacao = pegarLocalizacao;
    window.colocarDadosNaTela = colocarDadosNaTela;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarApp);
    } else {
        iniciarApp();
    }
})();