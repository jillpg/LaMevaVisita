document.addEventListener("DOMContentLoaded", async function () {
  if (window.location.pathname.endsWith("altres.html")) {
    const containerTable = document.getElementById("container-table");
    let jsonData = {};

    // Cargar el JSON
    try {
      const response = await fetch("diccs/altres.json");
      jsonData = await response.json();

      // Inicializa el primer select de la fila existente
      const firstCategoriaSelect = document.querySelector(".categoria-select");
      populateCategoriaSelect(firstCategoriaSelect, jsonData);
    } catch (error) {
      console.error("Error cargando el JSON:", error);
    }

    // Evento para añadir filas dinámicamente
    containerTable.addEventListener("click", function (e) {
      if (e.target && e.target.matches(".add-row-btn")) {
        const currentRow = e.target.closest(".table-row");
        const plusBtnContainer = currentRow.querySelector(".plus-btn-table");
        if (plusBtnContainer) {
          plusBtnContainer.remove();
        }

        const newRow = document.createElement("div");
        newRow.classList.add("table-row");

        // Celda de numeración
        const numberCell = document.createElement("div");
        numberCell.innerHTML = `<strong></strong>`;
        newRow.appendChild(numberCell);

        // Celda con el select de categoría
        const catCell = document.createElement("div");
        const catSelect = document.createElement("select");
        catSelect.classList.add("categoria-select");
        catSelect.innerHTML = `<option>Selecciona una opció</option>`;
        Object.keys(jsonData).forEach((categoria) => {
          const opt = document.createElement("option");
          opt.value = categoria;
          opt.textContent = categoria;
          catSelect.appendChild(opt);
        });
        catCell.appendChild(catSelect);
        newRow.appendChild(catCell);

        // Celda con el select de gestión
        const gestioCell = document.createElement("div");
        const gestioSelect = document.createElement("select");
        gestioSelect.classList.add("gestio-select");
        gestioSelect.innerHTML = `<option>Selecciona una opció</option>`;
        gestioSelect.disabled = true; // Inicialmente deshabilitado
        gestioCell.appendChild(gestioSelect);
        newRow.appendChild(gestioCell);

        // Celda con el botón “+”
        const plusCell = document.createElement("div");
        plusCell.classList.add("plus-btn-table");
        const plusBtn = document.createElement("button");
        plusBtn.classList.add("add-row-btn");
        plusBtn.textContent = "+";
        plusCell.appendChild(plusBtn);
        newRow.appendChild(plusCell);

        // Evento para cargar subcategorías al cambiar la categoría
        catSelect.addEventListener("change", function () {
          gestioSelect.innerHTML = `<option>Selecciona una opció</option>`; // Restablece la selección de gestión
          const selectedCategory = catSelect.value;
          if (jsonData[selectedCategory]) {
            gestioSelect.disabled = false; // Habilitar el select de gestión
            Object.keys(jsonData[selectedCategory]).forEach((subCategoria) => {
              const opt = document.createElement("option");
              opt.value = subCategoria;
              opt.textContent = subCategoria;
              gestioSelect.appendChild(opt);
            });
          } else {
            gestioSelect.disabled = true; // Deshabilitar si no hay datos para esa categoría
          }
        });

        containerTable.appendChild(newRow);
        updateRowNumbers();
      }
    });

    // Actualizar números de fila
    function updateRowNumbers() {
      const rows = containerTable.querySelectorAll(".table-row");
      rows.forEach((row, index) => {
        const numberCell = row.querySelector("div:first-child");
        if (numberCell) {
          numberCell.innerHTML = `<strong>${index + 1}</strong>`;
        }
      });
    }

    // Llenar las opciones de categoría en el primer select
    function populateCategoriaSelect(selectElement, jsonData) {
      Object.keys(jsonData).forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        selectElement.appendChild(option);
      });

      selectElement.addEventListener("change", function () {
        const currentRow = selectElement.closest(".table-row");
        const gestioSelect = currentRow.querySelector(".gestio-select");
        gestioSelect.innerHTML = `<option>Selecciona una opció</option>`; // Restablece la selección de gestión
        const selectedCategory = selectElement.value;
        if (jsonData[selectedCategory]) {
          Object.keys(jsonData[selectedCategory]).forEach((subCategoria) => {
            const option = document.createElement("option");
            option.value = subCategoria;
            option.textContent = subCategoria;
            gestioSelect.appendChild(option);
          });
        }
      });
    }

    // Guardar las selecciones de cada fila y redirigir
    const btnNext = document.getElementById("next-button-toRes");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        const selections = [];
        const rows = containerTable.querySelectorAll(".table-row");
        rows.forEach((row) => {
          const categoria = row.querySelector(".categoria-select").value;
          const gestio = row.querySelector(".gestio-select").value;
          if (
            categoria !== "Selecciona una opció" &&
            gestio !== "Selecciona una opció"
          ) {
            selections.push({ categoria, gestio });
          }
        });
        localStorage.setItem("selections", JSON.stringify(selections));
        console.log("aaaa");
        window.location.href = "resposta.html";
      });
    }
  }
});

