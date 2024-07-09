// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtKgCPFCroALcXU6leHFL-oIqCAoOh5Hg",
  authDomain: "temasterrena.firebaseapp.com",
  projectId: "temasterrena",
  storageBucket: "temasterrena.appspot.com",
  messagingSenderId: "119189255500",
  appId: "1:119189255500:web:44e223d0f544228c840be9"
};

// Inicializar Firebase con la configuración
firebase.initializeApp(firebaseConfig);

// Obtener la instancia de Firestore
const db = firebase.firestore();

// Definir la función para agregar un tema
async function agregarTema(tareaCreada) {
    try {
        // Agregar un nuevo documento en la colección "temas"
        await db.collection("temas").add(tareaCreada);
        console.log("Documento agregado correctamente en Firestore");
    } catch (error) {
        console.error("Error al agregar documento en Firestore: ", error);
    }
}

// Función para obtener todas las tareas
async function obtenerTareas() {
    try {
        const snapshot = await db.collection("temas").get();
        const tareas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return tareas;
    } catch (error) {
        console.error("Error al obtener tareas: ", error);
        return [];
    }
}
// Función para eliminar una tarea de la colección "temas"
async function eliminarTarea(id) {
    try {
        await db.collection("temas").doc(id).delete();
        console.log("Documento eliminado correctamente");
        return true;
    } catch (error) {
        console.error("Error al eliminar documento: ", error);
        return false;
    }
}

async function actualizarTarea(id, tareaActualizada) {
    try {
        await db.collection("temas").doc(id).update(tareaActualizada);
        console.log("Documento actualizado correctamente en Firestore");
        return true;
    } catch (error) {
        console.error("Error al actualizar documento en Firestore: ", error);
        return false;
    }
}

// Exportar las funciones y la instancia de db
export { agregarTema, obtenerTareas, eliminarTarea, actualizarTarea, db };