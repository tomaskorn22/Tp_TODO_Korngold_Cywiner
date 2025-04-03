document.addEventListener("DOMContentLoaded", () => {
   
    const inputTarea = document.getElementById('ingresotarea');
    const btnAgregar = document.getElementById('agregartarea');
    const listaTareas = document.getElementById('listatareas');
    const btnBorrarCompletadas = document.getElementById('borrarcompletadas');
    const btnMostrarTodas = document.getElementById('mostrartareas');
    const btnMostrarPendientes = document.getElementById('mostrarpendientes');
    const btnMostrarCompletadas = document.getElementById('mostrarcompletadas');
    const tareaMasRapida = document.getElementById('tareamasrapida');


   
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];


   
    const guardarTareas = () => localStorage.setItem('tareas', JSON.stringify(tareas));


   
    const mostrarTareas = (tareasFiltradas = tareas) => {
        listaTareas.innerHTML = '';


        tareasFiltradas.forEach(({ id, nombre, completada, creadaEn, completadaEn }) => {
            const item = document.createElement('li');


           
            item.innerHTML = `
                <span class="${completada ? 'completada' : ''}">
                    ${nombre} <small>(Creada: ${new Date(creadaEn).toLocaleString()})</small>
                    ${completadaEn ? `<small> - Completada: ${new Date(completadaEn).toLocaleString()}</small>` : ''}
                </span>
            `;


           
            const btnMarcar = document.createElement('button');
            btnMarcar.textContent = completada ? 'Desmarcar' : 'Marcar';
            btnMarcar.addEventListener('click', () => cambiarEstado(id));


           
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.addEventListener('click', () => eliminarTarea(id));


            item.append(btnMarcar, btnEliminar);
            listaTareas.appendChild(item);
        });


        mostrarTareaMasRapida();
    };


   
    btnAgregar.addEventListener('click', () => {
        const nombreTarea = inputTarea.value.trim();
        if (nombreTarea) {
            tareas.push({
                id: Date.now(),
                nombre: nombreTarea,
                completada: false,
                creadaEn: Date.now(),
                completadaEn: null
            });
            inputTarea.value = '';
            guardarTareas();
            mostrarTareas();
        }
    });


    const cambiarEstado = (idTarea) => {
        tareas = tareas.map(tarea =>
            tarea.id === idTarea
                ? { ...tarea, completada: !tarea.completada, completadaEn: tarea.completada ? null : Date.now() }
                : tarea
        );
        guardarTareas();
        mostrarTareas();
    };


   
    const eliminarTarea = (idTarea) => {
        tareas = tareas.filter(tarea => tarea.id !== idTarea);
        guardarTareas();
        mostrarTareas();
    };


    btnBorrarCompletadas.addEventListener('click', () => {
        tareas = tareas.filter(tarea => !tarea.completada);
        guardarTareas();
        mostrarTareas();
    });


    btnMostrarTodas.addEventListener('click', () => mostrarTareas());
    btnMostrarPendientes.addEventListener('click', () => mostrarTareas(tareas.filter(tarea => !tarea.completada)));
    btnMostrarCompletadas.addEventListener('click', () => mostrarTareas(tareas.filter(tarea => tarea.completada)));


    const mostrarTareaMasRapida = () => {
        const tareasCompletadas = tareas.filter(t => t.completada && t.completadaEn);
        if (tareasCompletadas.length === 0) {
            tareaMasRapida.textContent = "No hay tareas completadas aún.";
            return;
        }


        const tareaRapida = tareasCompletadas.reduce((masRapida, tarea) => {
            const tiempoTardado = tarea.completadaEn - tarea.creadaEn;
            return tiempoTardado < masRapida.tiempoTardado ? { ...tarea, tiempoTardado } : masRapida;
        }, { tiempoTardado: Infinity });


        const tiempoEnSegundos = (tareaRapida.tiempoTardado / 1000).toFixed(2);
        tareaMasRapida.textContent = `Tarea más rápida: "${tareaRapida.nombre}" en ${tiempoEnSegundos} segundos.`;
    };


    mostrarTareas();
});


