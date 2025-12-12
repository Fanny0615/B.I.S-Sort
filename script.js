// Variables de estado
let algoritmoActual = '';
let tipoDatoActual = '';
const listaEntrada = document.getElementById('lista-entrada');
const retroalimentacion = document.getElementById('retroalimentacion-entrada');
const resultadoDiv = document.getElementById('resultado-ordenado');


// Función central para cambiar de "página" (sección)
function mostrarSeccion(idSeccion) {
    // Oculta todas las secciones
    document.getElementById('menu-principal').classList.add('hidden');
    document.getElementById('seleccion-tipo-dato').classList.add('hidden');
    document.getElementById('interfaz-ordenamiento').classList.add('hidden');
    document.getElementById('acerca-de').classList.add('hidden');
    
    // Muestra solo la sección deseada
    document.getElementById(idSeccion).classList.remove('hidden');

    // Lógica para el botón "Regresar a Principal"
    const enlaceRegresar = document.getElementById('enlace-regresar');
    if (idSeccion !== 'menu-principal') {
        enlaceRegresar.classList.remove('hidden');
    } else {
        enlaceRegresar.classList.add('hidden');
    }
}

// 1. Selecciona el Algoritmo
function seleccionarAlgoritmo(alg) {
    algoritmoActual = alg;
    document.getElementById('nombre-algoritmo').textContent = alg.charAt(0).toUpperCase() + alg.slice(1);
    mostrarSeccion('seleccion-tipo-dato');
}

// 2. Selecciona el Tipo de Dato
function seleccionarTipoDato(tipo) {
    tipoDatoActual = tipo;
    document.getElementById('nombre-alg-interfaz').textContent = algoritmoActual.charAt(0).toUpperCase() + algoritmoActual.slice(1);
    document.getElementById('nombre-tipo').textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    
    // Limpieza de interfaz al cambiar de tipo
    listaEntrada.value = ''; 
    retroalimentacion.textContent = '';
    resultadoDiv.textContent = 'Esperando entrada...';
    
    mostrarSeccion('interfaz-ordenamiento');
}

// --- FUNCIONES DE RESTRICCIÓN DE ENTRADA ---

function restringirEntrada(evento) {
    if (tipoDatoActual === '') return;

    const textarea = evento.target;
    let valor = textarea.value;
    let nuevoValor = '';
    let caracterInvalidoEncontrado = false;

    const patronNumerico = /[0-9,\s-]/; 
    const patronAlfabetico = /[a-zA-ZáéíóúÁÉÍÓÚñÑ,\s]/; 

    for (let i = 0; i < valor.length; i++) {
        const caracter = valor[i];
        let esValido = false;
        
        if (tipoDatoActual === 'numerico') {
            esValido = patronNumerico.test(caracter);
        } else if (tipoDatoActual === 'alfabetico') {
            esValido = patronAlfabetico.test(caracter);
        }

        if (esValido) {
            nuevoValor += caracter;
        } else {
            caracterInvalidoEncontrado = true;
        }
    }


    textarea.value = nuevoValor;
}

function manejarTecla(evento) {
    if (tipoDatoActual === '') return;

    const tecla = evento.key;
    const esTeclaControl = tecla === 'Backspace' || tecla === 'Delete' || tecla === 'ArrowLeft' || tecla === 'ArrowRight' || evento.ctrlKey || evento.metaKey;

    if (esTeclaControl) return;

    if (tecla === ',' || tecla === ' ') return;

    let esValido = false;

    if (tipoDatoActual === 'numerico') {
        if (/[0-9-]/.test(tecla)) {
            esValido = true;
        }
    } else if (tipoDatoActual === 'alfabetico') {
        if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(tecla)) {
            esValido = true;
        }
    }

    if (!esValido) {
        evento.preventDefault(); 
    }
}


// --- LÓGICA DE ORDENAMIENTO DE ALGORITMOS PUROS ---

function ordenarLista(orden) {
    const entrada = listaEntrada.value.trim();
    let elementos = entrada.split(',').map(item => item.trim()).filter(item => item.length > 0);
    let resultadoFinal = [];
    
    if (elementos.length === 0) {
        resultadoDiv.textContent = 'Error: Por favor, ingresa elementos.';
        return;
    }

    let arr = [];
    
    // Parsing y Validación final
    if (tipoDatoActual === 'numerico') {
        const numeros = elementos.map(Number);
        if (numeros.some(n => isNaN(n))) {
            resultadoDiv.textContent = 'Error: ¡Asegúrate de ingresar solo números válidos!';
            return;
        }
        arr = numeros;
    } else if (tipoDatoActual === 'alfabetico') {
        arr = elementos;
    }

    // Aplicación del Algoritmo
    switch (algoritmoActual) {
        case 'seleccion':
            resultadoFinal = ordenamientoSeleccion(arr, orden);
            break;
        case 'burbuja':
            resultadoFinal = ordenamientoBurbuja(arr, orden);
            break;
        case 'insercion':
            resultadoFinal = ordenamientoInsercion(arr, orden);
            break;
    }
    
    // Mostrar Resultado
    const textoResultado = resultadoFinal.join(', ');
    resultadoDiv.textContent = textoResultado;
}


// Función de comparación genérica
function comparar(a, b, orden) {
    if (orden === 'ascendente') {
        return a > b;
    } else { 
        return a < b;
    }
}

// 1. Ordenamiento por Selección
function ordenamientoSeleccion(arr, orden) {
    const n = arr.length;
    const nuevoArr = [...arr];

    for (let i = 0; i < n - 1; i++) {
        let indiceExtremo = i;
        
        for (let j = i + 1; j < n; j++) {
            if (comparar(nuevoArr[indiceExtremo], nuevoArr[j], orden)) {
                indiceExtremo = j;
            }
        }

        if (indiceExtremo !== i) {
            // Intercambio
            [nuevoArr[i], nuevoArr[indiceExtremo]] = [nuevoArr[indiceExtremo], nuevoArr[i]];
        }
    }
    return nuevoArr;
}

// 2. Ordenamiento de Burbuja
function ordenamientoBurbuja(arr, orden) {
    const n = arr.length;
    const nuevoArr = [...arr];
    let intercambiado;

    for (let i = 0; i < n - 1; i++) {
        intercambiado = false;

        for (let j = 0; j < n - 1 - i; j++) {
            if (comparar(nuevoArr[j], nuevoArr[j + 1], orden)) {
                // Intercambio
                [nuevoArr[j], nuevoArr[j + 1]] = [nuevoArr[j + 1], nuevoArr[j]];
                intercambiado = true;
            }
        }
        if (!intercambiado) break; 
    }
    return nuevoArr;
}

// 3. Ordenamiento por Inserción
function ordenamientoInsercion(arr, orden) {
    const n = arr.length;
    const nuevoArr = [...arr];

    for (let i = 1; i < n; i++) {
        let actual = nuevoArr[i];
        let j = i - 1;
        
        // Desplaza los elementos
        while (j >= 0 && comparar(nuevoArr[j], actual, orden)) {
            nuevoArr[j + 1] = nuevoArr[j];
            j--;
        }
        
        nuevoArr[j + 1] = actual;
    }
    return nuevoArr;
}

// Inicia mostrando el menú principal al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarSeccion('menu-principal');
});
