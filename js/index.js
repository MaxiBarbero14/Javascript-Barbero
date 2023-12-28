const URL = ("js/arraymeses.json")
const arraymeses = []
// ENLACE DOM A elementos HTML
const divDetalle = document.querySelector("div.panel-desgloce")
const divCotizar = document.querySelector("div.panel-cotizacion")
const selectFull = document.querySelector("select#modeloFull")
const selectOKM = document.querySelector("select#modeloOKM")
const mesElegido = document.querySelector("select#mesElegido")
const selectContado = document.querySelector("select#pagoContado")
const inputPlazo = document.querySelector("input#plazoPago")
const textoMensaje = document.querySelector("p.texto-verde")
const btnCalcular = document.querySelector("button.button-calcular")
const btnContratar = document.querySelector("button.button-contratar")
const tablaDesgloce = document.querySelector("table tbody")
const montoMasInteres = document.querySelector("td#montoMasInteres")

// LOGICA
// ARRAY 1
function cargarMes() {
    if (arraymeses.length) {
        arraymeses.forEach((periodo) => {
            if (periodo.mesde != undefined) {
                mesElegido.innerHTML += `<option>${periodo.mesde}</option>`
            }
        })
    }
}

function retornarInflacion(mesde) {
    let periodo = arraymeses.find((periodo) => periodo.mesde === mesde)
    return periodo.inflacion
}

// ARRAY 2
function cargarEstilo() {
    if (arraymeses.length) {
        arraymeses.forEach((estilo) => {
            if (estilo.modelo != undefined) {
                selectFull.innerHTML += `<option>${estilo.modelo}</option>`
            }
        })
    }
}
function retornarPrecio(modelo) {
    let estilo = arraymeses.find((estilo) => estilo.modelo === modelo)
    return estilo.precio

}

// ARRAY 3
function cargarKM() {
    if (arraymeses.length) {
        arraymeses.forEach((kilometro) => {
            if (kilometro.fecha != undefined) {
                selectOKM.innerHTML += `<option>${kilometro.fecha}</option>`
            }
        })
    }
}
function retornarAumento(fecha) {
    let kilometro = arraymeses.find((kilometro) => kilometro.fecha === fecha)
    return kilometro.aumento
}
// ARRAY 4
function cargarContado() {
    if (arraymeses.length) {
        arraymeses.forEach((beneficio) => {
            if (beneficio.pago != undefined) {
                selectContado.innerHTML += `<option>${beneficio.pago}</option>`
            }
        })
    }
}
function retornarDescuento(pago) {
    let beneficio = arraymeses.find((beneficio) => beneficio.pago === pago)
    return beneficio.descuento
}

function armarTotal(totalPagar, plazoEnMeses) {
    tablaDesgloce.innerHTML = ""
    for (let i = 1; i <= plazoEnMeses; i++) {
        tablaDesgloce.innerHTML += `<tr>
                                            <td>${i}</td>
                                            <td>Dia 7 de cada mes</td>
                                            <td class="texto-derecha">$ ${totalPagar}</td>
                                        </tr>`
    }
}

// localStorage
function guardarEnLS(mes, estilo, kilometro, contado, plazo) {
    localStorage.setItem("MesElegido", JSON.stringify(mes))
    localStorage.setItem("EstiloElegido", JSON.stringify(estilo))
    localStorage.setItem("KMElegido", JSON.stringify(kilometro))
    localStorage.setItem("FormaPago", JSON.stringify(contado))
    localStorage.setItem("PlazoEnMeses", JSON.stringify(plazo))

}

function recuperarDeLS() {
    mesElegido.value = JSON.parse(localStorage.getItem("MesElegido")) || "Elige aqui."
    selectFull.value = JSON.parse(localStorage.getItem("EstiloElegido")) || "Elege aqui."
    selectOKM.value = JSON.parse(localStorage.getItem("KMElegido")) || "Elige aqui."
    selectContado.value = JSON.parse(localStorage.getItem("FormaPago")) || "Elige aqui."
    inputPlazo.value = JSON.parse(localStorage.getItem("plazoEnMeses")) || "12"
}

function obtenerMes() {
    fetch(URL)
        .then((response) => response.json())
        .then((data) => arraymeses.push(...data))
        .then(() => cargarMes())
        .then(() => cargarEstilo())
        .then(() => cargarKM())
        .then(() => cargarContado())
}

// calculo
function calcularValor() {
    let mesSolicitado = retornarInflacion(mesElegido.value)
    let modeloSolicitado = retornarPrecio(selectFull.value)
    let kilometroSolicitado = retornarAumento(selectOKM.value)
    let beneficioSolicitado = retornarDescuento(selectContado.value)
    let plazoEnMeses = parseInt(inputPlazo.value)

    const total = new Inflacion(mesSolicitado, modeloSolicitado, kilometroSolicitado, beneficioSolicitado, plazoEnMeses)
    let totalPagar = total.calcularCuota()


    // enlace con html
    const spanMes = document.querySelector("span.label-mes")
    const spanModelo = document.querySelector("span.label-modelo")
    const spanKilometro = document.querySelector("span.label-kilometro")
    const spanDescuento = document.querySelector("span.label-descuento")
    const spanPlazo = document.querySelector("span.label-plazo")

    // cargamos los datos a visualizar como confirmacion de compra
    spanMes.textContent = mesElegido.value
    spanModelo.textContent = selectFull.value
    spanKilometro.textContent = selectOKM.value
    spanDescuento.textContent = selectContado.value
    spanPlazo.textContent = total.plazo

    guardarEnLS(mesElegido.value, selectFull.value, selectOKM.value, selectContado.value, total.plazo)

    // total
    armarTotal(totalPagar, plazoEnMeses)
    montoMasInteres.textContent = `${((total.mes * total.estilo * total.kilometro) - total.contado)}`



    // intercambiamos lo visual de paneles div
    divDetalle.classList.add("ocultar-panel")
    divCotizar.classList.remove("ocultar-panel")

}

// EVENTOS
btnCalcular.addEventListener("click", () => calcularValor())


btnContratar.addEventListener("click", () => {
    let timerInterval;
    Swal.fire({
        title: "Gracias por su compra.",
        html: "Pronto un vendedor hablara con usted.",
        icon: "success",
        timer: 6000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
        }
    })
    localStorage.clear()

    setTimeout(() => {
        location.href = "index.html"
    }, 6000)
}
)


// funciones principales
obtenerMes()
recuperarDeLS()

