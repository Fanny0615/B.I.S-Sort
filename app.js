const arrayContainer = document.getElementById('arrayContainer');
const SPEED = 50; // Retraso en milisegundos para la animación
let array = [];
const ARRAY_SIZE = 30; // Número de elementos en el array

// Función para generar un array aleatorio
function generateRandomArray() {
    array = [];
    for (let i = 0; i < ARRAY_SIZE; i++) {
        // Valores entre 10 y 290 para que se vean bien
        array.push(Math.floor(Math.random() * 280) + 10);
    }
    visualizeArray(array);
}

// Función para dibujar el array como barras en el DOM
function visualizeArray(arr) {
    arrayContainer.innerHTML = ''; // Limpiar el contenedor
    arr.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        // Usamos el valor como la altura en píxeles
        bar.style.height = `${value}px`;
        arrayContainer.appendChild(bar);
    });
}

// Función que introduce una pausa para la animación
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// **Algoritmo de Ordenamiento Burbuja (Bubble Sort)**
async function bubbleSort(arr) {
    const bars = arrayContainer.children;
    const n = arr.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            
            // 1. Marcar elementos para comparación
            bars[j].classList.add('bar-compare');
            bars[j + 1].classList.add('bar-compare');
            await sleep(SPEED);

            if (arr[j] > arr[j + 1]) {
                // 2. Intercambio (Swap)
                bars[j].classList.add('bar-swap');
                bars[j + 1].classList.add('bar-swap');
                
                // Intercambiar valores en el array lógico
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                
                // Intercambiar alturas en el DOM
                bars[j].style.height = `${arr[j]}px`;
                bars[j + 1].style.height = `${arr[j + 1]}px`;
                
                swapped = true;
                await sleep(SPEED);
            }
            
            // 3. Desmarcar elementos
            bars[j].classList.remove('bar-compare', 'bar-swap');
            bars[j + 1].classList.remove('bar-compare', 'bar-swap');
        }

        // Marcar el último elemento como ordenado
        bars[n - 1 - i].classList.add('bar-sorted');

        if (!swapped) break; // Si no hubo swaps, el array está ordenado
    }
    // Marcar el primer elemento restante como ordenado (índice 0)
    bars[0].classList.add('bar-sorted'); 
}
// **Algoritmo de Ordenamiento por Inserción (Insertion Sort)**
async function insertionSort(arr) {
    const bars = arrayContainer.children;
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        let current = arr[i];
        let j = i - 1;

        // Marcar el elemento actual para inserción
        bars[i].classList.add('bar-swap'); 
        await sleep(SPEED * 2);

        // Mover los elementos del sub-array ordenado que son mayores que 'current'
        while (j >= 0 && arr[j] > current) {
            
            // Marcar para comparación y movimiento
            bars[j].classList.add('bar-compare');
            bars[j + 1].classList.add('bar-compare');
            await sleep(SPEED);
            
            // Mover elemento a la derecha
            arr[j + 1] = arr[j];
            bars[j + 1].style.height = `${arr[j + 1]}px`;
            
            // Desmarcar
            bars[j].classList.remove('bar-compare');
            bars[j + 1].classList.remove('bar-compare');

            j--;
        }
        
        // Insertar 'current' en la posición correcta
        arr[j + 1] = current;
        bars[j + 1].style.height = `${current}px`;
        
        // Desmarcar el elemento 'current'
        bars[i].classList.remove('bar-swap');

        // Marcar sub-array ordenado (estilo visual, no es esencial)
        for(let k = 0; k <= i; k++) {
            bars[k].classList.add('bar-sorted');
        }
        await sleep(SPEED);
        for(let k = 0; k <= i; k++) {
            bars[k].classList.remove('bar-sorted');
        }
    }
    // Marcar todo el array como ordenado al finalizar
    for(let i = 0; i < n; i++) {
        bars[i].classList.add('bar-sorted');
    }
}
// **Algoritmo de Ordenamiento por Selección (Selection Sort)**
async function selectionSort(arr) {
    const bars = arrayContainer.children;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        bars[i].classList.add('bar-swap'); // Marcar la posición actual

        for (let j = i + 1; j < n; j++) {
            
            bars[j].classList.add('bar-compare');
            await sleep(SPEED);

            if (arr[j] < arr[min_idx]) {
                // Desmarcar el mínimo anterior si no es el primero
                if (min_idx !== i) {
                    bars[min_idx].classList.remove('bar-swap');
                }
                min_idx = j;
                bars[min_idx].classList.add('bar-swap'); // Marcar el nuevo mínimo
            }
            bars[j].classList.remove('bar-compare');
        }

        // Si el mínimo no es el elemento actual, hacer el intercambio
        if (min_idx !== i) {
            
            // Intercambiar valores en el array lógico
            [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
            
            // Intercambiar alturas en el DOM
            bars[i].style.height = `${arr[i]}px`;
            bars[min_idx].style.height = `${arr[min_idx]}px`;
            
            // Desmarcar el antiguo mínimo
            bars[min_idx].classList.remove('bar-swap');
        }

        // Desmarcar el elemento en 'i' y marcar como ordenado
        bars[i].classList.remove('bar-swap');
        bars[i].classList.add('bar-sorted');
        await sleep(SPEED * 2);
    }
    // Marcar el último elemento como ordenado
    bars[n - 1].classList.add('bar-sorted');
}
document.getElementById('bubbleSortBtn').addEventListener('click', () => {
    // Desactivar botones mientras se ordena
    disableButtons(); 
    bubbleSort([...array]).then(enableButtons);
});

document.getElementById('insertionSortBtn').addEventListener('click', () => {
    disableButtons();
    insertionSort([...array]).then(enableButtons);
});

document.getElementById('selectionSortBtn').addEventListener('click', () => {
    disableButtons();
    selectionSort([...array]).then(enableButtons);
});

document.getElementById('resetBtn').addEventListener('click', () => {
    enableButtons();
    generateRandomArray();
});

function disableButtons() {
    document.querySelectorAll('.controls button').forEach(button => {
        button.disabled = true;
    });
}

function enableButtons() {
    document.querySelectorAll('.controls button').forEach(button => {
        button.disabled = false;
    });
}

// Inicializar la aplicación al cargar la página
generateRandomArray();
