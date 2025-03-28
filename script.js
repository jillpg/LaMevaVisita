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

document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".plus-btn-table button");
    const containerTable = document.querySelector(".container-table");

    addButton.addEventListener("click", function () {
        // Get the current number of rows
        const currentRowCount = containerTable.querySelectorAll("select").length / 2 + 1;

        // Create elements for the new row
        const rowNumber = document.createElement("div");
        rowNumber.innerHTML = `<strong>${currentRowCount}</strong>`;

        const select1 = document.createElement("select");
        select1.innerHTML = `
            <option>Selecciona una opció</option>
        `;

        const select2 = document.createElement("select");
        select2.innerHTML = `
            <option>Selecciona una opció</option>
        `;

        const divSelect1 = document.createElement("div");
        divSelect1.appendChild(select1);

        const divSelect2 = document.createElement("div");
        divSelect2.appendChild(select2);

        // Insert new row before the button
        containerTable.insertBefore(rowNumber, addButton.parentElement);
        containerTable.insertBefore(divSelect1, addButton.parentElement);
        containerTable.insertBefore(divSelect2, addButton.parentElement);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    let data = {};
    
    // Cargar el archivo JSON con los datos
    fetch('diccs/altres.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            populateCategoriaSelect();
        })
        .catch(err => console.error('Error al cargar el JSON:', err));

    // Función para llenar el primer select con las categorías
    function populateCategoriaSelect() {
        const categoriaSelects = document.querySelectorAll('.categoria-select');
        categoriaSelects.forEach(select => {
            // Limpiar opciones anteriores
            select.innerHTML = `<option>Selecciona una opció</option>`;
            // Añadir opciones de las categorías del JSON
            Object.keys(data).forEach(categoria => {
                let option = document.createElement('option');
                option.value = categoria;
                option.textContent = categoria;
                select.appendChild(option);
            });
        });
    }

    // Función para llenar el segundo select con las gestiones de la categoría seleccionada
    function populateGestioSelect(categoriaSelect) {
        const gestioSelect = categoriaSelect.closest('.table-row').querySelector('.gestio-select');
        const selectedCategoria = categoriaSelect.value;
        
        // Limpiar opciones anteriores
        gestioSelect.innerHTML = `<option>Selecciona una opció</option>`;
        
        if (selectedCategoria && data[selectedCategoria]) {
            const gestioOptions = data[selectedCategoria];
            Object.keys(gestioOptions).forEach(gestio => {
                let option = document.createElement('option');
                option.value = gestio;
                option.textContent = gestio;
                gestioSelect.appendChild(option);
            });
        }
    }

    // Escuchar cambios en los selects de categoría
    document.addEventListener('change', (event) => {
        if (event.target.classList.contains('categoria-select')) {
            populateGestioSelect(event.target);
        }
    });

    // Función para añadir una nueva fila
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-row-btn')) {
            addNewRow();
        }
    });

    // Añadir una nueva fila al hacer clic en el botón "+"
    function addNewRow() {
        const container = document.getElementById('container-table');
        
        // Crear nueva fila
        const newRow = document.createElement('div');
        newRow.classList.add('table-row');

        // Contar el número de filas para mostrar el contador
        const rowCount = container.querySelectorAll('.table-row').length + 1;

        newRow.innerHTML = `
            <div><strong>${rowCount}</strong></div>
            <div>
                <select class="categoria-select">
                    <option>Selecciona una opció</option>
                </select>
            </div>
            <div>
                <select class="gestio-select">
                    <option>Selecciona una opció</option>
                </select>
            </div>
            <div class="plus-btn-table">
                <button class="add-row-btn">+</button>
            </div>
        `;

        // Añadir la nueva fila al final del contenedor
        container.appendChild(newRow);

        // Rellenar los selects de la nueva fila con las opciones
        populateCategoriaSelect();

        // Mover el botón de la fila anterior a la nueva fila
        const lastRow = container.querySelector('.table-row:last-child');
        const lastButton = lastRow.querySelector('.add-row-btn');
        lastButton.addEventListener('click', addNewRow);
        
        // Eliminar el botón de la fila anterior
        const previousRow = container.querySelector('.table-row:nth-last-child(2)');
        if (previousRow) {
            const prevButton = previousRow.querySelector('.add-row-btn');
            if (prevButton) {
                prevButton.remove();
            }
        }
    }
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
