# 🌦️ CLIMA PRO 1.0

Esse foi meu primeiro projeto de previsão do tempo funcionando de verdade na web.
A ideia aqui foi sair da teoria e construir algo simples, mas que consome uma API real e entrega informação útil.

---

## 🔗 ACESSE O PROJETO

👉 https://etoffanin.github.io/Clima-Pro-1.0/

---

## 📸 PREVIEW

Versão no DeskTop
<<img width="1920" height="1037" alt="image" src="https://github.com/user-attachments/assets/5d051800-4db2-4344-b4db-598fcb433b2f" />
 />

Versão no Celular
<<img width="720" height="1600" alt="WhatsApp Image 2026-05-07 at 19 49 21" src="https://github.com/user-attachments/assets/efacda92-9942-4a1b-912e-7e9c700abb46" />
 />

*

---

## ✨ FUNCIONALIDADES

✔️ Busca de clima por cidade

✔️ Temperatura atual em tempo real

✔️ Condição do clima (ex: nublado, ensolarado)

✔️ Integração com API externa

✔️ Projeto online via GitHub Pages

✔️ Geolocalização automática


---

## 🧠 COMO FUNCIONA POR TRÁS

A lógica do projeto é:

1. O usuário digita o nome da cidade
2. O JavaScript captura esse valor
3. Faço uma requisição para a API usando `fetch`
4. Recebo os dados em JSON
5. Atualizo o HTML com as informações

Exemplo da requisição:

```javascript
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=SUA_API_KEY&units=metric`)
```

Depois disso, uso os dados retornados pra mostrar:

* temperatura
* clima
* informações principais

Tudo isso manipulando o DOM.

---

## 🛠️ TECNOLOGIAS UTILIZADAS

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* OpenWeather API
* Git & GitHub
---
## 🔥 DESAFIOS ENFRENTADOS

Durante o desenvolvimento enfrentei alguns desafios importantes, como:

* consumo de API no front-end
* tratamento de erros da requisição
* organização do código
* deploy utilizando GitHub Pages
* gerenciamento da chave da API
---

## 📚 O QUE EU TREINEI AQUI

Esse projeto foi importante pra praticar:

* consumo de API na prática
* manipulação de dados JSON
* atualização dinâmica da interface
* estruturação de um projeto front-end
* versionamento com Git

---

## ⚙️ COMO RODAR LOCALMENTE

```bash
git clone https://github.com/etoffanin/Clima-Pro-1.0.git
cd Clima-Pro-1.0
```

Depois é só abrir o arquivo **index.html** no navegador.

---

## 🚀 PRÓXIMA EVOLUÇÃO (2.0)

Quero evoluir esse projeto com:

* 🌙 Tema dinâmico (dia/noite)
* 📅 Previsão para vários dias
* 🎨 Interface mais moderna
* 📱 Melhor experiência no celular

---

## 📌 STATUS

✅ Concluído (v1.0)

🔄 Em evolução para versão 2.0

---

## 👨‍💻 SOBRE MIM

Meu nome é Enzo Toffanin e atualmente estou estudando Engenharia de Software.
Este projeto representa uma das minhas primeiras experiências práticas consumindo APIs e desenvolvendo aplicações web funcionais utilizando JavaScript, HTML e CSS.

---

Desenvolvido por Enzo Toffanin

