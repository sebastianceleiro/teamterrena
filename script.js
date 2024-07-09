import { agregarTema, obtenerTareas, eliminarTarea, actualizarTarea } from './firebase.js';

const modal = document.getElementById("taskModal");
const btn = document.getElementById("addTaskBtn");
const span = document.getElementsByClassName("close")[0];
const form = document.getElementById("taskForm");
const btnfiltro = document.getElementById("filtroBtn");
const modalFiltro = document.getElementById("FiltroModal");
const filtroForm = document.getElementById("filtroForm");
const tableBody = document.querySelector("table tbody");
const btnLinks = document.getElementById("linksUtiles")
const linksUtiles = document.getElementById("LinksUtiles")


// Mostrar el modal de añadir tarea cuando se hace clic en el botón
btn.onclick = function() {
    modal.style.display = "block";
}

// Mostrar el modal de filtros cuando se hace clic en el botón de filtros
btnfiltro.onclick = function() {
    modalFiltro.style.display = "block";
}

// Mostrar el modal de filtros cuando se hace clic en el botón de filtros
btnLinks.onclick = function() {
    linksUtiles.style.display = "block";
}

// Cerrar el modal de añadir tarea cuando se hace clic en la "x"
span.onclick = function() {
    modal.style.display = "none";
}

// Cerrar el modal de filtros cuando se hace clic en la "x"
modalFiltro.querySelector(".close").onclick = function() {
    modalFiltro.style.display = "none";
}

// Cerrar el modal de filtros cuando se hace clic en la "x"
modalFiltro.querySelector(".close").onclick = function() {
    linksUtiles.style.display = "none";
}

// Cerrar el modal de añadir tarea o filtros cuando se hace clic fuera del modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modalFiltro) {
        modalFiltro.style.display = "none";
    }
    if (event.target == linksUtiles) {
        linksUtiles.style.display = "none";
    }
}


// Función para agregar una nueva tarea
form.onsubmit = function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const taskName = document.getElementById("taskName").value;
    const taskResponsible = document.getElementById("taskResponsible").value;
    const taskStatus = document.getElementById("taskStatus").value;
    const taskcomments = document.getElementById("taskcomments").value;

    const tareaCreada = {
        tema: taskName,
        asignadoa: taskResponsible,
        estado: taskStatus,
        comentarios: taskcomments
    };

    // Llamar a la función para agregar tarea en Firebase
    agregarTema(tareaCreada);
    agregarFilaATabla(tareaCreada); // Agregar la tarea creada a la tabla

    // Limpiar el formulario y cerrar el modal
    form.reset();
    modal.style.display = "none";
}

// Función para agregar una fila a la tabla
function agregarFilaATabla(tarea) {
    const table = document.querySelector("table tbody");
    const row = table.insertRow();
    
    // Agregar las celdas a la fila
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);

    cell1.textContent = tarea.tema;
    cell2.textContent = tarea.asignadoa;
    let estadoVisible = tarea.estado;
    if (tarea.estado === "Enproceso") {
        estadoVisible = "En proceso";
    }
    cell3.textContent = estadoVisible;
   
    cell3.classList.add('status', tarea.estado);

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Actualizar";
    updateBtn.className = "btn btn-update";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.className = "btn btn-update";

    cell5.appendChild(updateBtn);
    cell5.appendChild(deleteBtn);
    cell4.textContent = tarea.comentarios;

    updateBtn.onclick = async function() {
        // Actualizar la tarea
        modal.style.display = "block";
        document.getElementById("taskName").value = tarea.tema;
        document.getElementById("taskResponsible").value = tarea.asignadoa;
        document.getElementById("taskStatus").value = tarea.estado;
        document.getElementById("taskcomments").value = tarea.comentarios;
    
        form.onsubmit = async function(event) {
            event.preventDefault();
            tarea.tema = document.getElementById("taskName").value;
            tarea.asignadoa = document.getElementById("taskResponsible").value;
            tarea.estado = document.getElementById("taskStatus").value;
            tarea.comentarios = document.getElementById("taskcomments").value;
    
            // Actualizar la tarea en Firebase
            const actualizado = await actualizarTarea(tarea.id, tarea);
            if (actualizado) {
                cell1.textContent = tarea.tema;
                cell2.textContent = tarea.asignadoa;
                cell3.textContent = tarea.estado;
                cell3.className = `status ${tarea.estado}`;
                cell4.textContent = tarea.comentarios;
            }
    
            modal.style.display = "none";
            form.onsubmit = addTask; // Restablecer la función de envío del formulario
        }
    }


    deleteBtn.onclick = async function() {
        // Eliminar la tarea
        const confirmacion = confirm(`¿Estás seguro de eliminar la tarea "${tarea.tema}"?`);
        if (confirmacion) {
            const eliminado = await eliminarTarea(tarea.id);
            if (eliminado) {
                row.remove();
            }
        }
    }
}



// Función para cargar todas las tareas al cargar la página
async function cargarTareas() {
    const tareas = await obtenerTareas();

    // Definir el orden deseado de estados
    const ordenEstados = ['Pendiente', 'Enproceso', 'Pausado', 'Completo'];

    // Ordenar las tareas según el orden de estados definido
    tareas.sort((a, b) => {
        return ordenEstados.indexOf(a.estado) - ordenEstados.indexOf(b.estado);
    });

    // Limpiar la tabla antes de agregar las tareas ordenadas
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = '';

    // Agregar las tareas ordenadas a la tabla
    tareas.forEach(tarea => {
        agregarFilaATabla(tarea);
    });
}

// Aplicar filtro cuando se hace clic en el botón de aplicar filtro
document.getElementById("aplicarFiltroBtn").onclick = function() {
    const filtroEstado = document.getElementById("filtroEstado").value;
    const filtroResponsable = document.getElementById("filtroResponsable").value;

    // Eliminar todas las filas de la tabla
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.lastChild);
    }

    // Filtrar y mostrar las tareas según los criterios seleccionados
    obtenerTareas().then(tareas => {
        tareas.forEach(tarea => {
            if ((filtroEstado === '' || tarea.estado === filtroEstado) &&
                (filtroResponsable === '' || tarea.asignadoa === filtroResponsable)) {
                agregarFilaATabla(tarea);
            }
        });
    });

    // Cerrar el modal de filtros después de aplicar el filtro
    modalFiltro.style.display = "none";
}

// Llamar a la función para cargar las tareas al iniciar la página
cargarTareas();
