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



const data = {
  "ALTRES": {
      "CONTROL CRÒNIC DE TENSÓ/DM/CONTROL CRÓNICO DE TENSIÓN Y DIABETES": [],
      "DEMANDA MATERIAL SANITARI": [],
      "IMPRESSIÓ/ENVIAMENT PAUTA TAO": [],
      "INFORME MÈDIC": [],
      "INFORME PODÒLEG": [],
      "PAO": [],
      "PRIMERA CURA": [],
      "SEGUIMENT DE LA CURA/SEGUIMIENTO DE CURA": [],
      "SOL·LICITUD FARMÀCIA EXCLOSA": [],
      "SOL·LICITUD HISTÒRIA CLÍNICA": [],
      "VISITA DE SEGUIMENT CRÒNIC/VISITA DE SEGUIMIENTO CRÓNICO": []
  },
  "ASSISTENCIA": {
      "CONSULTA MEDICACIÓ": [],
      "CONSULTA SOBRE PROBLEMES DE SALUT": [],
      "CONSULTA SOBRE TRACTAMENT": [],
      "CONSULTES SOBRE CERTIFICATS DE VACUNACIÓ": [],
      "DUBTES VACUNES": []
  },
  "BAIXES": {
      "BAIXA IT (altres motius no COVID19)": [],
      "INCIDÈNCIES IT/CONSULTES/COMUNICACIÓ ICAM": [],
      "RENOVACIÓ IT": []
  },
  "PLA DE MEDICACIÓ": {
      "RECEPTES (especialtzada/privada)": [],
      "RENOVAR PLA DE MEDICACIÓ INF": [],
      "RENOVAR PLA DE MEDICACIÓ MF": []
  },
  "PROVES": {
      "DERIVACIONS A ESPECIALISTA NO URGENT": [],
      "ECG": [],
      "ESPIROMETRIA": [],
      "ITB": [],
      "MAPA": [],
      "PETICIÓ ANALÍTICA DE CONTROL": [],
      "RESULTATS ANALÍTICA DE CONTROL": [],
      "RESULTATS ANALÍTICA URGENTE": [],
      "RESULTATS ECG DE CONTROL": [],
      "RESULTATS PROVES INTERNES O APORTADES PEL PACIENT": [],
      "RESULTATS RETINOGRAFIA": [],
      "TAO (prova)": [],
      "TAO (sol·licitud)": [],
      "TAR/PCR (prova)": [],
      "TAR/PCR (sol·licitud)": []
  },
  "VACUNES": {
      "HISTORIAL VACUNACIÓ": [],
      "INCIDÈNCIA DE VACUNES": [],
      "PETICIÓ VACUNES": []
  }
};

document.addEventListener("DOMContentLoaded", function() {
  const categoriaSelect = document.getElementById("categoria");
  const tipusSelect = document.getElementById("tipus");

  // Cargar las categorías en el primer desplegable
  Object.keys(data).forEach(categoria => {
      const option = document.createElement("option");
      option.value = categoria;
      option.textContent = categoria;
      categoriaSelect.appendChild(option);
  });

  // Cuando se elige una categoría, se llenan las opciones del segundo desplegable
  categoriaSelect.addEventListener("change", function() {
      tipusSelect.innerHTML = '<option value="">Selecciona una opció</option>'; // Reset
      tipusSelect.disabled = this.value === "";

      if (this.value) {
          Object.keys(data[this.value]).forEach(tipus => {
              const option = document.createElement("option");
              option.value = tipus;
              option.textContent = tipus;
              tipusSelect.appendChild(option);
          });
      }
  });

  document.getElementById("seguent").addEventListener("click", function() {
      if (categoriaSelect.value && tipusSelect.value) {
          alert(`Has seleccionat: ${categoriaSelect.value} → ${tipusSelect.value}`);
      } else {
          alert("Si us plau, selecciona totes les opcions.");
      }
  });
});
