class Inflacion{
    constructor(mes, estilo, kilometro, contado, cuotas) {
    this.mes = mes || 0
    this.estilo = estilo || 0
    this.kilometro = kilometro || 0
    this.contado = contado || 0
    this.cuotas = cuotas || 0

}
calcularTotal() {
    let total = parseFloat((this.mes * this.estilo * this.kilometro) - this.contado)
    total = total.toFixed(2)
    return parseFloat(total).toLocaleString("es-AR")
}
calcularCuota() {
    let total = parseFloat(((this.mes * this.estilo * this.kilometro) - this.contado) / this.cuotas)
    total = total.toFixed(2)
    return parseFloat(total).toLocaleString("es-AR")
}
}

