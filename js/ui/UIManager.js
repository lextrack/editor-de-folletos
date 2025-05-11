import ColorManager from './ColorManager.js';
import TextManager from './TextManager.js';
import ModalManager from './ModalManager.js';
import ShapeManager from './ShapeManager.js';
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
    this.shapeManager = new ShapeManager(model);

    this.shapeManager.onShapeSelected = (shapeId) => {
      if (shapeId) {
        this.showShapeProperties(true);
      }
    };
    
    this.bindEvents();
    this.bindShapeEvents();
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
   * Asocia eventos a los controles de formas
   */
  bindShapeEvents() {
    // Botones para añadir formas
    document.querySelectorAll('.shape-button').forEach(button => {
      button.addEventListener('click', () => {
        const shapeType = button.dataset.shapeType;
        if (shapeType) {
          this.shapeManager.addShape(shapeType);
          this.showShapeProperties(true);
        }
      });
    });
    
    // Control de color
    const shapeColor = document.getElementById('shapeColor');
    if (shapeColor) {
      shapeColor.addEventListener('input', () => {
        if (this.shapeManager.selectedShape) {
          this.shapeManager.updateShapeProperties(this.shapeManager.selectedShape, {
            color: shapeColor.value
          });
        }
      });
    }
    
    // Control de opacidad
    const shapeOpacity = document.getElementById('shapeOpacity');
    const shapeOpacityValue = document.getElementById('shapeOpacityValue');
    if (shapeOpacity && shapeOpacityValue) {
      shapeOpacity.addEventListener('input', () => {
        const opacity = parseFloat(shapeOpacity.value);
        shapeOpacityValue.textContent = `${Math.round(opacity * 100)}%`;
        
        if (this.shapeManager.selectedShape) {
          this.shapeManager.updateShapeProperties(this.shapeManager.selectedShape, {
            opacity: opacity
          });
        }
      });
    }
    
    // Control de ancho
    const shapeWidth = document.getElementById('shapeWidth');
    const shapeWidthValue = document.getElementById('shapeWidthValue');
    if (shapeWidth && shapeWidthValue) {
      shapeWidth.addEventListener('input', () => {
        const width = parseInt(shapeWidth.value);
        shapeWidthValue.textContent = `${width}px`;
        
        if (this.shapeManager.selectedShape) {
          this.shapeManager.updateShapeProperties(this.shapeManager.selectedShape, {
            width: width
          });
        }
      });
    }
    
    // Control de alto
    const shapeHeight = document.getElementById('shapeHeight');
    const shapeHeightValue = document.getElementById('shapeHeightValue');
    if (shapeHeight && shapeHeightValue) {
      shapeHeight.addEventListener('input', () => {
        const height = parseInt(shapeHeight.value);
        shapeHeightValue.textContent = `${height}px`;
        
        if (this.shapeManager.selectedShape) {
          this.shapeManager.updateShapeProperties(this.shapeManager.selectedShape, {
            height: height
          });
        }
      });
    }
    
    // Control de rotación
    const shapeRotation = document.getElementById('shapeRotation');
    const shapeRotationValue = document.getElementById('shapeRotationValue');
    if (shapeRotation && shapeRotationValue) {
      shapeRotation.addEventListener('input', () => {
        const rotation = parseInt(shapeRotation.value);
        shapeRotationValue.textContent = `${rotation}°`;
        
        if (this.shapeManager.selectedShape) {
          this.shapeManager.updateShapeProperties(this.shapeManager.selectedShape, {
            rotation: rotation
          });
        }
      });
    }
    
    // Botón eliminar
    const deleteShape = document.getElementById('deleteShape');
    if (deleteShape) {
      deleteShape.addEventListener('click', () => {
        if (this.shapeManager.selectedShape) {
          this.shapeManager.removeShape(this.shapeManager.currentPage, this.shapeManager.selectedShape);
          this.showShapeProperties(false);
        }
      });
    }
    
    // Botón duplicar
    const duplicateShape = document.getElementById('duplicateShape');
    if (duplicateShape) {
      duplicateShape.addEventListener('click', () => {
        if (this.shapeManager.selectedShape) {
          const shapes = this.shapeManager.model.getShapes(this.shapeManager.currentPage);
          const selectedShape = shapes.find(shape => shape.id === this.shapeManager.selectedShape);
          
          if (selectedShape) {
            const newShape = { ...selectedShape };
            delete newShape.id; // Eliminar ID para que se genere uno nuevo
            newShape.x += 20;
            newShape.y += 20;
            
            const newId = this.shapeManager.model.addShape(this.shapeManager.currentPage, newShape);
            this.shapeManager.selectedShape = newId;
            this.shapeManager.renderShapes();
            this.updateShapePropertiesUI(newShape);
          }
        }
      });
    }
    
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.shape') && !e.target.closest('.shape-button') &&
          !e.target.closest('#shapePropertiesPanel')) {
        if (this.shapeManager.selectedShape) {
          this.shapeManager.selectedShape = null;
          this.shapeManager.renderShapes();
          this.showShapeProperties(false);
        }
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
    this.shapeManager.updateUIFromModel();
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

  /**
   * Muestra u oculta el panel de propiedades de formas
   * @param {boolean} show - true para mostrar, false para ocultar
   */
  showShapeProperties(show) {
    const propertiesPanel = document.getElementById('shapeProperties');
    if (propertiesPanel) {
      if (show) {
        propertiesPanel.classList.add('visible');

        if (this.shapeManager.selectedShape) {
          const shapes = this.shapeManager.model.getShapes(this.shapeManager.currentPage);
          const selectedShape = shapes.find(shape => shape.id === this.shapeManager.selectedShape);
          
          if (selectedShape) {
            this.updateShapePropertiesUI(selectedShape);
          }
        }
      } else {
        propertiesPanel.classList.remove('visible');
      }
    }
  }

  /**
   * Actualiza la interfaz de propiedades según la forma seleccionada
   * @param {Object} shape - Datos de la forma seleccionada
   */
  updateShapePropertiesUI(shape) {
    const colorInput = document.getElementById('shapeColor');
    const opacityInput = document.getElementById('shapeOpacity');
    const opacityValue = document.getElementById('shapeOpacityValue');
    const widthInput = document.getElementById('shapeWidth');
    const widthValue = document.getElementById('shapeWidthValue');
    const heightInput = document.getElementById('shapeHeight');
    const heightValue = document.getElementById('shapeHeightValue');
    const rotationInput = document.getElementById('shapeRotation');
    const rotationValue = document.getElementById('shapeRotationValue');
    
    if (colorInput) colorInput.value = shape.color;
    if (opacityInput) {
      opacityInput.value = shape.opacity;
      opacityValue.textContent = `${Math.round(shape.opacity * 100)}%`;
    }
    if (widthInput) {
      widthInput.value = shape.width;
      widthValue.textContent = `${shape.width}px`;
    }
    if (heightInput) {
      heightInput.value = shape.height;
      heightValue.textContent = `${shape.height}px`;
    }
    if (rotationInput) {
      rotationInput.value = shape.rotation;
      rotationValue.textContent = `${shape.rotation}°`;
    }
  }
}

export default UIManager;