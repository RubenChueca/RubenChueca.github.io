// ------- ELEMENTOS DEL DOM --------
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

// -------- Crear contenedor errores por --------
// -------- defecto de ValidationMessage --------
DOM.errorContainer.classList.add("error-container");
DOM.layout.appendChild(DOM.errorContainer);

// -------- MENSAJES DE ERROR --------
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
    contrasena: "La contraseña debe tener 8 números",
    nombre: "Mínimo 4 caracteres",
    apellidos: "Mínimo 4 caracteres",
    telefono: "Tiene que introducir (+34) seguido de 9 dígitos",
    codPostal: "Tiene que empezar por 38 y ser 5 caracteres",
    dni: "El documento no es correcto",
};

// -------- EVENTOS --------

// -------- Habilitar campo dni cuando--------
// -------- se seleccione una opción --------
DOM.select_dni.addEventListener('change', () => {
    const isDni = DOM.select_dni.value === 'DNI';
    const pattern = isDni ? '^\\d{8}[A-Z]$' : '^[XYZ]\\d{7}[A-Z]$';
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
    input.addEventListener("input", () => {
        input.classList.add("validated");

        if (input.id == "dni") {
            checkDniNie(input);
        }
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

        if (aficionesChecked.length < 2 && input.id == "aficiones") {
            isValid = false;
            err.push(input.id);
            inputs.push(input);
        }
    });

    if (!isValid) {
        e.preventDefault();

        if (aficionesChecked.length < 2) err.push("aficiones");
        createErrElements(err);
        createDefaultErrors(inputs);
    }
});

// -------- MÉTODOS --------

// -------- Método para comprobar si --------
// -------- hay aficiones seleccionadas --------
export function checkAficiones() {
    return [...DOM.aficionesCheckbox].filter(input => input.checked).map(input => input.value);
}

export function checkDniNie(input) {
    // Tabla de letras de control
    const letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B',
        'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];
    const nieRegex = /^[XYZ]\d{7}[A-Z]$/;
    const valor = input.value;
    let numero;

    if (nieRegex.test(valor)) {
        const letraInicial = valor.charAt(0);
        const reemplazo = { 'X': '0', 'Y': '1', 'Z': '2' };
        numero = reemplazo[letraInicial] + valor.slice(1, -1);
    } else {
        numero = valor.slice(0, -1);
    }

    const resto = parseInt(numero) % 23;

    const letraCorrecta = letras[resto];
    const letraIntroducida = valor.slice(-1);

    (letraCorrecta !== letraIntroducida) ? input.setCustomValidity("El documento no es correcto") : input.setCustomValidity("");
}

// -------- Método para crear mensajes de --------
// -------- error cuando se pierda el foco --------
export function handleValidation(input) {
    let errorSpan = document.querySelector(`#${input.id}Err`);

    if (errorSpan) errorSpan.remove();

    if (!input.validity.valid) {
        errorSpan = document.createElement("span");
        errorSpan.id = `${input.id}Err`;
        errorSpan.classList.add("errorMessage");
        errorSpan.textContent = (input.value == "") ? emptyErrorMessages[input.id] : customErrorMessages[input.id];
        input.id !== "dni"
            ? input.insertAdjacentElement("afterend", errorSpan)
            : DOM.classDni.insertAdjacentElement("beforeend", errorSpan);
    }
}


// -------- Método para crear mensajes de error --------
export function createErrElements(err) {
    err.forEach(errMessage => {
        let existingError = document.querySelector(`#${errMessage}Err`);
        if (existingError) existingError.remove();

        let errorSpan = document.createElement("span");
        errorSpan.id = `${errMessage}Err`;
        errorSpan.classList.add("errorMessage");
        errorSpan.textContent = (document.querySelector(`#${errMessage}`).value == "") ? emptyErrorMessages[errMessage] : customErrorMessages[errMessage];

        if (errMessage != "dni") {
            document.querySelector(`#${errMessage}`).insertAdjacentElement("afterend", errorSpan);
        } else {
            DOM.classDni.insertAdjacentElement("beforeend", errorSpan);
        }
    });
}

// -------- Método para crear mensajes de error por defecto --------
export function createDefaultErrors(inputs) {
    inputs.forEach(input => {
        let existingError = document.querySelector(`#${input.id}DefaultErr`);
        if (existingError) existingError.remove();

        let errorSpan = document.createElement("span");
        errorSpan.classList.add("errorDftMessage");
        errorSpan.id = `${input.id}DefaultErr`;

        if (input.validationMessage != "") {
            errorSpan.textContent = `${input.id}: ${input.validationMessage}`;
        } else {
            errorSpan.textContent = `${input.id}: No devuelve mensaje por defecto`;
        }
        DOM.errorContainer.insertAdjacentElement("beforeend", errorSpan);
    });
}
