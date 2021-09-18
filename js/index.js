/**funcion para cargar las ordenes */
const load = async () => {
  const data = await fetch("http://localhost:4550/api/orders", {
    method: "GET",
    headers: {
      Authorization: `${sessionStorage.getItem("MyUniqueToken")}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};
/**funcion para cargar las ordenes */
/**imprimir ordenes */
const printOrder = (response) => {
  if (response.data) {
    let orders = response.data;
    for (let i = 0; i < orders.length; i++) {
      let tr = document.createElement("tr");
      tr.innerHTML = `
                  <td>
                   ${orders[i]["fecha_hora"]}
                  </td>    
                  <td>
                   ${orders[i]["col_nombre_scan"]}
                  </td>
                  <td>
                   ${orders[i]["num_pedido"]}
                  </td>    
                  <td>
                   ${orders[i]["consol"]}
                  </td>    
                  <td>
                   ${orders[i]["transporte"]}
                  </td>    
                  <td>
                   ${orders[i]["num_guia"]}
                  </td>    
                  <td>
                   ${orders[i]["peso"]}
                  </td>    
                  <td>
                   ${orders[i]["bulto"]}
                  </td>    
                  <td>
                   ${orders[i]["usuario"]}
                  </td>    
                
      `;
      document.querySelector("table tbody").appendChild(tr);
    }
  }
};
/**imprimir ordenes */
/**funcion para guardar la data */
const save = async () => {
  const data = await fetch("http://localhost:4550/api/save", {
    headers: {
      Authorization: `${sessionStorage.getItem("MyUniqueToken")}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      fecha_hora: document.querySelector("#fecha_hora").value,
      col_nombre_scan: document.querySelector("#col_nombre_scan").value,
      num_pedido: document.querySelector("#num_pedido").value,
      consol: document.querySelector("#consol").value,
      transporte: document.querySelector("#transporte").value,
      num_guia: document.querySelector("#num_guia").value,
      peso: document.querySelector("#peso").value,
      bulto: document.querySelector("#bulto").value,
      usuario: sessionStorage.getItem("user"),
    }),
  });
  return data;
};
/**funcion para guardar la data */
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
/**authorization */
const auth = async () => {
  const fetched = await fetch("http://localhost:4550/api/", {
    method: "GET",
    headers: {
      Authorization: `${sessionStorage.getItem("MyUniqueToken")}`,
      "Content-Type": "application/json",
    },
  });
  return fetched;
};
/**authorization */
/**funcion para imprimir la data */
function PrintData(response, element) {
  if (response.data) {
    let orders = response.data;
    for (let i = 0; i < orders.length; i++) {
      let tpl = `
      <table>
      <thead>
        <tr> 
          <th>Fecha - Hora</th>
          <th>Nombre scan</th>
          <th>Numero pedido</th>
          <th>Consol</th>
          <th>Transporte</th>
          <th>Numero guia</th>
          <th>Peso</th>
          <th>Bulto</th>
          <th>Usuario de scanner</th>
        </tr>
      </thead>
      <tbody>
          <tr>
              <td>
               <input id="fecha_hora" type="text" value="${new Date()}"> 
              </td>
              <td>
               <input id="col_nombre_scan" type="text" value="envio simple"> 
              </td>
              <td>
               <input id="num_pedido" type="text" value="${
                 orders[i]["PEDIDO"]
               }"> 
              </td>
              <td>
               <input id="consol" type="text" value="${orders[i]["CONSOL"]}"> 
              </td>
              <td>
               <input id="transporte" type="text" value="${
                 orders[i]["TRANSPORTE"]
               }"> 
              </td>
              <td>
               <input id="num_guia" type="text" value="${
                 orders[i]["NUMERO GUIA"]
               }"> 
              </td>
              <td>
               <input id="peso" type="text" value="${orders[i]["PESO"]}"> 
              </td>
              <td>
               <input id="bulto" type="text" value="B-1"> 
              </td>
              <td>
                <input id ="usuario" type="text" disabled value="${sessionStorage.getItem(
                  "user"
                )}"> 
              </td>
          </tr>
      </tbody>
  </table>
  <button id="save">save</button>
                `;
      element.innerHTML = tpl;
    }
  } else if (response.error) {
    element.innerHTML = `<h4> - Error : order not found.</h4>`;
  }
}
/**funcion para imprimir la data */
if (document.body.classList.contains("login")) {
  document.querySelector("#send").addEventListener("click", function (e) {
    e.preventDefault();
    let username = document.forms[0]["username"]["value"];
    let password = document.forms[0]["password"]["value"];
    login(username, password)
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          sessionStorage.setItem(
            "MyUniqueToken",
            JSON.stringify(data["token"])
          );
          if (sessionStorage.getItem("MyUniqueToken")) {
            window.location.replace("/views/scan.html");
          }
        } else {
          alert("invalid credentials");
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
      e.preventDefault();
      document.querySelector("#data").innerHTML = `<h4> - Loading...</h4>`;
      fetch("http://localhost:4550/api/buscar_pedido", {
        body: JSON.stringify({
          n_pedido: document
            .querySelector("#label-barcode")
            .value.slice(
              1,
              document.querySelector("#label-barcode").value.length
            ),
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${sessionStorage.getItem("MyUniqueToken")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          PrintData(data, document.querySelector("#data"));

          if (document.querySelector("#save")) {
            document
              .querySelector("#save")
              .addEventListener("click", function (e) {
                e.preventDefault();
                save()
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.message) {
                      if (document.querySelector("#data"))
                        document.querySelector("#data").innerHTML +=
                          data.message;
                    }
                  })
                  .catch((error) => console.error(error));
              });
          }
        })
        .catch((error) => console.warn(error.message));
    });
    /**traer data de la api */
    /**authorization */
    auth()
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) window.location.replace("/index.html");
        if (data.user) sessionStorage.setItem("user", data.user.name);
      })
      .catch((error) => {
        console.log(error);
      });
    /**authorization */
    /**logout */
    document.querySelector("#logout").addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.removeItem("MyUniqueToken");
      window.location.replace("/index.html");
    });
    /**logout */
  } else {
    window.location.replace("/index.html");
  }
}
if (document.body.classList.contains("orders")) {
  load()
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      printOrder(data);
    });
}
