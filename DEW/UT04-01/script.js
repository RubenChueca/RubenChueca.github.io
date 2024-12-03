// ------- Elementos del documento --------
const DOM = {
    form: document.querySelector('#frm'),
    inputs: document.querySelectorAll("input, textarea"),
    select_dni: document.querySelector('#select-dni'),
    dni: document.querySelector('#dni'),
    mostrarContra: document.querySelector('#mostrarContra'),
    titulo: document.querySelector('#titulo'),
    tituloCount: document.querySelector('#tituloCount'),
    descripcion: document.querySelector('#descripcion'),
    descripcionCount: document.querySelector('#descripcionCount'),
    aficiones: document.querySelector('#aficiones'),
    errorContainer: document.querySelector('#error-container'),
    contrasena: document.querySelector("#contrasena"),
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
    if (DOM.select_dni.value === 'dni') {
        DOM.dni.disabled = false;
        DOM.dni.setAttribute('pattern', '^\\d{8}[A-Za-z]$');
        DOM.dni.placeholder = 'Ejem: 11122233A';
    } else if (DOM.select_dni.value === 'nie') {
        DOM.dni.disabled = false;
        DOM.dni.setAttribute('pattern', '^[A-Za-z]\\d{7}[A-Za-z]$');
        DOM.dni.placeholder = 'Ejem: A11122233B';
    }
});

// -------- Mostrar o ocultar contraseña --------
DOM.mostrarContra.addEventListener("click", () => {
    DOM.contrasena.type = (DOM.contrasena.type === "password") ? "text" : "password";
});

// -------- Control de contador de caracteres --------
[DOM.titulo, DOM.descripcion].forEach(input => {
    input.addEventListener("input", () => {
        document.querySelector(`#${input.id}Count`).textContent = input.value.length;
    });
});

// -------- Añadir clase validated cuando --------
// -------- un input pierda el foco --------
DOM.inputs.forEach((input) => {
    input.addEventListener("blur", () => {
        input.classList.add("validated");
        handleValidation(input);
    });
});

function handleValidation(input) {
    let errorSpan = document.querySelector(`#${input.id}Err`);
    if (input.validity.valid) {
        if (errorSpan) errorSpan.remove();
    } else {
        if (!errorSpan) {
            errorSpan = document.createElement("span");
            errorSpan.id = `${input.id}Err`;
            errorSpan.style.color = "red";
            errorSpan.textContent = errorMessages[input.id];
            input.id !== "dni"
                ? input.insertAdjacentElement("afterend", errorSpan)
                : document.querySelector(".dni").insertAdjacentElement("beforeend", errorSpan);
        }
    }
}

// -------- Validación formulario --------
DOM.form.addEventListener("submit", (e) => {
    let isValid = true;
    let aficionesChecked = checkAficiones();
    let err = [];

    DOM.inputs.forEach((input) => {
        input.classList.add("validated");

        if (!input.validity.valid || input.disabled == true) {
            isValid = false;
            err.push(input);
        }
    });

    if (aficionesChecked.length <= 1) {
        isValid = false;
    } else {
        DOM.aficiones.value = aficionesChecked.join(", ");
    }

    if (!isValid) {
        e.preventDefault();
        createErrElements(err, aficionesChecked);
    }
});

// -------- Método para comprobar si --------
// -------- hay aficiones seleccionadas --------
function checkAficiones() {
    let aficionesInputs = document.querySelectorAll('.aficiones input[type="checkbox"]');
    let arrAficiones = [];

    aficionesInputs.forEach(input => {
        if (input.checked) {
            arrAficiones.push(input.value);
        }
    });

    return arrAficiones;
}

// -------- Método para crear mensajes de error --------
function createErrElements(err, aficionesChecked) {
    // Limpiar contenido de errorContainer
    err.forEach(({ id }) => {
        let existingError = document.querySelector(`#${id}Err`);
        if (existingError) existingError.remove();

        let span = document.createElement("span");
        span.id = `${id}Err`;
        span.style.color = "red";
        span.textContent = errorMessages[id];

        if (id != "dni") {
            document.querySelector(`#${id}`).insertAdjacentElement("afterend", span);
        } else {
            document.querySelector('.dni').insertAdjacentElement("beforeend", span);
        }
    });

    if (aficionesChecked.length <= 1) {
        let existingError = document.querySelector("#aficionesErr");
        if (existingError) existingError.remove();

        let span = document.createElement("span");
        span.id = "aficionesErr";
        span.style.color = "red";
        span.textContent = "Tienes que seleccionar al menos dos aficiones";
        document.querySelector('.aficiones').insertAdjacentElement("beforeend", span);
    }
}