async function loadDictionaries() {
  const files = [
    "Altres_COM.json",
    "Altres_PROF.json",
    "Altres_T_VISITA.json",
    "altres.json",
  ];
  const dir = "diccs";
  let dictionaries = {};

  for (const file of files) {
    try {
      const response = await fetch(`${dir}/${file}`);
      if (!response.ok) {
        throw new Error(`Error loading ${file}: ${response.statusText}`);
      }
      dictionaries[file] = await response.json();
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  return dictionaries;
}

document.addEventListener("DOMContentLoaded", async function () {
  console.log("aaaa");
  if (window.location.pathname.endsWith("resposta.html")) {
    // Recupera la selección guardada (se asume que se usará la primera selección)
    const selectionsJSON = localStorage.getItem("selections");
    let selections = null;
    if (selectionsJSON) {
      selections = JSON.parse(selectionsJSON);
    }
    console.log("aaaa");

    // Cargar el JSON del diccionario
    const jsonData = await loadDictionaries();

    if (!selections) {
      console.error("No hay selección guardada");
      return;
    }

    // Función para obtener los mejores valores según las condiciones descritas
    function getBestValues(data, key) {
      const values = data[key];
      let filteredValues = values.split(" o ").map(Number); // Convertir valores a números

      if (key === "T_VISITA") {
        // Filtrar según el ranking para T_VISITA
        const lowerThan8 = filteredValues.filter((value) => value < 8);
        const higherThanOrEqual8 = filteredValues.filter((value) => value >= 8);

        if (lowerThan8.length > 0 && higherThanOrEqual8.length > 0) {
          return [Math.min(...lowerThan8), Math.min(...higherThanOrEqual8)]; // Devuelve los dos valores si existen
        } else if (lowerThan8.length > 0) {
          return [Math.min(...lowerThan8)]; // Solo valores menores que 8
        } else if (higherThanOrEqual8.length > 0) {
          return [Math.min(...higherThanOrEqual8)]; // Solo valores mayores o iguales a 8
        }
      } else {
        // Para PROF y COM, seleccionamos el valor más bajo
        return [Math.min(...filteredValues)]; // Seleccionamos el valor mínimo
      }
    }

    // Procesar todas las selecciones
    selections.forEach((selection) => {
      if (
        jsonData["altres.json"][selection.categoria] &&
        jsonData["altres.json"][selection.categoria][selection.gestio]
      ) {
        const datos =
          jsonData["altres.json"][selection.categoria][selection.gestio][0]; // Se toma el primer objeto del array

        // Recuperar los valores de cada clave: T_VISITA, COM, PROF
        const tVisitaValues = getBestValues(datos, "T_VISITA");
        const comValues = getBestValues(datos, "COM");
        const profValues = getBestValues(datos, "PROF");

        // Buscar los diccionarios correspondientes a las variables
        const altresCom = comValues
          .map((val) => jsonData["Altres_COM.json"][val] || "")
          .join(" o ");
        const altresProf = profValues
          .map((val) => jsonData["Altres_PROF.json"][val] || "")
          .join(" o ");
        const altresTVisita = tVisitaValues
          .map((val) => jsonData["Altres_T_VISITA.json"][val] || "")
          .join(" o ");

        // Actualizar los elementos de la página con los valores más adecuados
        document.getElementById("where-ans").textContent =
          altresProf || "No encontrado";
        document.getElementById("when-ans").textContent =
          "Temps de espera: " + (altresTVisita || "No encontrado");
        document.getElementById("how-ans").textContent =
          "Tipus de visita: " + (altresCom || "No encontrado");
      } else {
        console.error("No se encontraron datos para la selección", selection);
      }
    });
  }
});
