/**scanner */
let barcode = ''
let interval
document.addEventListener('keydown', function (e) {
    if (interval) {
        clearInterval(interval)
    }
    if (e.code == 'Enter') {
        if (barcode) {
            handleBarcode(barcode)
        }
        barcode = ''
        return
    }
    if (e.key = 'Shift') {
        barcode += e.key
    }
    interval = setInterval(() => barcode = '', 20)
})

function handleBarcode(scanner_barcode) {
    document.querySelector('#label-barcode').innerHTML = scanner_barcode
}
/**scanner */
/**traer data de la api */
document.querySelector('#search').addEventListener('click', function (e) {
    fetch('http://localhost:4550/api/')
        .then(response => response.json()) 
        .then(data => console.info(data))
        .catch(error => console.warn(error))
})
/**traer data de la api */

