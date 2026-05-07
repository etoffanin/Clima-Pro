const key = "921dffdcf9f45632fab536a0fc7a6850";

function ColocarDadosNaTela(dados) {
    document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name;
    document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + "°C";
    document.querySelector(".texto-previsao").innerHTML = dados.weather[0].description;
    document.querySelector(".umidade").innerHTML = "Umidade: " + dados.main.humidity + "%";

    document.querySelector(".img-previsao").src =
        `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;
}

// Buscar por nome da cidade
async function buscarCidade(cidade) {
    if (!cidade) {
        alert("Digite uma cidade!");
        return;
    }

    try {
        const resposta = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`);

        const dados = await resposta.json();

        if (dados.cod === "404") {
            alert("Cidade não encontrada!");
            return;
        }

        if (dados.cod === 401) {
            alert("Chave da API inválida!");
            return;
        }

        ColocarDadosNaTela(dados);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao buscar dados.");
    }
}
// Busca por coordenadas (localização)
async function buscarPorCoordenadas(lat, lon) {
    try {
        const resposta = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=pt_br&units=metric`
        );

        const dados = await resposta.json();
        ColocarDadosNaTela(dados);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao obter localização.");
    }
}

// Pegar localização automática
function pegarLocalizacao() {
    if (!navigator.geolocation) {
        console.warn("Geolocalização não suportada");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (posicao) => {
            const lat = posicao.coords.latitude;
            const lon = posicao.coords.longitude;
            buscarPorCoordenadas(lat, lon);
        },
        () => {
            console.warn("Usuário negou localização");
        }
    );
}

//Clique no botão
function cliqueiNoBotao() {
    const cidade = document.querySelector(".input-cidade").value.trim();
    buscarCidade(cidade);
}

//Buscar ao pressionar ENTER
document.querySelector(".input-cidade").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        cliqueiNoBotao();
    }
});

//Executa ao carregar a página
pegarLocalizacao();