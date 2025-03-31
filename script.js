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

document.addEventListener("DOMContentLoaded", () => {
  // Seleccionamos el botón de la pantalla anterior
  const btnaltres = document.getElementById("btn-altres");

  // Si el botón existe en la página, añadimos el evento
  if (btnaltres) {
    btnaltres.addEventListener("click", () => {
      // Redirigir a la nueva pantalla de consulta
      window.location.href = "altres.html"; // Asegúrate de que la ruta sea correcta
    });
  }
});


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
      dictionaries[file] = {}; // Evita que falte un diccionario
    }
  }

  return dictionaries;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
    .replace(/[.,!?;:]/g, "")
    .trim();
}

function capitalizeFirstLetter(text) {
  return text.charAt(0).match(/[a-z]/i) ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function getBestHierarchicalValues(selectionList, key, jsonData) {
  try {
    let allValues = [];
    selectionList.forEach(selection => {
      const data = jsonData["altres.json"]?.[selection.categoria]?.[selection.gestio]?.[0];
      if (data && data[key]) {
        allValues = allValues.concat(
          data[key].split(/ o |, /).map(normalizeText)
        );
      }
    });
    let rankedValues = allValues.map(val => ({
      val,
      rank: jsonData[`Altres_${key}.json`]?.[val] ?? 10
    }));
    rankedValues.sort((a, b) => a.rank - b.rank);
    if (rankedValues.length === 0) return [];
    const bestOverall = rankedValues[0];
    // Buscar el mejor entre los que tengan rank > 7 y distinto al mejor general
    const highRankCandidates = rankedValues.filter(
      item => item.rank > 7 && item.val !== bestOverall.val
    );
    if (highRankCandidates.length > 0) {
      return [bestOverall.val, highRankCandidates[0].val];
    }
    return [bestOverall.val];
  } catch (error) {
    console.error(`Error procesando valores de ${key}:`, error);
    return [];
  }
}

// Función para filtrar las selecciones que contengan en su valor para una clave alguno de los valores permitidos
function filterSelectionsByKeyValue(selectionList, key, allowedValues, jsonData) {
  return selectionList.filter(selection => {
    const data = jsonData["altres.json"]?.[selection.categoria]?.[selection.gestio]?.[0];
    if (data && data[key]) {
      const values = data[key].split(/ o |, /).map(normalizeText);
      return values.some(val => allowedValues.includes(val));
    }
    return false;
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  if (window.location.pathname.endsWith("resposta.html")) {
    try {
      const selectionsJSON = localStorage.getItem("selections");
      let selections = selectionsJSON ? JSON.parse(selectionsJSON) : null;
      const jsonData = await loadDictionaries();

      if (!selections) {
        console.error("No hay selección guardada");
        return;
      }

      // Paso 1: Selección jerárquica para PROF
      const bestProf = getBestHierarchicalValues(selections, "PROF", jsonData);
      // Filtrar las selecciones que tienen alguno de los valores PROF obtenidos
      const selectionsForTVisita = filterSelectionsByKeyValue(selections, "PROF", bestProf, jsonData);

      // Paso 2: Sobre ese subconjunto, evaluar T_VISITA
      const bestTVisita = getBestHierarchicalValues(selectionsForTVisita, "T_VISITA", jsonData);
      const selectionsForCom = filterSelectionsByKeyValue(selectionsForTVisita, "T_VISITA", bestTVisita, jsonData);

      // Paso 3: Sobre el subconjunto filtrado por T_VISITA, evaluar COM
      const bestCom = getBestHierarchicalValues(selectionsForCom, "COM", jsonData);

      // Actualizar los elementos de la página con los resultados jerárquicos
      document.getElementById("where-ans").textContent =
      capitalizeFirstLetter(bestProf.join(" o ")) || "No encontrado";
      document.getElementById("when-ans").textContent =
        "Temps de espera: " + (capitalizeFirstLetter(bestTVisita.join(" o ")) || "No encontrado");
      document.getElementById("how-ans").textContent =
        "Tipus de visita: " + (capitalizeFirstLetter(bestCom.join(" o ")) || "No encontrado");
    } catch (error) {
      console.error("Error en el procesamiento general:", error);
    }
  }
});