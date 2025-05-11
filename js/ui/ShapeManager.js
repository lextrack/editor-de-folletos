/**
 * Gestiona las formas y sus controles
 */
class ShapeManager {
  /**
   * @param {BrochureModel} model - Modelo de datos del folleto
   */
  constructor(model) {
    this.model = model;
    this.currentPage = 'cover'; // Página actualmente seleccionada
    this.selectedShape = null; // Forma seleccionada actualmente
    this.isDragging = false; // Si se está arrastrando una forma
    this.dragOffset = { x: 0, y: 0 }; // Offset para el arrastre
    
    this.onShapeSelected = null;
    this.initElements();
    this.bindEvents();
    this.createShapeTemplates();
  }

  /**
   * Inicializa referencias a elementos DOM
   */
  initElements() {
    this.pageContainers = {
      cover: document.querySelector('.cover'),
      text1: document.querySelector('.page-1-left'),
      text2: document.querySelector('.page-2-left'),
      text3: document.querySelector('.page-2-right')
    };
    
    Object.entries(this.pageContainers).forEach(([page, container]) => {
      const shapesContainer = document.createElement('div');
      shapesContainer.className = 'shapes-container';
      shapesContainer.style.position = 'absolute';
      shapesContainer.style.top = '0';
      shapesContainer.style.left = '0';
      shapesContainer.style.width = '100%';
      shapesContainer.style.height = '100%';
      shapesContainer.style.pointerEvents = 'none';
      shapesContainer.style.zIndex = '1';
      
      const borderFrame = container.querySelector('.border-frame');
      container.insertBefore(shapesContainer, borderFrame);
      
      this.pageContainers[page] = shapesContainer;
    });
  }

