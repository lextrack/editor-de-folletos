/**
 * Modelo de datos para el folleto
 * Contiene la estructura de datos y métodos para manipular el estado
 */
class BrochureModel {
  constructor() {
    // Folleto de muestra
    this.state = {
      colors: {
        primary: '#5d4037',
        secondary: '#8d6e63',
        background: '#f9f5f0',
        cover: '#ccbfad',
        allPages: '#ffffff',
        text1: '#ffffff',
        text2: '#ffffff',
        text3: '#ffffff'
      },
      cover: {
        title: 'Obras notables',
        author: 'Gabriela Mistral',
        note: 'Premio Nobel de Literatura 1945',
        decoration: '❊ ❊ ❊'
      },
      sections: {
        text1: {
          title: 'Balada',
          content: 'Prueba de texto\nnúmero 1',
          fontSize: 14,
          titleSize: 30
        },
        text2: {
          title: 'Piececitos',
          content: 'Prueba de texto\nnúmero 2',
          fontSize: 14,
          titleSize: 30
        },
        text3: {
          title: 'El Placer de Servir',
          content: 'Prueba de texto\nnúmero 3',
          fontSize: 14,
          titleSize: 30
        }
      },
      shapes: {
        cover: [],
        text1: [],
        text2: [],
        text3: []
      }
    };
  }

  /**
   * Actualiza un color en el modelo
   * @param {string} key - Clave del color a actualizar
   * @param {string} value - Valor hexadecimal del color
   */
  updateColor(key, value) {
    this.state.colors[key] = value;
  }

  /**
   * Aplica un color a todas las páginas
   * @param {string} color - Valor hexadecimal del color
   */
  applyColorToAllPages(color) {
    this.state.colors.allPages = color;
    this.state.colors.text1 = color;
    this.state.colors.text2 = color;
    this.state.colors.text3 = color;
  }

  /**
   * Actualiza una propiedad de la portada
   * @param {string} key - Clave de la propiedad a actualizar
   * @param {string} value - Nuevo valor
   */
  updateCoverProperty(key, value) {
    this.state.cover[key] = value;
  }

  /**
   * Actualiza una propiedad de una sección de texto
   * @param {string} section - Sección a actualizar (text1, text2, text3)
   * @param {string} property - Propiedad a actualizar (title, content)
   * @param {string} value - Nuevo valor
   */
  updateSectionProperty(section, property, value) {
    this.state.sections[section][property] = value;
  }

  /**
   * Actualiza el tamaño de fuente de una sección
   * @param {string} section - Sección a actualizar
   * @param {number} value - Nuevo tamaño de fuente
   */
  updateFontSize(section, value) {
    this.state.sections[section].fontSize = parseInt(value);
  }

  /**
   * Actualiza el tamaño del título de una sección
   * @param {string} section - Sección a actualizar
   * @param {number} value - Nuevo tamaño de título
   */
  updateTitleSize(section, value) {
    this.state.sections[section].titleSize = parseInt(value);
  }

  /**
   * Añade una nueva forma a una página
   * @param {string} page - Página donde añadir la forma (cover, text1, text2, text3)
   * @param {Object} shape - Objeto con propiedades de la forma
   * @returns {string} - ID de la forma añadida
   */
  addShape(page, shape) {
    const shapeId = 'shape_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    const newShape = {
      id: shapeId,
      type: shape.type || 'rectangle',
      x: shape.x || 50,
      y: shape.y || 50,
      width: shape.width || 100,
      height: shape.height || 100,
      color: shape.color || this.state.colors.secondary,
      opacity: shape.opacity || 0.5,
      rotation: shape.rotation || 0,
      ...shape
    };
    
    this.state.shapes[page].push(newShape);
    
    return shapeId;
  }

  /**
   * Actualiza una forma existente
   * @param {string} page - Página donde está la forma
   * @param {string} shapeId - ID de la forma a actualizar
   * @param {Object} properties - Propiedades a actualizar
   * @returns {boolean} - true si se actualizó correctamente
   */
  updateShape(page, shapeId, properties) {
    const shapeIndex = this.state.shapes[page].findIndex(shape => shape.id === shapeId);
    
    if (shapeIndex !== -1) {
      this.state.shapes[page][shapeIndex] = {
        ...this.state.shapes[page][shapeIndex],
        ...properties
      };
      return true;
    }
    
    return false;
  }

  /**
   * Elimina una forma
   * @param {string} page - Página donde está la forma
   * @param {string} shapeId - ID de la forma a eliminar
   * @returns {boolean} - true si se eliminó correctamente
   */
  removeShape(page, shapeId) {
    const initialLength = this.state.shapes[page].length;
    this.state.shapes[page] = this.state.shapes[page].filter(shape => shape.id !== shapeId);
    
    return initialLength !== this.state.shapes[page].length;
  }

  /**
   * Obtiene todas las formas de una página
   * @param {string} page - Página de la que obtener las formas
   * @returns {Array} - Array de formas
   */
  getShapes(page) {
    return [...this.state.shapes[page]];
  }

  /**
   * Carga datos guardados en el modelo
   * @param {Object} savedData - Datos guardados a cargar
   */
  loadSavedData(savedData) {
    if (savedData.colors) this.state.colors = {...this.state.colors, ...savedData.colors};
    if (savedData.cover) this.state.cover = {...this.state.cover, ...savedData.cover};
    if (savedData.sections) this.state.sections = {...this.state.sections, ...savedData.sections};
    
    if (savedData.shapes) {
      this.state.shapes = {...this.state.shapes, ...savedData.shapes};
    }
  }
  
  /**
   * Obtiene el estado completo del modelo
   * @returns {Object} - Estado actual del modelo
   */
  getState() {
    return this.state;
  }
}

export default BrochureModel;