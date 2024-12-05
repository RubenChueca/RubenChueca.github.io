// ------- Elementos del documento --------
const DOM = {
    layout: document.querySelector('.layout'),
    form: document.querySelector('#frm'),
    allInputs: document.querySelectorAll("input, textarea"),
    contrasena: document.querySelector('#contrasena'),
    mostrarContra: document.querySelector('#mostrarContra'),
    select_dni: document.querySelector('#select-dni'),
    IdDni: document.querySelector('#dni'),
    classDni: document.querySelector('.dni'),
    aficionesContainer: document.querySelector('.aficiones'),
    aficionesCheckbox: document.querySelectorAll('.aficiones input[type="checkbox"]'),
    aficiones: document.querySelector('#aficiones'),
    titulo: document.querySelector('#titulo'),
    tituloCount: document.querySelector('#tituloCount'),
    descripcion: document.querySelector('#descripcion'),
    descripcionCount: document.querySelector('#descripcionCount'),
    errorContainer: document.querySelector('.error-container'),
    aficionesErr: document.querySelector("#aficionesErr"),
};

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
    descripcion: "La descripción de la publicación es obligatoria",
    aficiones: "Tienes que seleccionar al menos dos aficiones",
};

// -------- Crear contenedor errores por --------
// -------- defecto de ValidationMessage --------
(() => {
    let errorContainer = document.createElement("div");
    errorContainer.classList.add("error-container");
    DOM.layout.appendChild(errorContainer);
})();


// -------- Habilitar campo dni cuando--------
// -------- se seleccione una opción --------
DOM.select_dni.addEventListener('change', () => {
    if (DOM.select_dni.value === 'dni') {
        DOM.IdDni.disabled = false;
        DOM.IdDni.focus();
        DOM.IdDni.setAttribute('pattern', '^\\d{8}[A-Za-z]$');
        DOM.IdDni.placeholder = 'Ejem: 11122233A';
    } else if (DOM.select_dni.value === 'nie') {
        DOM.IdDni.disabled = false;
        DOM.IdDni.focus();
        DOM.IdDni.setAttribute('pattern', '^[A-Za-z]\\d{7}[A-Za-z]$');
        DOM.IdDni.placeholder = 'Ejem: A11122233B';
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
DOM.allInputs.forEach((input) => {
    input.addEventListener("blur", () => {
        input.classList.add("validated");
        handleValidation(input);
    });
});

// -------- Validación formulario --------
DOM.form.addEventListener("submit", (e) => {
    let isValid = true;
    let aficionesChecked = checkAficiones();
    let err = [];
    let inputs = [];

    DOM.allInputs.forEach((input) => {
        input.classList.add("validated");

        if (!input.validity.valid || input.disabled == true) {
            isValid = false;
            err.push(input.id);
            inputs.push(input);
        }
    });

    if (aficionesChecked.length < 2) {
        isValid = false;
    } else {
        DOM.aficiones.value = aficionesChecked.join(", ");
    }

    if (!isValid) {
        e.preventDefault();

        if (aficionesChecked.length <= 1) err.push("aficiones");
        createErrElements(err);
        createDefaultErrors(inputs, err);
    }
});

// -------- Método para crear mensajes de --------
// -------- error cuando se pierda el foco --------
export function handleValidation(input) {
    let errorSpan = document.querySelector(`#${input.id}Err`);
    if (input.validity.valid) {
        if (errorSpan) errorSpan.remove();
    } else {
        if (!errorSpan) {
            errorSpan = document.createElement("span");
            errorSpan.id = `${input.id}Err`;
            errorSpan.classList.add("errorMessage");
            errorSpan.textContent = errorMessages[input.id];
            input.id !== "dni"
                ? input.insertAdjacentElement("afterend", errorSpan)
                : DOM.classDni.insertAdjacentElement("beforeend", errorSpan);
        }
    }
}

// -------- Método para comprobar si --------
// -------- hay aficiones seleccionadas --------
export function checkAficiones() {
    let aficionesInputs = DOM.aficionesCheckbox;
    let arrAficiones = [];

    aficionesInputs.forEach(input => {
        if (input.checked) {
            arrAficiones.push(input.value);
        }
    });

    return arrAficiones;
}

// -------- Método para crear mensajes de error --------
export function createErrElements(err) {
    err.forEach(errMessage => {
        let existingError = document.querySelector(`#${errMessage}Err`);
        if (existingError) existingError.remove();

        let errorSpan = document.createElement("span");
        errorSpan.id = `${errMessage}Err`;
        errorSpan.classList.add("errorMessage");
        errorSpan.textContent = errorMessages[errMessage];

        if (errMessage != "dni") {
            document.querySelector(`#${errMessage}`).insertAdjacentElement("afterend", errorSpan);
        } else {
            DOM.classDni.insertAdjacentElement("beforeend", errorSpan);
        }
    });
}

// -------- Método para crear mensajes de error por defecto --------
export function createDefaultErrors(inputs, err) {
    inputs.forEach(input => {
        let errorSpan = document.createElement("span");
        errorSpan.classList.add("errorMessage");
        errorSpan.textContent = input.validationMessage;
        DOM.errorContainer.insertAdjacentElement("beforeend", errorSpan);
    })
}
