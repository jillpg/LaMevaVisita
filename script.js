document.addEventListener("DOMContentLoaded", async () => {
  // -------------------------------
  // Funciones y utilidades comunes
  // -------------------------------

  // Precarga de diccionarios en background (si no están ya en caché)
  preloadDictionaries();
  async function preloadDictionaries() {
    if (!sessionStorage.getItem("dictionariesCache")) {
      await loadDictionariesCached();
    }
  }
  preloadDictionariesMalestares()
  async function preloadDictionariesMalestares() {
    if (!sessionStorage.getItem("dictionariesMalestaresCache")) {
      await loadDictionariesMalestaresCached();
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

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  // -------------------------------
  // Funciones específicas para cada página
  // -------------------------------

  function handleIndexPage() {
    addRedirectListener("btn-Siguiente1", "consulta.html");
  }

  function handleConsultaPage() {
    addRedirectListener("btn-altres", "altres.html");
    addRedirectListener("btn-malestares", "malestares.html");
  }



  async function handleAltresPage() {
    const containerTable = document.getElementById("container-table");
    const btnNext = document.getElementById("next-button-toRes");
    let jsonData = {};

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

    // Actualiza el número de fila en la tabla
    function updateRowNumbers() {
      const rows = containerTable.querySelectorAll(".table-row");
      rows.forEach((row, index) => {
        const numberCell = row.querySelector("div:first-child");
        if (numberCell) {
          numberCell.innerHTML = `<strong>${index + 1}</strong>`;
        }
      });
    }

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

    try {
      const response = await fetch("diccs/altres.json");
      jsonData = await response.json();
      const firstCategoriaSelect = document.querySelector(".categoria-select");
      populateCategoriaSelect(firstCategoriaSelect, jsonData);
      const firstRow = firstCategoriaSelect.closest(".table-row");
      const firstGestioSelect = firstRow.querySelector(".gestio-select");
      firstGestioSelect.disabled = true;
    } catch (error) {
      console.error("Error cargando el JSON:", error);
    }

    containerTable.addEventListener("click", (e) => {
      if (e.target?.matches(".add-row-btn")) {
        const currentRow = e.target.closest(".table-row");
        const plusBtnContainer = currentRow.querySelector(".plus-btn-table");
        if (plusBtnContainer) plusBtnContainer.remove();

        const newRow = document.createElement("div");
        newRow.classList.add("table-row");

        const numberCell = document.createElement("div");
        numberCell.innerHTML = `<strong></strong>`;
        newRow.appendChild(numberCell);

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

        const gestioCell = document.createElement("div");
        const gestioSelect = document.createElement("select");
        gestioSelect.classList.add("gestio-select");
        gestioSelect.innerHTML = `<option>Selecciona una opció</option>`;
        gestioSelect.disabled = true;
        gestioCell.appendChild(gestioSelect);
        newRow.appendChild(gestioCell);

        const plusCell = document.createElement("div");
        plusCell.classList.add("plus-btn-table");
        const plusBtn = document.createElement("button");
        plusBtn.classList.add("add-row-btn");
        plusBtn.textContent = "+";
        plusCell.appendChild(plusBtn);
        newRow.appendChild(plusCell);

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
        updateRowNumbers();
      }
    });

    btnNext.addEventListener("click", validateSelections);
  }


  // Normalización y capitalización de textos
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

  // Función para obtener el mejor valor jerárquico de una clave a partir de las selecciones
  function getBestHierarchicalValues(selectionList, key, jsonData, value_secondary = 7,
    nameJsonPDicc = "altres.json", nameRanking = "Altres_") {
    try {
      const candidateCounts = {};
      const candidateRank = {};

      selectionList.forEach((selection) => {
        const data = jsonData[nameJsonPDicc]?.[selection.categoria]?.[selection.gestio]?.[0];
        if (data && data[key]) {
          const values = data[key].split(/ o |, /).map(normalizeText);
          values.forEach((val) => {
            candidateCounts[val] = (candidateCounts[val] || 0) + 1;
            const rank = jsonData[`${nameRanking + key}.json`]?.[val] ?? 10;
            if (candidateRank[val] === undefined || rank < candidateRank[val]) {
              candidateRank[val] = rank;
            }
          });
        }
      });

      const totalSelections = selectionList.length;
      const commonCandidates = Object.entries(candidateCounts)
        .filter(([, count]) => count === totalSelections)
        .map(([val]) => ({ val, rank: candidateRank[val] }));

      let finalCandidates = [];
      if (commonCandidates.length > 0) {
        commonCandidates.sort((a, b) => a.rank - b.rank);
        finalCandidates.push(commonCandidates[0].val);
        const secondary = commonCandidates.find(
          (item) => item.rank > value_secondary && item.val !== commonCandidates[0].val
        );
        if (secondary) {
          finalCandidates.push(secondary.val);
        }
      } else {
        const allCandidates = Object.entries(candidateRank).map(([val, rank]) => ({
          val,
          rank,
        }));
        allCandidates.sort((a, b) => a.rank - b.rank);
        if (allCandidates.length > 0) {
          finalCandidates.push(allCandidates[0].val);
          const secondary = allCandidates.find(
            (item) => item.rank > value_secondary && item.val !== allCandidates[0].val
          );
          if (secondary) {
            finalCandidates.push(secondary.val);
          }
        }
      }
      return finalCandidates;
    } catch (error) {
      console.error(`Error procesando ${key}:`, error);
      return [];
    }
  }

  // Función para filtrar selecciones basadas en una clave y valores permitidos
  function filterSelectionsByKeyValue(selectionList, key, allowedValues, jsonData, name = "altres.json") {
    return selectionList.filter((selection) => {
      const data = jsonData[name]?.[selection.categoria]?.[selection.gestio]?.[0];
      if (data && data[key]) {
        const values = data[key].split(/ o |, /).map(normalizeText);
        return values.some((val) => allowedValues.includes(val));
      }
      return false;
    });
  }

  async function handleRespostaProcessing() {
    try {
      const selectionsJSON = localStorage.getItem("selections");
      const selections = selectionsJSON ? JSON.parse(selectionsJSON) : null;
      if (!selections) {
        console.error("No hay selección guardada");
        return;
      }
      const jsonData = await loadDictionariesCached();

      const bestProf = getBestHierarchicalValues(selections, "PROF", jsonData);
      const selectionsForTVisita = filterSelectionsByKeyValue(
        selections,
        "PROF",
        bestProf,
        jsonData
      );

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

      const bestCom = getBestHierarchicalValues(
        selections,
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
    addRedirectListener("btn-Siguiente2", "contacto.html");
  }

  // -------------------------------
  // Funciones específicas para malestares.html
  // Se encapsulan para evitar conflictos con las funciones comunes
  // -------------------------------
  async function handleMalestaresPage() {
    async function loadMalestaresDictionary() {
      try {
        const response = await fetch("diccs/malestares.json");
        return await response.json();
      } catch (error) {
        console.error("Error cargando diccionario de malestares:", error);
        return {};
      }
    }
    // Actualiza el número de fila en la tabla
    function updateRowNumbers() {
      const rows = containerTable.querySelectorAll(".table-row");
      rows.forEach((row, index) => {
        const numberCell = row.querySelector("div:first-child");
        if (numberCell) {
          numberCell.innerHTML = `<strong>${index + 1}</strong>`;
        }
      });
    }

    function populateCategoriaSelectMalestares(selectElement, data) {
      Object.keys(data).forEach((categoria) => {
        const opt = document.createElement("option");
        opt.value = categoria;
        opt.textContent = categoria;
        selectElement.appendChild(opt);
      });
      selectElement.addEventListener("change", function () {
        const currentRow = selectElement.closest(".table-row");
        const symptomeSelect = currentRow.querySelector(".simptome-select");
        const contextSelect = currentRow.querySelector(".context-select");
        symptomeSelect.innerHTML = `<option>Selecciona una opció</option>`;
        contextSelect.innerHTML = `<option>Selecciona una opció</option>`;
        contextSelect.disabled = true;
        const selectedCategory = selectElement.value;
        if (data[selectedCategory]) {
          symptomeSelect.disabled = false;
          Object.keys(data[selectedCategory]).forEach((symptom) => {
            const opt = document.createElement("option");
            opt.value = symptom;
            opt.textContent = symptom;
            symptomeSelect.appendChild(opt);
          });
        } else {
          symptomeSelect.disabled = true;
        }
      });
    }

    function populateContextSelect(selectElement, category, symptom, data) {
      selectElement.innerHTML = `<option>Selecciona una opció</option>`;
      if (data[category] && data[category][symptom] && typeof data[category][symptom] === 'object') {
        selectElement.disabled = false;
        Object.keys(data[category][symptom]).forEach((optionKey) => {
          const opt = document.createElement("option");
          opt.value = optionKey;
          opt.textContent = optionKey;
          selectElement.appendChild(opt);
        });
      } else {
        selectElement.disabled = true;
      }
    }



    function populateDiesSelect(selectElement) {
      selectElement.innerHTML = `<option>Selecciona una opció</option>`;
      for (let i = 1; i <= 100; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectElement.appendChild(option);
      }
    }

    function attachSymptomeListener(row, data) {
      const categorySelect = row.querySelector(".categoria-select");
      const symptomeSelect = row.querySelector(".simptome-select");
      const contextSelect = row.querySelector(".context-select");
      symptomeSelect.addEventListener("change", function () {
        const selectedCategory = categorySelect.value;
        const selectedSymptom = symptomeSelect.value;
        populateContextSelect(contextSelect, selectedCategory, selectedSymptom, data);
      });
    }

    const containerTable = document.getElementById("container-table");
    const btnNext = document.getElementById("next-button-toRes");
    const jsonData = await loadMalestaresDictionary();

    // Poblamos la fila inicial
    const firstRow = containerTable.querySelector(".table-row");
    const categoriaSelect = firstRow.querySelector(".categoria-select");
    const symptomeSelect = firstRow.querySelector(".simptome-select");
    const contextSelect = firstRow.querySelector(".context-select");
    const diesSelect = firstRow.querySelector("#dies-select");
    populateCategoriaSelectMalestares(categoriaSelect, jsonData);
    symptomeSelect.disabled = true;
    contextSelect.disabled = true;
    populateDiesSelect(diesSelect);
    attachSymptomeListener(firstRow, jsonData);

    containerTable.addEventListener("click", (e) => {
      if (e.target && e.target.matches(".add-row-btn")) {
        const currentRow = e.target.closest(".table-row");
        const plusBtnContainer = currentRow.querySelector(".plus-btn-table");
        if (plusBtnContainer) plusBtnContainer.remove();

        const newRow = document.createElement("div");
        newRow.classList.add("table-row", "tr_m");

        const numberCell = document.createElement("div");
        numberCell.innerHTML = `<strong></strong>`;
        newRow.appendChild(numberCell);

        const catCell = document.createElement("div");
        const newCategoriaSelect = document.createElement("select");
        newCategoriaSelect.classList.add("categoria-select");
        newCategoriaSelect.innerHTML = `<option>Selecciona una opció</option>`;
        catCell.appendChild(newCategoriaSelect);
        newRow.appendChild(catCell);

        const symptomeCell = document.createElement("div");
        const newSymptomeSelect = document.createElement("select");
        newSymptomeSelect.classList.add("simptome-select");
        newSymptomeSelect.innerHTML = `<option>Selecciona una opció</option>`;
        newSymptomeSelect.disabled = true;
        symptomeCell.appendChild(newSymptomeSelect);
        newRow.appendChild(symptomeCell);

        const contextCell = document.createElement("div");
        const newContextSelect = document.createElement("select");
        newContextSelect.classList.add("context-select");
        newContextSelect.innerHTML = `<option>Selecciona una opció</option>`;
        newContextSelect.disabled = true;
        contextCell.appendChild(newContextSelect);
        newRow.appendChild(contextCell);

        const diesCell = document.createElement("div");
        const newDiesSelect = document.createElement("select");
        newDiesSelect.classList.add("dies-select");
        newDiesSelect.innerHTML = `<option>Selecciona una opció</option>`;
        populateDiesSelect(newDiesSelect);
        diesCell.appendChild(newDiesSelect);
        newRow.appendChild(diesCell);

        const plusCell = document.createElement("div");
        plusCell.classList.add("plus-btn-table");
        const plusBtn = document.createElement("button");
        plusBtn.classList.add("add-row-btn");
        plusBtn.textContent = "+";
        plusCell.appendChild(plusBtn);
        newRow.appendChild(plusCell);

        containerTable.appendChild(newRow);
        updateRowNumbers();
        populateCategoriaSelectMalestares(newCategoriaSelect, jsonData);
        newSymptomeSelect.disabled = true;
        newContextSelect.disabled = true;
        attachSymptomeListener(newRow, jsonData);
      }
    });

    function validateSelections() {
      const rows = containerTable.querySelectorAll(".table-row");
      const selections = [];
      rows.forEach((row) => {
        const cat = row.querySelector(".categoria-select")?.value;
        const sym = row.querySelector(".simptome-select")?.value;
        const ctx = row.querySelector(".context-select")?.value;
        const dies = row.querySelector("#dies-select, .dies-select")?.value;
        if (
          cat &&
          sym &&
          ctx &&
          dies &&
          cat !== "Selecciona una opció" &&
          sym !== "Selecciona una opció" &&
          ctx !== "Selecciona una opció" &&
          dies !== "Selecciona una opció"
        ) {
          selections.push({
            categoria: cat,
            simptoma: sym,
            context: ctx,
            dies: dies
          });
        }
      });
      if (selections.length > 0) {
        localStorage.setItem("selectionsMalestares", JSON.stringify(selections));
        window.location.href = "resposta_m.html";
      } else {
        alert("Selecciona al menys una opció vàlida abans de continuar.");
      }
    }

    btnNext.addEventListener("click", validateSelections);
  }

  // Carga de diccionarios con caché (sessionStorage)
  async function loadDictionariesMalestaresCached() {
    const cacheKey = "dictionariesMalestaresCache";
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Error al parsear la caché de diccionarios", e);
      }
    }
    const files = [
      "malestares_COM.json",
      "malestares_PROF.json",
      "malestares_T_VISITA.json",
      "malestares.json",
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

  function getBestHierarchicalValuesMalestares(
    selectionList,
    key,
    jsonData,
    value_secondary = 9,
    nameJsonPDicc = "malestares.json",
    nameRanking = "malestares_"
  ) {
    try {
      const candidateCounts = {};
      const candidateRank = {};

      selectionList.forEach((selection) => {
        // Obtenemos la estructura para la categoría y contexto
        const categoryData = jsonData[nameJsonPDicc]?.[selection.categoria]?.[selection.simptoma]?.[selection.context];
        if (categoryData) {
          const dies = Number(selection.dies);
          let dataForDie = null;
          // Iteramos sobre las claves que contienen el rango de días (por ejemplo "0,1000")
          for (const range in categoryData) {
            const [minStr, maxStr] = range.split(",");
            const min = Number(minStr);
            const max = Number(maxStr);
            if (dies >= min && dies <= max) {
              dataForDie = categoryData[range][0];
              break;
            }
          }
          if (dataForDie && dataForDie[key]) {
            const values = dataForDie[key].split(/ o |, /).map(normalizeText);
            values.forEach((val) => {
              candidateCounts[val] = (candidateCounts[val] || 0) + 1;
              const rank =
                jsonData[`${nameRanking + key}.json`]?.[val] ?? 10;
              if (candidateRank[val] === undefined || rank < candidateRank[val]) {
                candidateRank[val] = rank;
              }
            });
          }
        }
      });

      const totalSelections = selectionList.length;
      const commonCandidates = Object.entries(candidateCounts)
        .filter(([, count]) => count === totalSelections)
        .map(([val]) => ({ val, rank: candidateRank[val] }));

      let finalCandidates = [];
      if (commonCandidates.length > 0) {
        commonCandidates.sort((a, b) => a.rank - b.rank);
        finalCandidates.push(commonCandidates[0].val);
        const secondary = commonCandidates.find(
          (item) =>
            item.rank > value_secondary &&
            item.val !== commonCandidates[0].val
        );
        if (secondary) {
          finalCandidates.push(secondary.val);
        }
      } else {
        const allCandidates = Object.entries(candidateRank).map(
          ([val, rank]) => ({
            val,
            rank,
          })
        );
        allCandidates.sort((a, b) => a.rank - b.rank);
        if (allCandidates.length > 0) {
          finalCandidates.push(allCandidates[0].val);
          const secondary = allCandidates.find(
            (item) =>
              item.rank > value_secondary &&
              item.val !== allCandidates[0].val
          );
          if (secondary) {
            finalCandidates.push(secondary.val);
          }
        }
      }
      return finalCandidates;
    } catch (error) {
      console.error(`Error procesando ${key}:`, error);
      return [];
    }
  }

  function filterSelectionsByKeyValueMalestares(
    selectionList,
    key,
    allowedValues,
    jsonData,
    name = "malestares.json"
  ) {
    return selectionList.filter((selection) => {
      const categoryData = jsonData[name]?.[selection.categoria]?.[selection.simptoma]?.[selection.context];
      if (categoryData) {
        const dies = Number(selection.dies);
        let dataForDie = null;
        // Iteramos sobre los rangos de días para encontrar el que corresponde
        for (const range in categoryData) {
          const [minStr, maxStr] = range.split(",");
          const min = Number(minStr);
          const max = Number(maxStr);
          if (dies >= min && dies <= max) {
            dataForDie = categoryData[range][0];
            break;
          }
        }
        if (dataForDie && dataForDie[key]) {
          const values = dataForDie[key].split(/ o |, /).map(normalizeText);
          return values.some((val) => allowedValues.includes(val));
        }
      }
      return false;
    });
  }


  async function handleRespostaMalestaresProcessing() {
    try {
      const selectionsJSON = localStorage.getItem("selectionsMalestares");
      const selections = selectionsJSON ? JSON.parse(selectionsJSON) : null;
      if (!selections) {
        console.error("No hay selección guardada");
        return;
      }
      // Se puede reutilizar loadDictionariesCached si los diccionarios de malestares 
      // se encuentran en los mismos archivos o, de lo contrario, se debe crear una función similar.
      const jsonData = await loadDictionariesMalestaresCached();
      const bestPROF = getBestHierarchicalValuesMalestares(selections, "PROF", jsonData, 9, "malestares.json", "malestares_");
      const selectionsForT_VISITA = filterSelectionsByKeyValueMalestares(
        selections,
        "PROF",
        bestPROF,
        jsonData,
        "malestares.json"
      );

      const bestT_VISITA = getBestHierarchicalValuesMalestares(selectionsForT_VISITA, "T_VISITA", jsonData, 9, "malestares.json", "malestares_");
      /*const selectionsForCom = filterSelectionsByKeyValue(
        selectionsForT_VISITA,
        "T_VISITA",
        bestT_VISITA,
        jsonData,
        "malestares.json"
      );*/

      const bestCom = getBestHierarchicalValuesMalestares(selections, "COM", jsonData, 9, "malestares.json", "malestares_");

      // Asignar los resultados al DOM, usando el mismo id que en la estructura HTML
      document.getElementById("where-ans").textContent =
        capitalizeFirstLetter(bestPROF.join(" o ")) || "No encontrado";
      document.getElementById("when-ans").textContent =
        "Temps de malestar: " +
        (capitalizeFirstLetter(bestT_VISITA.join(" o ")) || "No encontrado");
      document.getElementById("how-ans").textContent =
        "Tipus de malestar: " +
        (capitalizeFirstLetter(bestCom.join(" o ")) || "No encontrado");
    } catch (error) {
      console.error("Error en el procesamiento de resposta_m.html:", error);
    }
    addRedirectListener("btn-Siguiente2", "contacto.html");

  }





  // -------------------------------
  // Invocación según la página actual
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
    case "malestares.html":
      await handleMalestaresPage();
      break;
    case "resposta_m.html":
      await handleRespostaMalestaresProcessing();
      break;
    default:
      break;
  }
});
