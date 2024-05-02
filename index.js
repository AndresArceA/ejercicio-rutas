//1-. en la raiz deben construir un archivo index.js que tenga las instrucciones unica y exclusivamente
//de levantar el servidor en el puerto 3000 y las rutas de /agregar, /todos, /consulta, /eliminar, /modificar.
//las rutas de consultar y eliminar deben recibir un parametro que debe ser la clave primaria de la tabla
//la ruta agregar debe recibir un body con la informacion a ser agregada.
//y la ruta de modificar debe recibir por query string toda la informacion requerida.
//nota: en el index no debe existir programacion asociada a la bbdd, toda la programacion de la bbdd
//debe estar en el archivo consultas.js y este en cada una de sus funciones debe retornarle la informacion
//adecuada a cada ruta y luego cada ruta debe devolver una respuesta adecuada desde el servidor.


import express, { json } from 'express';


const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor 💻 ThinkPad P51 corriendo en el puerto ${PORT} 🦾`);
});

app.use(json()); // Middleware para analizar el cuerpo de la solicitud como JSON

// Ruta para agregar usuario
import { nvoAlumno } from './consultas/consultas.js';

app.post("/agregar", async (req, res) => {
  try {
    const { rut, nombre, curso, nivel } = req.body; // Destructuración de los datos del cuerpo de la solicitud
    const alumnoAgregado = await nvoAlumno(rut, nombre, curso, nivel); // Llamar a la función nuevoEstudiante con los datos del alumno
    res.json({
      msg: "Alumno agregado exitosamente",
      alumno: alumnoAgregado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al agregar usuario",
    });
  }
});



// Ruta para listar todos los usuarios

import { estudiantes } from './consultas/consultas.js';

app.get('/todos', async (req, res) => {
    try {
        // listar todos los usuarios
        const Alumnos = await estudiantes();
        
        // devolver un objeto propiedad usuarios asignando valor rows
        res.json(Alumnos);

    } catch (error) {
        // manejo general de errores
        let status;
        console.log("Error producido: ",error);
        console.log("Codigo de error PG producido: ",error.code);
    }
}
)


// ruta para actualizar alumno por rut

import { actualizarAlumno } from './consultas/consultas.js';
app.post('/modificar', async (req, res) => {
    try {
        const { rut, nombre, curso, nivel } = req.query; // Destructuración de los datos del cuerpo de la solicitud
        const result = await actualizarAlumno(rut, nombre, curso, nivel); // Llamar a la función nuevoEstudiante con los datos del alumno
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
          msg: 'Error al modificar el alumno'
        });
    }
});

// ruta para eliminar alumno por rut

import { eliminarAlumno } from './consultas/consultas.js';
app.post('/eliminar', async (req, res) => {
    try {
        const { rut } = req.query; 
        const result = await eliminarAlumno(rut); // Llamar a la función eliminarAlumno con los datos del alumno
        res.json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({
          msg: 'Error al eliminar el alumno'
        });
    }
});

// ruta para consultar alumno por rut

import { consultAlumno } from './consultas/consultas.js';
app.post('/consultar', async (req, res) => {
    try {
        const  rut  = req.query; 
        const result = await consultAlumno(rut); // Llamar a la función eliminarAlumno con los datos del alumno
        res.json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({
          msg: 'Error al realizar la consulta'
        });
    }
});