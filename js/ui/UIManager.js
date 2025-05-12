import ColorManager from './ColorManager.js';
import TextManager from './TextManager.js';
import ModalManager from './ModalManager.js';
import DecorationManager from './DecorationManager.js';
import DOMUtils from '../utils/DOMUtils.js';
import HtmlService from '../services/HtmlService.js';
import StorageService from '../services/StorageService.js';

/**
 * Gestor principal de la interfaz de usuario
 * Coordina los diferentes gestores especializados
 */
class UIManager {
  /**
   * @param {BrochureModel} model - Modelo de datos del folleto
   */
  constructor(model) {
    this.model = model;
    this.storageService = new StorageService();
    this.htmlService = new HtmlService();
    
    this.modalManager = new ModalManager();
    this.colorManager = new ColorManager(model);
    this.textManager = new TextManager(model);
    this.decorationManager = new DecorationManager(model);
    
    this.bindEvents();
    this.initAutoSave();
  }

  /**
   * Asocia eventos a los botones principales
   */
  bindEvents() {
    const buttons = {
      generateCode: document.getElementById('generateCode'),
      printPreview: document.getElementById('printPreview'),
      resetEditor: document.getElementById('resetEditor'),
      copyCode: document.getElementById('copyCode'),
      speedDialMain: document.getElementById('speedDialMain'),
      showInfo: document.getElementById('showInfoBtn')
    };
    
    if (buttons.generateCode) {
      buttons.generateCode.addEventListener('click', () => this.handleGenerateCode());
    }
    
    if (buttons.printPreview) {
      buttons.printPreview.addEventListener('click', () => this.handlePrintPreview());
    }
    
    if (buttons.resetEditor) {
      buttons.resetEditor.addEventListener('click', () => this.handleReset());
    }
    
    if (buttons.copyCode) {
      buttons.copyCode.addEventListener('click', () => this.handleCopyCode());
    }
    
    if (buttons.speedDialMain) {
      buttons.speedDialMain.addEventListener('click', () => this.toggleSpeedDial());
    }
    
    if (buttons.showInfo) {
      buttons.showInfo.addEventListener('click', () => this.handleShowInfo());
    }
    
    const speedDialMenu = document.getElementById('speedDialMenu');
    document.addEventListener('click', (event) => {
      if (speedDialMenu && 
          speedDialMenu.classList.contains('show') && 
          !event.target.closest('.speed-dial')) {
        this.closeSpeedDial();
      }
    });
  }

  /**
   * Configura el guardado automático
   */
  initAutoSave() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      ['change', 'input'].forEach(eventType => {
        input.addEventListener(eventType, () => {
          clearTimeout(this.autoSaveTimeout);
          this.autoSaveTimeout = setTimeout(() => this.saveChanges(), 1000);
        });
      });
    });
  }

  /**
   * Guarda los cambios actuales en localStorage
   */
  saveChanges() {
    const success = this.storageService.saveProject(this.model.getState());
    if (!success) {
      console.error('Error al guardar cambios');
    }
  }

  /**
   * Carga el proyecto guardado y actualiza la interfaz
   */
  loadSavedProject() {
    const savedData = this.storageService.loadProject();
    
    if (savedData) {
      this.model.loadSavedData(savedData);
      this.updateAllUI();
      DOMUtils.showToast('Proyecto cargado correctamente', 'success');
    }
  }

  /**
   * Actualiza toda la interfaz según el modelo
   */
  updateAllUI() {
    this.colorManager.updateUIFromModel();
    this.textManager.updateUIFromModel();
    this.decorationManager.updateUIFromModel();
  }

  /**
   * Maneja el clic en el botón "Generar HTML"
   */
  handleGenerateCode() {
    const htmlCode = this.htmlService.generateHtml(this.model.getState());
    this.modalManager.showCodeModal(htmlCode);
  }

  /**
   * Maneja el clic en el botón "Vista de Impresión"
   */
  handlePrintPreview() {
    const htmlCode = this.htmlService.generateHtml(this.model.getState());
    this.htmlService.openPrintPreview(htmlCode);
  }

  /**
   * Maneja el clic en el botón "Reiniciar"
   */
  handleReset() {
    DOMUtils.showConfirmDialog(
      '¿Está seguro de que desea reiniciar el editor? Todos los cambios se perderán.',
      () => {
        this.storageService.clearProject();
        location.reload();
      }
    );
  }

  /**
   * Maneja el clic en el botón "Copiar" del modal de código
   */
  handleCopyCode() {
    const codeElement = document.getElementById('generatedCode');
    if (codeElement) {
      DOMUtils.copyToClipboard(codeElement.textContent)
        .then(success => {
          if (success) {
            DOMUtils.showToast('Código copiado al portapapeles', 'success');
          } else {
            DOMUtils.showToast('Error al copiar el código', 'danger');
          }
        });
    }
  }

  /**
   * Maneja el clic en el botón "Información"
   */
  handleShowInfo() {
    this.closeSpeedDial();
    this.modalManager.showInfoModal();
  }

  /**
   * Alterna la visibilidad del menú speed dial
   */
  toggleSpeedDial() {
    const speedDialMain = document.getElementById('speedDialMain');
    const speedDialMenu = document.getElementById('speedDialMenu');
    
    if (speedDialMain && speedDialMenu) {
      speedDialMain.classList.toggle('active');
      speedDialMenu.classList.toggle('show');
    }
  }

  /**
   * Cierra el menú speed dial
   */
  closeSpeedDial() {
    const speedDialMain = document.getElementById('speedDialMain');
    const speedDialMenu = document.getElementById('speedDialMenu');
    
    if (speedDialMain && speedDialMenu) {
      speedDialMain.classList.remove('active');
      speedDialMenu.classList.remove('show');
    }
  }
}

export default UIManager;