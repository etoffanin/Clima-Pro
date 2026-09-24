let elementos = {};
let uiInicializada = false;
let eventosRegistrados = false;

function obterElementos() {
    return {
        inputCidade: document.querySelector(".input-cidade"),
        botaoBusca: document.querySelector(".search-button"),
        cidade: document.querySelector(".cidade"),
        temperatura: document.querySelector(".temp"),
        previsao: document.querySelector(".texto-previsao"),
        umidade: document.querySelector(".umidade"),
        icone: document.querySelector(".img-previsao"),
        weatherContent: document.querySelector(".weather-content")
    };
}

function atualizarTexto(elemento, texto) {
    if (elemento) {
        elemento.textContent = texto;
    }
}

function esconderIcone() {
    const { icone } = elementos;

    if (!icone) {
        return;
    }

    icone.hidden = true;
    icone.removeAttribute("src");
    icone.alt = "Ícone do clima";
}

function mostrarIcone(codigo, descricao) {
    const { icone } = elementos;

    if (!icone || !codigo) {
        esconderIcone();
        return;
    }

    icone.src =
        `https://openweathermap.org/img/wn/${encodeURIComponent(codigo)}@2x.png`;

    icone.alt = descricao
        ? `Ícone do clima: ${descricao}`
        : "Ícone do clima";

    icone.hidden = false;
}

export function inicializarUI() {
    if (uiInicializada) {
        return true;
    }

    elementos = obterElementos();
    const obrigatorios = [
        elementos.inputCidade,
        elementos.botaoBusca,
        elementos.cidade,
        elementos.temperatura,
        elementos.previsao,
        elementos.umidade,
        elementos.weatherContent
    ];

    if (obrigatorios.some((elemento) => !elemento)) {
        console.error(
            "Clima Pro não pôde iniciar: elementos obrigatórios não foram encontrados."
        );

        return false;
    }

    esconderIcone();

    elementos.icone?.addEventListener(
        "error",
        esconderIcone
    );

    uiInicializada = true;
    return true;
}

export function mostrarCarregamento(
    mensagem = "Buscando cidade..."
) {
    atualizarTexto(elementos.cidade, mensagem);
    atualizarTexto(elementos.temperatura, "--°C");
    atualizarTexto(elementos.previsao, "Carregando...");
    atualizarTexto(elementos.umidade, "Umidade: --%");

    esconderIcone();

    elementos.weatherContent.classList.add("loading");
    elementos.weatherContent.setAttribute(
        "aria-busy",
        "true"
    );

    elementos.botaoBusca.disabled = true;
}

export function removerCarregamento() {
    elementos.weatherContent.classList.remove("loading");
    elementos.weatherContent.removeAttribute("aria-busy");

    elementos.botaoBusca.disabled = false;
}

export function mostrarErro(mensagem) {
    atualizarTexto(elementos.cidade, mensagem);
    atualizarTexto(elementos.temperatura, "--°C");
    atualizarTexto(elementos.previsao, "---");
    atualizarTexto(elementos.umidade, "Umidade: --%");

    esconderIcone();

    elementos.weatherContent.classList.remove("show");
}

export function renderizarClima(dados) {
    const clima = dados.weather[0];

    const nomeCidade =
        dados.name || "sua localização";

    const descricao =
        clima.description || "---";

    atualizarTexto(
        elementos.cidade,
        `Tempo em ${nomeCidade}`
    );

    atualizarTexto(
        elementos.temperatura,
        `${Math.floor(Number(dados.main.temp))}°C`
    );

    atualizarTexto(
        elementos.previsao,
        descricao
    );

    atualizarTexto(
        elementos.umidade,
        `Umidade: ${dados.main.humidity}%`
    );

    mostrarIcone(
        clima.icon,
        descricao
    );

    elementos.weatherContent.classList.add("show");
}

export function obterCidadeDigitada() {
    return elementos.inputCidade.value.trim();
}

export function limparCampoCidade() {
    elementos.inputCidade.value = "";
}

export function focarCampoCidade() {
    elementos.inputCidade.focus();
}

export function registrarEventosBusca(callback) {
    if (eventosRegistrados || !uiInicializada) {
        return;
    }

    eventosRegistrados = true;
    elementos.botaoBusca.addEventListener(
        "click",
        callback
    );

    elementos.inputCidade.addEventListener(
        "keydown",
        (evento) => {
            if (evento.key !== "Enter" || evento.repeat || evento.isComposing) {
                return;
            }

            evento.preventDefault();
            callback();
        }
    );
}
