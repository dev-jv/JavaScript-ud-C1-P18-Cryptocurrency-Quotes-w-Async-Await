const criptomonedasSelect = document.querySelector('#criptomonedas'); 
const formulario = document.querySelector("#formulario");
const monedaSelect = document.querySelector("#moneda");
const resultado = document.querySelector("#resultado");

objBusqueda = {
    moneda : '',
    criptomoneda : ''
}

//Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor)
})

async function consultarCriptomonedas() {

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    // fetch(url)
    //     .then( respuesta => respuesta.json())
    //     // .then( resultado => console.log(resultado.Data))
    //     .then( resultado => obtenerCriptomonedas(resultado.Data))
    //     // .then( criptomonedas => console.log(criptomonedas))
    //     .then( criptomonedas => selectedCriptomonedas(criptomonedas))

    try {
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        const criptomonedas = await obtenerCriptomonedas(resultado.Data)
        selectedCriptomonedas(criptomonedas)
    } catch (error) {
        console.log(error);
    }
}

function selectedCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        // console.log(cripto);
        const {FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    // console.log(objBusqueda);
}

function submitFormulario(e){
    e.preventDefault();

    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('All fields are requiered!');
        return;
    }

    consultarAPI();
}

function mostrarAlerta(msj) {
    // console.log(msj);

    const errorExistente = document.querySelector('.error');

    if(!errorExistente){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');

        divMensaje.textContent = msj;

        formulario.appendChild(divMensaje);

        setTimeout( () => {
            divMensaje.remove();
        }, 2345);
    }
}

async function consultarAPI() {
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    
    limpiarHTML();
    mostrarSpinner();
    // setTimeout( () => { // Sólo para lucir el spinner... 
        // fetch(url)
        // .then( respuesta => respuesta.json())
        // .then( cotizacion => 
        //     // console.log(cotizacion.DISPLAY[criptomoneda][moneda])
        //     mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        //     )
        try{
            const respuesta = await fetch(url)
            const cotizacion = await respuesta.json()
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        } catch {
            console.log(error);
        }
    // }, 3456); // También.. Network/Slow 3G

    
}

function mostrarCotizacionHTML(cotizacion) {
    // console.log(cotizacion);
    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es : <span>${PRICE}</span>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El Precio más alto del dia fue de : <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El Precio más bajo del dia fue de : <span>${LOWDAY}</span>`

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualización = document.createElement('p');
    ultimaActualización.innerHTML = `<p>Última Actualización <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualización);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    formulario.reset()
    const spinner = document.createElement('div');
    spinner.classList.add('spinner')

    spinner.innerHTML = `
        <div class="cube1"></div>
        <div class="cube2"></div>
    `;
    resultado.appendChild(spinner);
}

