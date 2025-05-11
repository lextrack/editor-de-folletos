/**
 * Servicio para gestionar el almacenamiento local del folleto
 */
class StorageService {
  constructor(storageKey = 'brochure_editor_data') {
    this.storageKey = storageKey;
  }
  
  /**
   * Guarda los datos del proyecto en localStorage
   * @param {Object} data - Datos del proyecto
   * @returns {boolean} - True si se guardó correctamente
   */
  saveProject(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
      return false;
    }
  }
  
  /**
   * Carga los datos del proyecto desde localStorage
   * @returns {Object|null} - Datos del proyecto o null si no existe
   */
  loadProject() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al cargar el proyecto:', error);
      return null;
    }
  }
  
  /**
   * Elimina los datos del proyecto de localStorage
   * @returns {boolean} - True si se eliminó correctamente
   */
  clearProject() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      return false;
    }
  }
}

export default StorageService;