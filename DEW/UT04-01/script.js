// Deshabilitar campo de texto dni si no se selecciona una opción
document.querySelector('#select-dni').addEventListener('change', () => {
    const dniInput = document.getElementById('dni');
    dniInput.disabled = this.value === "";
});

// Mostrar o ocultar contraseña
document.querySelector("#mostrarContra").addEventListener("click", () => {
    let inputPass = document.querySelector("#contrasenia");

    if (inputPass.type === "password") {
        inputPass.type = "text";
    } else {
        inputPass.type = "password";
    }
})


// Control de contador de caracteres
document.querySelector("#titulo").addEventListener("input", () => {
    let inputTitulo = document.querySelector("#titulo");
    let inputLength = inputTitulo.value.length;

    document.querySelector("#tituloCount").textContent = inputLength;
});

document.querySelector("#descripcion").addEventListener("input", () => {
    let inputTitulo = document.querySelector("#descripcion");
    let inputLength = inputTitulo.value.length;

    document.querySelector("#descripcionCount").textContent = inputLength;
});