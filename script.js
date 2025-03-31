document.addEventListener("DOMContentLoaded", async () => {
  // Precarga de diccionarios en background (si no están ya en caché)
  preloadDictionaries();

  async function preloadDictionaries() {
    if (!sessionStorage.getItem("dictionariesCache")) {
      await loadDictionariesCached();
    }
  }

  // Función auxiliar para redirigir al hacer clic en un botón
  function addRedirectListener(buttonId, targetPath) {
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = targetPath;
      });
    }
  }

  // Detectamos la página actual a partir de la URL
  const currentPage = window.location.pathname.split("/").pop();

  // -------------------------------
  // Funciones específicas para cada página
  // -------------------------------
  function handleIndexPage() {
    addRedirectListener("btn-Siguiente1", "consulta.html");
  }

  function handleConsultaPage() {
    addRedirectListener("btn-altres", "altres.html");
  }

  async function handleAltresPage() {
    const containerTable = document.getElementById("container-table");
    const btnNext = document.getElementById("next-button-toRes");
    let jsonData = {};
  
    // Función para validar las selecciones al hacer clic en "Siguiente"
    function validateSelections() {
      const selections = [];
      containerTable.querySelectorAll(".table-row").forEach((row) => {
        const cat = row.querySelector(".categoria-select")?.value;
        const gest = row.querySelector(".gestio-select")?.value;
        if (
          cat &&
          gest &&
          cat !== "Selecciona una opció" &&
          gest !== "Selecciona una opció"
        ) {
          selections.push({ categoria: cat, gestio: gest });
        }
      });
  
      if (selections.length > 0) {
        localStorage.setItem("selections", JSON.stringify(selections));
        window.location.href = "resposta.html";
      } else {
        alert("Selecciona al menos una opción válida antes de continuar.");
      }
    }
  
    // Función para rellenar el select de categoría (aplicable a la fila inicial y las dinámicas)
    function populateCategoriaSelect(selectElement, data) {
      Object.keys(data).forEach((categoria) => {
        const opt = document.createElement("option");
        opt.value = categoria;
        opt.textContent = categoria;
        selectElement.appendChild(opt);
      });
      selectElement.addEventListener("change", function () {
        const currentRow = selectElement.closest(".table-row");
        const gestioSelect = currentRow.querySelector(".gestio-select");
        gestioSelect.innerHTML = `<option>Selecciona una opció</option>`;
        const selectedCategory = selectElement.value;
        if (data[selectedCategory]) {
          gestioSelect.disabled = false;
          Object.keys(data[selectedCategory]).forEach((subCategoria) => {
            const option = document.createElement("option");
            option.value = subCategoria;
            option.textContent = subCategoria;
            gestioSelect.appendChild(option);
          });
        } else {
          gestioSelect.disabled = true;
        }
      });
    }
  
    // Cargar el JSON de "altres.json"
    try {
      const response = await fetch("diccs/altres.json");
      jsonData = await response.json();
  
      // Manejar la fila inicial existente: poblamos el select de categoría
      const firstCategoriaSelect = document.querySelector(".categoria-select");
      populateCategoriaSelect(firstCategoriaSelect, jsonData);
  
      // Bloquear el select de gestión en la fila inicial hasta que se seleccione una categoría
      const firstRow = firstCategoriaSelect.closest(".table-row");
      const firstGestioSelect = firstRow.querySelector(".gestio-select");
      firstGestioSelect.disabled = true;
    } catch (error) {
      console.error("Error cargando el JSON:", error);
    }
  
    // Añadir filas dinámicamente
    containerTable.addEventListener("click", (e) => {
      if (e.target?.matches(".add-row-btn")) {
        const currentRow = e.target.closest(".table-row");
        const plusBtnContainer = currentRow.querySelector(".plus-btn-table");
        if (plusBtnContainer) plusBtnContainer.remove();
  
        const newRow = document.createElement("div");
        newRow.classList.add("table-row");
  
        // Celda con número de fila (se actualizarán los números si lo deseas)
        const numberCell = document.createElement("div");
        numberCell.innerHTML = `<strong></strong>`;
        newRow.appendChild(numberCell);
  
        // Celda de categoría
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
  
        // Celda de gestión
        const gestioCell = document.createElement("div");
        const gestioSelect = document.createElement("select");
        gestioSelect.classList.add("gestio-select");
        gestioSelect.innerHTML = `<option>Selecciona una opció</option>`;
        // Bloqueamos el select hasta que se seleccione una categoría
        gestioSelect.disabled = true;
        gestioCell.appendChild(gestioSelect);
        newRow.appendChild(gestioCell);
  
        // Botón para añadir nueva fila
        const plusCell = document.createElement("div");
        plusCell.classList.add("plus-btn-table");
        const plusBtn = document.createElement("button");
        plusBtn.classList.add("add-row-btn");
        plusBtn.textContent = "+";
        plusCell.appendChild(plusBtn);
        newRow.appendChild(plusCell);
  
        // Evento para cargar subcategorías al cambiar la categoría en la nueva fila
        catSelect.addEventListener("change", () => {
          gestioSelect.innerHTML = `<option>Selecciona una opció</option>`;
          const selectedCategory = catSelect.value;
          if (jsonData[selectedCategory]) {
            gestioSelect.disabled = false;
            Object.keys(jsonData[selectedCategory]).forEach((subCategoria) => {
              const opt = document.createElement("option");
              opt.value = subCategoria;
              opt.textContent = subCategoria;
              gestioSelect.appendChild(opt);
            });
          } else {
            gestioSelect.disabled = true;
          }
        });
  
        containerTable.appendChild(newRow);
      }
    });
  
    // Validar selecciones al hacer clic en el botón "Siguiente"
    btnNext.addEventListener("click", validateSelections);
  }
    

  // -------------------------------
  // Funciones de utilidad compartidas
  // -------------------------------
  function normalizeText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,!?;:]/g, "")
      .trim();
  }

  function capitalizeFirstLetter(text) {
    return text.charAt(0).match(/[a-z]/i)
      ? text.charAt(0).toUpperCase() + text.slice(1)
      : text;
  }

  // Carga de diccionarios con caché (sessionStorage)
  async function loadDictionariesCached() {
    const cacheKey = "dictionariesCache";
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Error al parsear la caché de diccionarios", e);
      }
    }
    const files = [
      "Altres_COM.json",
      "Altres_PROF.json",
      "Altres_T_VISITA.json",
      "altres.json",
    ];
    const dir = "diccs";
    const requests = files.map((file) =>
      fetch(`${dir}/${file}`)
        .then((resp) => {
          if (!resp.ok) throw new Error(`Error en ${file}: ${resp.statusText}`);
          return resp.json();
        })
        .catch((error) => {
          console.error(error);
          return {};
        })
    );
    const results = await Promise.all(requests);
    const dictionaries = files.reduce((acc, file, idx) => {
      acc[file] = results[idx];
      return acc;
    }, {});
    sessionStorage.setItem(cacheKey, JSON.stringify(dictionaries));
    return dictionaries;
  }

  // Función para obtener los mejores valores jerárquicos según una clave
  function getBestHierarchicalValues(selectionList, key, jsonData) {
    try {
      let allValues = [];
      selectionList.forEach((selection) => {
        const data =
          jsonData["altres.json"]?.[selection.categoria]?.[
            selection.gestio
          ]?.[0];
        if (data && data[key]) {
          allValues = allValues.concat(
            data[key].split(/ o |, /).map(normalizeText)
          );
        }
      });
      const rankedValues = allValues
        .map((val) => ({
          val,
          rank: jsonData[`Altres_${key}.json`]?.[val] ?? 10,
        }))
        .sort((a, b) => a.rank - b.rank);
      if (rankedValues.length === 0) return [];
      const bestOverall = rankedValues[0];
      const highRankCandidates = rankedValues.filter(
        (item) => item.rank > 7 && item.val !== bestOverall.val
      );
      return highRankCandidates.length > 0
        ? [bestOverall.val, highRankCandidates[0].val]
        : [bestOverall.val];
    } catch (error) {
      console.error(`Error procesando ${key}:`, error);
      return [];
    }
  }

  // Función para filtrar selecciones basadas en una clave y valores permitidos
  function filterSelectionsByKeyValue(
    selectionList,
    key,
    allowedValues,
    jsonData
  ) {
    return selectionList.filter((selection) => {
      const data =
        jsonData["altres.json"]?.[selection.categoria]?.[selection.gestio]?.[0];
      if (data && data[key]) {
        const values = data[key].split(/ o |, /).map(normalizeText);
        return values.some((val) => allowedValues.includes(val));
      }
      return false;
    });
  }

  // -------------------------------
  // Procesamiento en resposta.html
  // -------------------------------
  async function handleRespostaProcessing() {
    try {
      const selectionsJSON = localStorage.getItem("selections");
      const selections = selectionsJSON ? JSON.parse(selectionsJSON) : null;
      if (!selections) {
        console.error("No hay selección guardada");
        return;
      }
      // Utilizamos la función de caché para cargar los diccionarios (probablemente ya precargados)
      const jsonData = await loadDictionariesCached();

      // Paso 1: Evaluar PROF
      const bestProf = getBestHierarchicalValues(selections, "PROF", jsonData);
      const selectionsForTVisita = filterSelectionsByKeyValue(
        selections,
        "PROF",
        bestProf,
        jsonData
      );

      // Paso 2: Evaluar T_VISITA sobre el subconjunto anterior
      const bestTVisita = getBestHierarchicalValues(
        selectionsForTVisita,
        "T_VISITA",
        jsonData
      );
      const selectionsForCom = filterSelectionsByKeyValue(
        selectionsForTVisita,
        "T_VISITA",
        bestTVisita,
        jsonData
      );

      // Paso 3: Evaluar COM en el subconjunto filtrado
      const bestCom = getBestHierarchicalValues(
        selectionsForCom,
        "COM",
        jsonData
      );

      document.getElementById("where-ans").textContent =
        capitalizeFirstLetter(bestProf.join(" o ")) || "No encontrado";
      document.getElementById("when-ans").textContent =
        "Temps de espera: " +
        (capitalizeFirstLetter(bestTVisita.join(" o ")) || "No encontrado");
      document.getElementById("how-ans").textContent =
        "Tipus de visita: " +
        (capitalizeFirstLetter(bestCom.join(" o ")) || "No encontrado");
    } catch (error) {
      console.error("Error en el procesamiento de resposta.html:", error);
    }
  }

  // -------------------------------
  // Invocamos la función según la página actual
  // -------------------------------
  switch (currentPage) {
    case "index.html":
      handleIndexPage();
      break;
    case "consulta.html":
      handleConsultaPage();
      break;
    case "altres.html":
      await handleAltresPage();
      break;
    case "resposta.html":
      await handleRespostaProcessing();
      break;
    default:
      break;
  }
});
