// Variables de estado
let currentAlgorithm = '';
let currentDataType = '';
const inputList = document.getElementById('input-list');
const feedback = document.getElementById('input-feedback');

// Función central para cambiar de "página" (sección)
function showSection(sectionId) {
    // Oculta todas las secciones
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('data-type-selection').classList.add('hidden');
    document.getElementById('sorting-interface').classList.add('hidden');
    document.getElementById('about').classList.add('hidden');
    
    // Muestra solo la sección deseada
    document.getElementById(sectionId).classList.remove('hidden');

    // Lógica para el botón "Regresar a Principal" en el menú desplegable
    const returnLink = document.getElementById('return-link');
    if (sectionId !== 'main-menu') {
        returnLink.classList.remove('hidden');
    } else {
        returnLink.classList.add('hidden');
    }
}

// 1. Selecciona el Algoritmo
function selectAlgorithm(alg) {
    currentAlgorithm = alg;
    document.getElementById('algorithm-name').textContent = alg.charAt(0).toUpperCase() + alg.slice(1);
    showSection('data-type-selection');
}

// 2. Selecciona el Tipo de Dato
function selectDataType(type) {
    currentDataType = type;
    document.getElementById('alg-interface-name').textContent = currentAlgorithm.charAt(0).toUpperCase() + currentAlgorithm.slice(1);
    document.getElementById('type-name').textContent = type.charAt(0).toUpperCase() + type.slice(1);
    
    // Limpieza de interfaz al cambiar de tipo
    inputList.value = ''; 
    feedback.textContent = ''; // Limpia el mensaje de error de restricción
    document.getElementById('resultado').textContent = 'Esperando entrada...';
    
    showSection('sorting-interface');
}

// --- FUNCIONES DE RESTRICCIÓN DE ENTRADA ---

// 3. Restringe la entrada en tiempo real (al escribir o pegar)
function restrictInput(event) {
    if (currentDataType === '') return;

    const textarea = event.target;
    let value = textarea.value;
    let newValue = '';
    let invalidCharFound = false;

    // Patrón: Solo dígitos, comas y espacios.
    const numericPattern = /[0-9,\s-]/; 
    // Patrón: Solo letras, comas y espacios. (Acentuación incluida)
    const alphabeticPattern = /[a-zA-ZáéíóúÁÉÍÓÚñÑ,\s]/; 

    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        
        let isValid = false;
        
        if (currentDataType === 'numerico') {
            isValid = numericPattern.test(char);
        } else if (currentDataType === 'alfabetico') {
            isValid = alphabeticPattern.test(char);
        }

        if (isValid) {
            newValue += char;
        } else {
            invalidCharFound = true;
        }
    }

    if (invalidCharFound) {
        if (currentDataType === 'numerico') {
            feedback.textContent = '⛔ Solo se permiten números, comas, guiones y espacios.';
        } else {
            feedback.textContent = '⛔ Solo se permiten letras, comas y espacios.';
        }
    } else {
        feedback.textContent = '';
    }

    textarea.value = newValue;
}

// 4. Maneja la pulsación de teclas (evita que se muestre el carácter no válido)
function handleKeyDown(event) {
    if (currentDataType === '') return;

    const key = event.key;
    const isControlKey = key === 'Backspace' || key === 'Delete' || key === 'ArrowLeft' || key === 'ArrowRight' || event.ctrlKey || event.metaKey;

    if (isControlKey) return;

    // Permitir comas y espacios en ambos modos
    if (key === ',' || key === ' ') return;

    let isValid = false;

    if (currentDataType === 'numerico') {
        // Permitir dígitos y guiones (para negativos)
        if (/[0-9-]/.test(key)) {
            isValid = true;
        }
    } else if (currentDataType === 'alfabetico') {
        // Permitir letras (incluyendo acentos y Ñ)
        if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(key)) {
            isValid = true;
        }
    }

    if (!isValid) {
        event.preventDefault(); // Detiene la acción de la tecla
    }
}


// --- LÓGICA DE ORDENAMIENTO ---

function sortList(order) {
    const input = inputList.value.trim();
    let items = input.split(',').map(item => item.trim()).filter(item => item.length > 0);
    let sortedArray = [];
    
    if (items.length === 0) {
        document.getElementById('resultado').textContent = 'Error: Por favor, ingresa elementos.';
        return;
    }

    // 3.1. Parsing y Validación final
    if (currentDataType === 'numerico') {
        const numbers = items.map(Number);
        if (numbers.some(n => isNaN(n))) {
            document.getElementById('resultado').textContent = 'Error: ¡Asegúrate de ingresar solo números válidos!';
            return;
        }
        sortedArray = numbers;
    } else if (currentDataType === 'alfabetico') {
        sortedArray = items;
    }

    // 3.2. Aplicación del Algoritmo
    switch (currentAlgorithm) {
        case 'seleccion':
            sortedArray = selectionSort(sortedArray, order);
            break;
        case 'burbuja':
            sortedArray = bubbleSort(sortedArray, order);
            break;
        case 'insercion':
            sortedArray = insertionSort(sortedArray, order);
            break;
    }
    
    // 3.3. Mostrar Resultado
    const resultText = sortedArray.join(', ');
    document.getElementById('resultado').textContent = resultText;
}

// Función de comparación genérica
function compare(a, b, order) {
    if (order === 'ascendente') {
        return a > b;
    } else { // descendente
        return a < b;
    }
}

// Implementaciones de los Algoritmos (sin cambios importantes)
function selectionSort(arr, order) {
    const n = arr.length;
    const newArr = [...arr];
    for (let i = 0; i < n - 1; i++) {
        let extremumIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (compare(newArr[extremumIndex], newArr[j], order)) {
                extremumIndex = j;
            }
        }
        if (extremumIndex !== i) {
            [newArr[i], newArr[extremumIndex]] = [newArr[extremumIndex], newArr[i]];
        }
    }
    return newArr;
}

function bubbleSort(arr, order) {
    const n = arr.length;
    const newArr = [...arr];
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            if (compare(newArr[j], newArr[j + 1], order)) {
                [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]];
            }
        }
    }
    return newArr;
}

function insertionSort(arr, order) {
    const n = arr.length;
    const newArr = [...arr];
    for (let i = 1; i < n; i++) {
        let current = newArr[i];
        let j = i - 1;
        while (j >= 0 && compare(newArr[j], current, order)) {
            newArr[j + 1] = newArr[j];
            j--;
        }
        newArr[j + 1] = current;
    }
    return newArr;
}

// Inicia mostrando el menú principal al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('main-menu');
});
