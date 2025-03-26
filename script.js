document.addEventListener("DOMContentLoaded", () => {
  // Seleccionamos el botón de la pantalla anterior
  const btnSiguiente1 = document.getElementById("btn-Siguiente1");

  // Si el botón existe en la página, añadimos el evento
  if (btnSiguiente1) {
      btnSiguiente1.addEventListener("click", () => {
          // Redirigir a la nueva pantalla de consulta
          window.location.href = "consulta.html"; // Asegúrate de que la ruta sea correcta
      });
  }
});

let rowCount = 1;

function addRow() {
    rowCount++;
    
    const tableBody = document.querySelector("#dynamic-table tbody");
    
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td class="number">${rowCount}</td>
        <td>
            <select>
                <option selected disabled>Selecciona una opció</option>
                <option>Opción 1</option>
                <option>Opción 2</option>
            </select>
        </td>
        <td>
            <select>
                <option selected disabled>Selecciona una opció</option>
                <option>Opción A</option>
                <option>Opción B</option>
            </select>
        </td>
    `;

    tableBody.appendChild(newRow);
}

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("btn-altres").addEventListener("click", function() {
        window.location.href = "altres.html";
    });
});





document.addEventListener("DOMContentLoaded", function() {
    const selectCategoria = document.getElementById("categoria");
    const selectTipus = document.getElementById("tipus");
    const btnSeguent = document.getElementById("seguent");

    // Opciones predefinidas
    const categorias = ["Consulta", "Urgència", "Especialista", "Seguiment"];
    const tipusGestio = {
        "Consulta": ["Mèdic de família", "Infermeria", "Administratiu"],
        "Urgència": ["Hospital", "CAP", "SAMU"],
        "Especialista": ["Cardiologia", "Traumatologia", "Pediatria"],
        "Seguiment": ["Rehabilitació", "Nutricionista", "Psicòleg"]
    };

    // Llenar las opciones de categorización
    categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });

    // Evento al cambiar categorización
    selectCategoria.addEventListener("change", function() {
        selectTipus.innerHTML = '<option value="">Selecciona una opció</option>'; // Resetear opciones
        const categoriaSeleccionada = selectCategoria.value;
        
        if (categoriaSeleccionada) {
            selectTipus.disabled = false;
            tipusGestio[categoriaSeleccionada].forEach(tipus => {
                const option = document.createElement("option");
                option.value = tipus;
                option.textContent = tipus;
                selectTipus.appendChild(option);
            });
        } else {
            selectTipus.disabled = true;
        }
    });

    // Evento del botón "Siguiente"
    btnSeguent.addEventListener("click", function() {
        const categoriaSeleccionada = selectCategoria.value;
        const tipusSeleccionado = selectTipus.value;

        if (!categoriaSeleccionada || !tipusSeleccionado) {
            alert("Si us plau, selecciona una opció en cada camp.");
            return;
        }

        alert(`Has seleccionat:\nCategorizació: ${categoriaSeleccionada}\nTipus de gestió: ${tipusSeleccionado}`);
    });
});
