if (document.body.classList.contains("login")) {
  document.querySelector("#send").addEventListener("click", function (e) {
    e.preventDefault();
    let username = document.forms[0]["username"]["value"];
    let password = document.forms[0]["password"]["value"];
    login(username, password)
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem("MyUniqueToken", JSON.stringify(data["token"]));
        if (sessionStorage.getItem("MyUniqueToken")) {
          window.location.replace("/views/scan.html");
        }
      })
      .catch((error) => console.log(error));
  });
}
/**login */
/**scanner */
if (document.body.classList.contains("scanner")) {
  if (sessionStorage.getItem("MyUniqueToken")) {
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
          n_pedido: document
            .querySelector("#label-barcode")
            .value.split("0")[1],
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
                        <p>DNI: ${orders[i]["DNI"]}</p>
                        <p>NOMBRE: ${orders[i]["NOMBRE"]}</p>
                        <p>MAIL: ${orders[i]["MAIL"]}</p>
                        <p>PROVINCIA: ${orders[i]["PROVINCIA"]}</p>
                        <p>DIRECCION: ${orders[i]["DIRECCION"]}</p>
                    `;
          element.innerHTML = tpl;
        }
      } else if (response.error) {
        element.innerHTML = `<h4> - Error : order not found.</h4>`;
      }
    }
    /**funcion para imprimir la data */
  }else{
    window.location.replace('/views/login.html')
  }
}
/**login */
const login = async (username, password) => {
  const data = await fetch("http://localhost:4550/api/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });
  return data;
};
