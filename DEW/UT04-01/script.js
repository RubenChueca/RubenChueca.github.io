// ------- Elementos del documento --------
const DOM = {
    form: document.querySelector('#frm'),
    inputs: document.querySelectorAll("input, textarea"),
    select_dni: document.querySelector('#select-dni'),
    mostrarContra: document.querySelector('#mostrarContra'),
    titulo: document.querySelector('#titulo'),
    tituloCount: document.querySelector('#tituloCount'),
    descripcion: document.querySelector('#descripcion'),
    descripcionCount: document.querySelector('#descripcionCount'),
    errorContainer: document.querySelector('#error-container'),
}

// -------- Mensajes de error personalizados --------
const errorMessages = {
    usuario: "El nombre de usuario es obligatorio",
    contrasena: "La contraseña es obligatoria",
    nombre: "El nombre es obligatorio",
    apellidos: "Los apellidos son obligatorios",
    telefono: "El teléfono es obligatorio",
    codPostal: "El código postal es obligatorio",
    dni: "El DNI / NIE es obligatorio",
    titulo: "El título de la publicación es obligatorio",
    descripcion: "La descripción de la publicación es obligatoria"
}

// -------- Habilitar campo dni cuando--------
// -------- se seleccione una opción --------
DOM.select_dni.addEventListener('change', () => {
    const dniInput = document.getElementById('dni');
    dniInput.disabled = false;
});

// -------- Mostrar o ocultar contraseña --------
DOM.mostrarContra.addEventListener("click", () => {
    let inputPass = document.querySelector("#contrasena");

    if (inputPass.type === "password") {
        inputPass.type = "text";
    } else {
        inputPass.type = "password";
    }
})

// -------- Control de contador de caracteres --------
DOM.titulo.addEventListener("input", () => {
    let inputTitulo = document.querySelector("#titulo");
    let inputLength = inputTitulo.value.length;

    DOM.tituloCount.textContent = inputLength;
});

DOM.descripcion.addEventListener("input", () => {
    let inputDescripcion = document.querySelector("#descripcion");
    let inputLength = inputDescripcion.value.length;

    DOM.descripcionCount.textContent = inputLength;
});

// -------- Añadir clase validated cuando --------
// -------- un input pierda el foco --------
DOM.inputs.forEach((input) => {
    input.addEventListener("blur", () => {
        input.classList.add("validated");
    });
});

// -------- Validación formulario --------
DOM.form.addEventListener("submit", (e) => {
    let isValid = true;
    let err = [];

    DOM.inputs.forEach((input) => {
        input.classList.add("validated");

        if (!input.checkValidity() || input.disabled == true) {
            isValid = false;
            err.push(input);
        }
    });

    if (!isValid) {
        e.preventDefault();
        createErrElements(err);

        err.forEach(({ id }) => {
            let mensaje = errorMessages[id];
            document.querySelector(`#${id}Err`).textContent = mensaje;
        });

        if (checkAficiones() == 0) {
            document.querySelector('#aficionesErr').textContent = "Tienes que seleccionar al menos una afición";
        }
    }
});

// -------- Método para comprobar si --------
// -------- hay aficiones seleccionadas --------
function checkAficiones() {
    let aficiones = document.querySelectorAll('.aficiones input[type="checkbox"]');
    let aficionesCount = 0;

    aficiones.forEach(aficion => {
        if (aficion.checked) aficionesCount++
    });

    return aficionesCount;
}

// -------- Método para crear mensajes de error --------
function createErrElements(err) {
    // Limpiar contenido de errorContainer
    DOM.errorContainer.replaceChildren();

    err.forEach(({ id }) => {
        let span = document.createElement("span");
        span.id = `${id}Err`;
        DOM.errorContainer.appendChild(span);
    });

    let span = document.createElement("span");
    span.id = "aficionesErr";

    DOM.errorContainer.appendChild(span);
}