  /**
   * Asocia eventos a los controles
   */
  bindEvents() {
    document.querySelectorAll('#editorTabs .nav-link').forEach(tab => {
      tab.addEventListener('shown.bs.tab', (event) => {
        const tabId = event.target.id;
        if (tabId === 'portada-tab') {
          this.setCurrentPage('cover');
        } else if (tabId === 'texto-contraportada-tab') {
          this.setCurrentPage('text1');
        } else if (tabId === 'texto2-tab') {
          this.setCurrentPage('text2');
        } else if (tabId === 'texto3-tab') {
          this.setCurrentPage('text3');
        }
      });
    });

    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' && this.selectedShape) {
        this.removeShape(this.currentPage, this.selectedShape);
        this.selectedShape = null;
      }
    });
  }

  /**
   * Crea plantillas para los diferentes tipos de formas
   */
  createShapeTemplates() {
    this.shapeTemplates = {
      rectangle: {
        type: 'rectangle',
        width: 100,
        height: 60,
        color: '#8d6e63',
        opacity: 0.5
      },
      circle: {
        type: 'circle',
        width: 80,
        height: 80,
        color: '#5d4037',
        opacity: 0.5
      },
      triangle: {
        type: 'triangle',
        width: 80,
        height: 70,
        color: '#a1887f',
        opacity: 0.5
      },
      line: {
        type: 'line',
        width: 120,
        height: 3,
        color: '#8d6e63',
        opacity: 0.7
      }
    };
  }

  /**
   * Establece la página actual y actualiza la interfaz
   * @param {string} page - Página a establecer como actual
   */
  setCurrentPage(page) {
    this.currentPage = page;
    this.selectedShape = null;
    this.renderShapes();
  }

  /**
   * Maneja el evento mousedown para iniciar el arrastre de formas
   * @param {MouseEvent} e - Evento de mousedown
   */
  handleMouseDown(e) {
    if (!e.target.classList.contains('shape')) return;
    
    const shapeId = e.target.dataset.id;
    if (!shapeId) return;
    
    this.isDragging = true;
    this.selectedShape = shapeId;
    
    const rect = e.target.getBoundingClientRect();
    this.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    this.updateShapeSelection();

    if (typeof this.onShapeSelected === 'function') {
      this.onShapeSelected(this.selectedShape);
    }
    
    e.preventDefault();
  }

  /**
   * Maneja el evento mousemove para el arrastre de formas
   * @param {MouseEvent} e - Evento de mousemove
   */
  handleMouseMove(e) {
    if (!this.isDragging || !this.selectedShape) return;
    
    const container = this.pageContainers[this.currentPage];
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    const x = e.clientX - containerRect.left - this.dragOffset.x;
    const y = e.clientY - containerRect.top - this.dragOffset.y;
    
    this.model.updateShape(this.currentPage, this.selectedShape, { x, y });
    
    this.renderShapes();
    
    e.preventDefault();
  }

  /**
   * Maneja el evento mouseup para finalizar el arrastre
   */
  handleMouseUp() {
    this.isDragging = false;
  }

  /**
   * Actualiza la visualización para mostrar la forma seleccionada
   */
  updateShapeSelection() {
    document.querySelectorAll('.shape').forEach(shape => {
      shape.classList.remove('selected');
    });
    
    if (this.selectedShape) {
      const shapeElement = document.querySelector(`.shape[data-id="${this.selectedShape}"]`);
      if (shapeElement) {
        shapeElement.classList.add('selected');
      }
    }
  }

  /**
   * Añade una nueva forma a la página actual
   * @param {string} type - Tipo de forma a añadir (rectangle, circle, etc.)
   */
  addShape(type) {
    const template = this.shapeTemplates[type] || this.shapeTemplates.rectangle;
    
    const container = this.pageContainers[this.currentPage];
    const x = (container.offsetWidth - template.width) / 2;
    const y = (container.offsetHeight - template.height) / 2;
    
    const shapeId = this.model.addShape(this.currentPage, {
      ...template,
      x,
      y
    });

    this.selectedShape = shapeId;
    this.renderShapes();
    
    return shapeId;
  }

  /**
   * Elimina una forma
   * @param {string} page - Página donde está la forma
   * @param {string} shapeId - ID de la forma a eliminar
   */
  removeShape(page, shapeId) {
    const success = this.model.removeShape(page, shapeId);
    
    if (success) {
      if (this.selectedShape === shapeId) {
        this.selectedShape = null;
      }

      this.renderShapes();
    }
    
    return success;
  }

  /**
   * Actualiza las propiedades de una forma
   * @param {string} shapeId - ID de la forma a actualizar
   * @param {Object} properties - Propiedades a actualizar
   */
  updateShapeProperties(shapeId, properties) {
    const success = this.model.updateShape(this.currentPage, shapeId, properties);
    
    if (success) {
      this.renderShapes();
    }
    
    return success;
  }

  /**
   * Renderiza todas las formas de la página actual
   */
  renderShapes() {
    const container = this.pageContainers[this.currentPage];
    if (!container) return;
    
    container.innerHTML = '';
    
    const shapes = this.model.getShapes(this.currentPage);
    
    shapes.forEach(shape => {
      const shapeElement = this.createShapeElement(shape);
      container.appendChild(shapeElement);
    });
    
    this.updateShapeSelection();
  }

  /**
   * Crea un elemento DOM para una forma
   * @param {Object} shape - Datos de la forma
   * @returns {HTMLElement} - Elemento DOM para la forma
   */
  createShapeElement(shape) {
    const { id, type, x, y, width, height, color, opacity, rotation } = shape;
    
    const element = document.createElement('div');
    element.className = 'shape';
    element.dataset.id = id;
    element.dataset.type = type;
    
    element.style.position = 'absolute';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.opacity = opacity;
    element.style.transform = `rotate(${rotation}deg)`;
    element.style.pointerEvents = 'auto';
    element.style.cursor = 'move';
    
    switch (type) {
      case 'rectangle':
        element.style.backgroundColor = color;
        break;
      
      case 'circle':
        element.style.backgroundColor = color;
        element.style.borderRadius = '50%';
        break;
      
      case 'triangle':
        element.style.width = '0';
        element.style.height = '0';
        element.style.backgroundColor = 'transparent';
        element.style.borderLeft = `${width / 2}px solid transparent`;
        element.style.borderRight = `${width / 2}px solid transparent`;
        element.style.borderBottom = `${height}px solid ${color}`;
        break;
      
      case 'line':
        element.style.backgroundColor = color;
        break;
    }
    
    if (this.selectedShape === id) {
      element.classList.add('selected');
      element.style.outline = '2px dashed #2196F3';
      element.style.outlineOffset = '2px';
    }
    
    return element;
  }

  /**
   * Actualiza todas los controles e interfaz con los datos del modelo
   */
  updateUIFromModel() {
    this.renderShapes();
  }
}

export default ShapeManager;