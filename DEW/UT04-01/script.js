const DOM = {
    form: document.querySelector('#frm'),
    select_dni: document.querySelector('#select-dni'),
    mostrarContra: document.querySelector('#mostrarContra'),
    titulo: document.querySelector('#titulo'),
    tituloCount: document.querySelector('#tituloCount'),
    descripcion: document.querySelector('#descripcion'),
    descripcionCount: document.querySelector('#descripcionCount')
}

// Deshabilitar campo de texto dni si no se selecciona una opción
DOM.select_dni.addEventListener('change', () => {
    const dniInput = document.getElementById('dni');
    dniInput.disabled = this.value === "";
});

// Mostrar o ocultar contraseña
DOM.mostrarContra.addEventListener("click", () => {
    let inputPass = document.querySelector("#contrasena");

    if (inputPass.type === "password") {
        inputPass.type = "text";
    } else {
        inputPass.type = "password";
    }
})

// Control de contador de caracteres
DOM.titulo.addEventListener("input", () => {
    let inputTitulo = document.querySelector("#titulo");
    let inputLength = inputTitulo.value.length;

    DOM.tituloCount.textContent = inputLength;
});

DOM.descripcion.addEventListener("input", () => {
    let inputTitulo = document.querySelector("#descripcion");
    let inputLength = inputTitulo.value.length;

    DOM.descripcionCount.textContent = inputLength;
});

// Validación formulario
DOM.form.addEventListener