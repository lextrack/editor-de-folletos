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
   * Carga datos guardados en el modelo
   * @param {Object} savedData - Datos guardados a cargar
   */
  loadSavedData(savedData) {
    if (savedData.colors) this.state.colors = {...this.state.colors, ...savedData.colors};
    if (savedData.cover) this.state.cover = {...this.state.cover, ...savedData.cover};
    if (savedData.sections) this.state.sections = {...this.state.sections, ...savedData.sections};
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