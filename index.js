const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Array para almacenar las tareas
let tareas = [];
let idCounter = 1;

// Crear una nueva tarea
app.post('/tareas', (req, res) => {
    const { titulo, descripcion } = req.body;
    if (!titulo) {
        return res.status(400).json({ error: 'El título es requerido' });
    }

    const nuevaTarea = {
        id: idCounter++,
        titulo,
        descripcion: descripcion || '',
        completada: false,
        fechaCreacion: new Date()
    };

    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// Leer todas las tareas
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// Leer una tarea específica por su ID
app.get('/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === parseInt(req.params.id));
    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(tarea);
});

// Actualizar una tarea existente
app.put('/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === parseInt(req.params.id));
    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const { titulo, descripcion, completada } = req.body;

    if (titulo !== undefined) tarea.titulo = titulo;
    if (descripcion !== undefined) tarea.descripcion = descripcion;
    if (completada !== undefined) tarea.completada = completada;

    res.json(tarea);
});

// Eliminar una tarea por su ID
app.delete('/tareas/:id', (req, res) => {
    const index = tareas.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const tareaEliminada = tareas.splice(index, 1);
    res.json(tareaEliminada[0]);
});

// Calcular estadísticas sobre las tareas
app.get('/tareas/estadisticas', (req, res) => {
    const totalTareas = tareas.length;
    const tareasCompletadas = tareas.filter(t => t.completada).length;
    const tareasPendientes = totalTareas - tareasCompletadas;

    let tareaMasReciente = null;
    let tareaMasAntigua = null;

    if (totalTareas > 0) {
        tareaMasReciente = tareas.reduce((a, b) => (a.fechaCreacion > b.fechaCreacion ? a : b));
        tareaMasAntigua = tareas.reduce((a, b) => (a.fechaCreacion < b.fechaCreacion ? a : b));
    }

    res.json({
        totalTareas,
        tareasCompletadas,
        tareasPendientes,
        tareaMasReciente,
        tareaMasAntigua
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
