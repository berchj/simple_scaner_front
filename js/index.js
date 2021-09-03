/**scanner */
let barcode = "";
let interval;
document.addEventListener("keydown", function (e) {
  if (interval) {
    clearInterval(interval);
  }
  if (e.code == "Enter") {
    if (barcode) {
      handleBarcode(barcode);
    }
    barcode = "";
    return;
  }
  if ((e.key = "Shift")) {
    barcode += e.key;
  }
  interval = setInterval(() => (barcode = ""), 20);
});

function handleBarcode(scanner_barcode) {
  document.querySelector("#label-barcode").value = scanner_barcode;
}
/**scanner */

/**traer data de la api */
document.querySelector("#search").addEventListener("click", function (e) {
  document.querySelector("#data").innerHTML = `<h4> - Loading...</h4>`;
  fetch("http://localhost:4550/api/buscar_pedido", {
    body: JSON.stringify({
      n_pedido: document.querySelector("#label-barcode").value.split('0')[1],
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      PrintData(data, document.querySelector("#data"));
    })
    .catch((error) => console.warn(error.message));    
});
/**traer data de la api */
/**funcion para imprimir la data */
function PrintData(response, element) {  
  if (response.data) {
    let orders = response.data;
    for (let i = 0; i < orders.length; i++) {
      let tpl = `
                        <p>DNI: ${orders[i]['DNI']}</p>
                        <p>NOMBRE: ${orders[i]['NOMBRE']}</p>
                        <p>MAIL: ${orders[i]['MAIL']}</p>
                        <p>PROVINCIA: ${orders[i]['PROVINCIA']}</p>
                        <p>DIRECCION: ${orders[i]['DIRECCION']}</p>
                    `;
      element.innerHTML = tpl;
    }
  } else if (response.error) {
    element.innerHTML = `<h4> - Error : order not found.</h4>`;
  }
}
/**funcion para imprimir la data */
