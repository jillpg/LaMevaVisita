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
