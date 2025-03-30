document.addEventListener("DOMContentLoaded", async function () {
  const containerTable = document.getElementById("container-table");
  let jsonData = {};

  try {
    const response = await fetch("diccs/altres.json");
    jsonData = await response.json();

    // Inicializa el primer select de la fila existente
    const firstCategoriaSelect = document.querySelector(".categoria-select");
    populateCategoriaSelect(firstCategoriaSelect, jsonData);
  } catch (error) {
    console.error("Error cargando el JSON:", error);
  }

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
        gestioSelect.innerHTML = `<option>Selecciona una opció</option>`;
        const selectedCategory = catSelect.value;
        if (jsonData[selectedCategory]) {
          Object.keys(jsonData[selectedCategory]).forEach((subCategoria) => {
            const opt = document.createElement("option");
            opt.value = subCategoria;
            opt.textContent = subCategoria;
            gestioSelect.appendChild(opt);
          });
        }
      });

      containerTable.appendChild(newRow);
      updateRowNumbers();
    }
  });

  function updateRowNumbers() {
    const rows = containerTable.querySelectorAll(".table-row");
    rows.forEach((row, index) => {
      const numberCell = row.querySelector("div:first-child");
      if (numberCell) {
        numberCell.innerHTML = `<strong>${index + 1}</strong>`;
      }
    });
  }

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
      gestioSelect.innerHTML = `<option>Selecciona una opció</option>`;
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
        // Solo guardamos si se ha seleccionado algo distinto a la opción por defecto
        if (
          categoria !== "Selecciona una opció" &&
          gestio !== "Selecciona una opció"
        ) {
          selections.push({ categoria, gestio });
        }
      });
      // Guarda el arreglo de selecciones en localStorage
      localStorage.setItem("selections", JSON.stringify(selections));

      // Redirige a la página de respuesta
      window.location.href = "resposta.html";
    });
  }
});

async function loadDictionaries() {
  const files = [
    "malestares_COM.json",
    "malestares_PROF.json",
    "malestares_T_VISITA.json",
    "malestares.json",
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
  // Recupera la selección guardada (se asume que se usará la primera selección)
  const selectionsJSON = localStorage.getItem("selections");
  let selections = null;
  if (selectionsJSON) {
    selections = JSON.parse(selectionsJSON);
  }
  // Cargar el JSON del diccionario
  const jsonData = await loadDictionaries();

  if (!selections) {
    console.error("No hay selección guardada");
    return;
  }

  // Buscar los datos correspondientes a la selección
  let datos = null;

  selections.forEach();
  if (
    jsonData[selection.categoria] &&
    jsonData[selection.categoria][selection.gestio]
  ) {
    datos = jsonData[selection.categoria][selection.gestio][0]; // se toma el primer objeto del array
  }

  // Actualizar los elementos de la página
  if (datos) {
    document.getElementById("where-ans").textContent = datos.PROF;
    document.getElementById("when-ans").textContent =
      "Temps de espera: " + datos.T_VISITA;
    document.getElementById("how-ans").textContent =
      "Tipus de visita: " + datos.COM;
  } else {
    console.error("No se encontraron datos para la selección", selection);
  }
});
