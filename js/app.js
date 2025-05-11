import BrochureModel from './models/BrochureModel.js';
import UIManager from './ui/UIManager.js';

/**
 * Punto de entrada principal de la aplicación
 * Inicializa el modelo y la interfaz de usuario
 */
class BrochureEditorApp {
  constructor() {
    this.init();
  }

  /**
   * Inicializa la aplicación
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      const model = new BrochureModel();
      const uiManager = new UIManager(model);
      uiManager.loadSavedProject();
    });
  }
}

// Iniciar la aplicación
new BrochureEditorApp();

export default BrochureEditorApp;