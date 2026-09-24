const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: false,
    maximumAge: 600000,
    timeout: 10000
};

export function obterLocalizacaoAtual() {
    return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
            reject(
                new Error(
                    "Geolocalização não suportada neste navegador."
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
                reject(erro);
            },

            GEOLOCATION_OPTIONS
        );
    });
}