// ------- Elementos del documento --------
const DOM = {
    layout: document.querySelector('.layout'),
    form: document.querySelector('#frm'),
    allInputs: document.querySelectorAll("input, textarea"),
    contrasena: document.querySelector('#contrasena'),
    mostrarContra: document.querySelector('#mostrarContra'),
    select_dni: document.querySelector('#select-dni'),
    idDni: document.querySelector('#dni'),
    classDni: document.querySelector('.dni'),
    aficionesContainer: document.querySelector('.aficiones'),
    aficionesCheckbox: document.querySelectorAll('.aficiones input[type="checkbox"]'),
    aficiones: document.querySelector('#aficiones'),
    countElements: ['titulo', 'descripcion'].map(id => ({
        input: document.querySelector(`#${id}`),
        count: document.querySelector(`#${id}Count`)
    })),
    errorContainer: document.createElement("section"),
};

// -------- Mensajes de error personalizados --------
const emptyErrorMessages = {
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

const customErrorMessages = {
    usuario: "Mínimo 4 caracteres",
    contrasena: "Solo puede introducir números",
    nombre: "Mínimo 4 caracteres",
    apellidos: "Mínimo 4 caracteres",
    telefono: "Tiene que introducir (+34) seguido de 9 dígitos",
    codPostal: "Tiene que empezar por 38 y ser 5 caracteres",
    dni: "El documento no es correcto",
};

// -------- Crear contenedor errores por --------
// -------- defecto de ValidationMessage --------
// Añadir contenedor de errores
DOM.errorContainer.classList.add("error-container");
DOM.layout.appendChild(DOM.errorContainer);


// -------- Habilitar campo dni cuando--------
// -------- se seleccione una opción --------
DOM.select_dni.addEventListener('change', () => {
    const isDni = DOM.select_dni.value === 'dni';
    const pattern = isDni ? '^\\d{8}[A-Za-z]$' : '^[A-Za-z]\\d{7}[A-Za-z]$';
    const placeholder = isDni ? 'Ejem: 11122233A' : 'Ejem: A11122233B';

    DOM.idDni.disabled = false;
    DOM.idDni.focus();
    DOM.idDni.setAttribute('pattern', pattern);
    DOM.idDni.placeholder = placeholder;
});

// -------- Mostrar o ocultar contraseña --------
DOM.mostrarContra.addEventListener("click", () => {
    DOM.contrasena.type = (DOM.contrasena.type === "password") ? "text" : "password";
});

// -------- Control de contador de caracteres --------
DOM.countElements.forEach(({ input, count }) => {
    input.addEventListener("input", () => count.textContent = input.value.length);
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

    if (aficionesChecked.length <= 1) {
        isValid = false;
        DOM.aficiones.setCustomValidity("Debes seleccionar al menos 2 aficiones");
    } else {
        DOM.aficiones.setCustomValidity("");
        DOM.aficiones.value = aficionesChecked.join(", ");
    }

    DOM.allInputs.forEach((input) => {
        input.classList.add("validated");

        if (!input.validity.valid || input.disabled == true) {
            isValid = false;
            err.push(input.id);
            inputs.push(input);
        }
    });

    if (!isValid) {
        e.preventDefault();

        if (aficionesChecked.length <= 1) err.push("aficiones");
        createErrElements(err);
        createDefaultErrors(inputs);
    }
});

// -------- Método para crear mensajes de --------
// -------- error cuando se pierda el foco --------
function handleValidation(input) {
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
function checkAficiones() {
    return [...DOM.aficionesCheckbox].filter(input => input.checked).map(input => input.value);
}

// -------- Método para crear mensajes de error --------
function createErrElements(err) {
    err.forEach(errMessage => {
        let existingError = document.querySelector(`#${errMessage}Err`);
        if (existingError) existingError.remove();

        let errorSpan = document.createElement("span");
        errorSpan.id = `${errMessage}Err`;
        errorSpan.classList.add("errorMessage");
        errorSpan.textContent = emptyErrorMessages[errMessage];

        if (errMessage != "dni") {
            document.querySelector(`#${errMessage}`).insertAdjacentElement("afterend", errorSpan);
        } else {
            DOM.classDni.insertAdjacentElement("beforeend", errorSpan);
        }
    });
}

// -------- Método para crear mensajes de error por defecto --------
function createDefaultErrors(inputs) {
    inputs.forEach(input => {
        let existingError = document.querySelector(`#${input.id}DefaultErr`);
        if (existingError) existingError.remove();

        let errorSpan = document.createElement("span");
        errorSpan.id = `${input.id}DefaultErr`;
        errorSpan.textContent = `${input.id}: ${input.validationMessage}`;
        DOM.errorContainer.insertAdjacentElement("beforeend", errorSpan);
    });
}
