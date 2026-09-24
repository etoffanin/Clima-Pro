const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: false,
    maximumAge: 600000,
    timeout: 10000
};

function normalizarErroGeolocalizacao(erro) {
    switch (erro?.code) {
        case 1:
            return new Error("Acesso à localização não autorizado.");

        case 2:
            return new Error("Não foi possível determinar sua localização.");

        case 3:
            return new Error("A localização demorou muito para responder.");

        default:
            return new Error("Não foi possível obter sua localização.");
    }
}

export function obterLocalizacaoAtual() {
    return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
            reject(
                new Error(
                    "Geolocalização não disponível neste navegador."
                )
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                resolve({
                    latitude: posicao.coords.latitude,
                    longitude: posicao.coords.longitude
                });
            },

            (erro) => {
                reject(
                    normalizarErroGeolocalizacao(erro)
                );
            },

            GEOLOCATION_OPTIONS
        );
    });
}