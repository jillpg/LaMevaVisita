document.addEventListener("DOMContentLoaded", () => {
  // Seleccionamos el botón de la pantalla anterior
  const btnSiguiente = document.getElementById("btnSiguiente");

  // Si el botón existe en la página, añadimos el evento
  if (btnSiguiente) {
      btnSiguiente.addEventListener("click", () => {
          // Redirigir a la nueva pantalla de consulta
          window.location.href = "consulta.html"; // Asegúrate de que la ruta sea correcta
      });
  }
});
