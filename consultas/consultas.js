import pool from "../config/db.js";

// importo archivo para manejo de errores
import errores from "../Errores.js";


const argumento = process.argv.slice(2);
const accion = argumento[0];
let rut = argumento[1];  
const nombre = argumento[2];
const curso = argumento[3];
const nivel = argumento[4];

const tabla = "alumnos";
//const tabla = "al";//tabla vacía

//agregar estudiantes

// const nuevoEstudiante = async (rut, nombre, curso, nivel) => {
//     try {
//         const consulta = {
//             text: "insert into alumnos values ($1, $2, $3, $4)",
//             values: [rut, nombre, curso, nivel],
//         };
//         const res = await pool.query(consulta);
//         console.log(`El student fue agregado correctamente`);
//         } catch (error) {
//             console.log(error.code, error.message);
//         }
//     }

//agregar alumno

const nvoAlumno = async ( rut, nombre, curso, nivel ) => {
  if (!rut || !nombre || !curso || !nivel) {
    //valida que se estén pasando los parametros para la consulta
    console.log(
      "Debe proporcionar todos los valores correctamente para agregar un Alumno, Rut, Nombre, Curso y Nivel."
    );
    return;
  }
  try {
    const result = await pool.query({
      text: `INSERT INTO ${tabla} VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [rut, nombre, curso, nivel],
    });
    return result.rows[0]; // Devuelve los datos del alumno agregado
    console.log(`Alumno ${nombre} ${rut} agregado con éxito`);
    console.log("Alumno Agregado: ", result.rows[0]);
    console.log(result.rows[0]);
    } catch (error) {
    console.log("Error al agregar al alumno");
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
  }
};

export {nvoAlumno};


//consultar por rut
const consultaAlumno = async (rut) => {
  try {
    const consulta = {
      text: "select * from alumnos where rut = $1",
      values: [rut],
    };
    const res = await pool.query(consulta);
    console.log(`El estudiante con el rut ${rut} es: ${JSON.stringify(res.rows)}`);
  } catch (error) {
    console.log(error.code, error.message);
  }
};

export {consultaAlumno}


//mostrar todos los estudiantes

const estudiantes = async () => {
  try {
    const res = await pool.query({
      rowMode: "array",
      text: `SELECT * FROM ${tabla}`,
    });
    // bloque if para validar que la tabla está vacía
    if (res.rowCount == 0) {
      console.log(
        `No existen Alumnos registrados; favor agregar y repetir la consulta.`
      );
      return `No existen Alumnos registrados; favor agregar y repetir la consulta.`;
    } else {
      console.log(`Alumnos registrados en la academia `, res.rows);
      // Devuelve los resultados de la consulta como json
      return res.rows;
    }
  } catch (error) {
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
  }
};

export {estudiantes};

// Función para actualizar un alumno por su Rut
const actualizarAlumno = async (rut, nombre, curso, nivel) => {
  if (!rut || !nombre || !curso || !nivel) {
    //valida que se estén pasando los parametros para la consulta
    console.log(
      "Debe proporcionar todos los valores correctamente para actualizar la informacion de un Alumno, Rut, Nombre, Curso y Nivel."
    );
    return;}
  try {
    const res = await pool.query({
      text: `UPDATE ${tabla} SET nombre=$2, curso=$3, nivel=$4 WHERE rut=$1 RETURNING *`,
      values: [rut, nombre, curso, nivel],
    });

    if (res.rowCount > 0) {
      console.log(`Alumno con rut ${rut} actualizado con éxito`);
      console.log("Alumno Actualizado: ", res.rows[0]);
    } else {
      console.log(
        `No se encontró ningún alumno con el rut ${rut}, revise los datos y reintente`
      );
    }
  } catch (error) {
    console.log("Error al actualizar el alumno");
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " |Error Cod. ",
      EE.code,
      "|",
      EE.message
    );
  }
};

export {actualizarAlumno};


// Función para eliminar un alumno por su rut
const eliminarAlumno = async (rut) => {
  try {
    if (!rut) {
    console.log("Debe proporcionar un valor para buscar el 'rut' del alumno que desea eliminar.");
    return;
  }
  // Verifico si el Rut es un valor numérico válido antes de realizar la consulta,
  //para valor string opera el manejo de errores capturando el codigo de error.
  if (isNaN(rut)) {
    console.log("El Rut debe ser un valor numérico válido.");
    return;
  }
    const existeRut = await pool.query({
      // Consulto si el Rut existe en la tabla
      text: `SELECT * FROM ${tabla} WHERE rut = $1`,
      values: [rut],
    });
    
    if (
      // Verifico si el Rut existe en la tabla
      existeRut.rowCount === 0
    ) {
      console.log(
        `El Rut ${rut} no existe en la base de datos. Revise el Rut e intentelo nuevamente`
      );
    } else {
      // Si el Rut existe, realizo la operación
      const res = await pool.query({
        text: `DELETE FROM ${tabla} WHERE rut=$1 RETURNING *`,
        values: [rut],
      });
      console.log(`${JSON.stringify(res.rows)} Alumno con rut ${rut} eliminado con éxito`);
      console.log("Alumno Eliminado: ", res.rows[0]);
    }
  } catch (error) {
    // Manejo de los errores
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " | Error Cod. ",
      EE.code,
      " | ",
      EE.message
    );
  }
};

export {eliminarAlumno};

// Función para consultar un alumno por su rut
const consultAlumno = async (rut) => {
  try {
    if (!rut) {
    console.log("Debe proporcionar un valor para buscar el 'rut' del alumno que desea eliminar.");
    return;
  }
  // Verifico si el Rut es un valor numérico válido antes de realizar la consulta,
  //para valor string opera el manejo de errores capturando el codigo de error.
  if (isNaN(rut)) {
    console.log("El Rut debe ser un valor numérico válido.");
    return;
  }
    const existeRut = await pool.query({
      // Consulto si el Rut existe en la tabla
      text: `SELECT * FROM ${tabla} WHERE rut = $1`,
      values: [rut],
    });
    
    if (
      // Verifico si el Rut existe en la tabla
      existeRut.rowCount === 0
    ) {
      console.log(
        `El Rut ${rut} no existe en la base de datos. Revise el Rut e intentelo nuevamente`
      );
    } else {
      // Si el Rut existe, realizo la operación
      const consulta = {
        text: "select * from alumnos where rut = $1",
        values: [rut],
      };
      console.log(`${JSON.stringify(consulta.rows)} Alumno con rut ${rut} consultado con éxito`);
      console.log("Alumno Consultado ", consulta.rows[0]);
    }
  } catch (error) {
    // Manejo de los errores
    const EE = errores(error.code, error.status, error.message);
    console.log(
      "Status ",
      EE.status,
      " | Error Cod. ",
      EE.code,
      " | ",
      EE.message
    );
  }
};

export {consultAlumno};

// //eliminar registro de estudiante {eliminar}
// const eliminarEstudiante = async (rut) => {
//   try {
//     const consulta = {
//       text: "delete from alumnos where rut = $1",
//       values: [rut],
//     };
//     const res = await pool.query(consulta);
//     console.log(`${JSON.stringify(res.rows)} Estudiante con rut ${rut} eliminado correctamente!`);
//   } catch (error) {
//     console.log(error.code, error.message);
// }
// };

console.log('Archivo de consultas cargado con éxito 👌');



// //nombrar acciones/fx's
// if (accion === "agregar") {
//   nuevoEstudiante(nombre, rut, curso, nivel);
// } else if (accion === "verRut") {
//   rut = argumento[1];
//   rutEstudientes(rut);
// } else if (accion === "verTodos") {
//   verEstudiantes();
// } else if (accion === "actualizar") {
//   actualizarEstudiante(nombre, rut, curso, nivel);
// } else if (accion === "eliminar") {
//   rut = argumento[1];
//   eliminarEstudiante(rut);
// } else {
//   console.log("Accion no valida!🔥");
// }