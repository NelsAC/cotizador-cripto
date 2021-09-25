import key from '../api.js';
const form = document.querySelector("#form");
const selectCripto = document.querySelector("#criptocurrency");
const selectMoneda = document.querySelector("#currency");
const mainDiv = document.querySelector("#main-currency");

const resultDiv = document.querySelector(".result");

const obtenerCriptomonedas = async () => {
  const response = await fetch(
    `https://min-api.cryptocompare.com/data/all/coinlist?api_key=${key}`
  );
  const { Data } = await response.json();
  return Data;
};

const agregarCriptomonedas = async () => {
  const criptomonedas = await obtenerCriptomonedas();

  for (const { Symbol, CoinName } of Object.values(criptomonedas)) {
    const option = document.createElement("option");
    option.value = Symbol;
    option.textContent = CoinName;
    selectCripto.appendChild(option);
  }
};

agregarCriptomonedas();

const obtenerResultado = async (moneda, criptomoneda) => {
  const response = await fetch(
    `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}&api_key=${key}`
  );
  const { RAW } = await response.json();
  mostrarResultado(RAW[criptomoneda][moneda]);
};

const mostrarResultado = (data) => {
  if (data) {
    document.querySelector(".spinner").style.display = "none";
    const { FROMSYMBOL, TOSYMBOL, PRICE, CHANGEPCTHOUR, LASTUPDATE } = data;
    const actualizado = new Date(LASTUPDATE * 1000).toLocaleDateString("es-PE");
    let templateHTML = `
            <h2 class="card-tittle">Resultado:</h2>
            <p>El precio de ${FROMSYMBOL} a moneda ${TOSYMBOL} es de: <span>${PRICE.toFixed(
      3
    )}</span></p>
            <p>Variación reciente: <span>%${CHANGEPCTHOUR.toFixed(3)}</span></p>
            <p>Útima actualización: <span>${actualizado}</span></p>
        `;
    resultDiv.innerHTML = templateHTML;
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelector(".spinner").style.display = "block";

  // Moneda y criptomoeda seleccionada
  const moneda = selectMoneda.value;
  const criptomoneda = selectCripto.value;
  mainDiv.classList.add("cotizando");
  obtenerResultado(moneda, criptomoneda);
});
