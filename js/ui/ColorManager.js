/**
 * Gestiona los colores del folleto y sus controles
 */
class ColorManager {
  /**
   * @param {BrochureModel} model - Modelo de datos del folleto
   */
  constructor(model) {
    this.model = model;
    this.elements = {
      primary: document.getElementById('primaryColor'),
      secondary: document.getElementById('secondaryColor'),
      background: document.getElementById('backgroundColor'),
      cover: document.getElementById('coverColor'),
      allPages: document.getElementById('allPagesColor'), 
      text1: document.getElementById('text1Color'),
      text2: document.getElementById('text2Color'),
      text3: document.getElementById('text3Color')
    };
    
    this.pageElements = {
      text1: document.querySelector('.page-1-left'),
      text2: document.querySelector('.page-2-left'),
      text3: document.querySelector('.page-2-right')
    };
    
    this.textElements = {
      text1: document.querySelector('.page-1-left .text-content'),
      text2: document.querySelector('.page-2-left .text-content'),
      text3: document.querySelector('.page-2-right .text-content')
    };
    
    this.bindEvents();
  }

  /**
   * Asocia eventos a los controles de color
   */
  bindEvents() {
    Object.entries(this.elements).forEach(([key, element]) => {
      if (element) {
        element.addEventListener('input', () => {
          if (key === 'allPages') {
            this.applyColorToAllPages(element.value);
          } else if (['text1', 'text2', 'text3'].includes(key)) {
            this.updatePageColor(key, element.value);
          } else {
            this.updateColor(key, element.value);
          }
        });
      }
    });
  }

  /**
   * Actualiza un color y sus elementos visuales
   * @param {string} key - Clave del color a actualizar
   * @param {string} value - Valor hexadecimal del color
   */
  updateColor(key, value) {
    this.model.updateColor(key, value);
    this.updateColorVariableInDOM(key, value);
    
    if (key === 'primary') {
      document.querySelectorAll('.text-title, h1').forEach(element => {
        element.style.color = value;
      });
    } else if (key === 'secondary') {
      this.updateSvgColors(value);
    
      document.querySelectorAll('.text-content').forEach(element => {
        element.style.color = value;
      });
      
      document.querySelectorAll('.author, .note, .decoration').forEach(element => {
        element.style.color = value;
      });
    }
  }

  /**
   * Actualiza una variable CSS de color en el DOM
   * @param {string} key - Clave del color a actualizar
   * @param {string} value - Valor hexadecimal del color
   */
  updateColorVariableInDOM(key, value) {
    document.documentElement.style.setProperty(`--${key}-color`, value);
  }

  /**
   * Actualiza los colores de los elementos SVG
   * @param {string} color - Valor hexadecimal del color
   */
  updateSvgColors(color) {
    document.querySelectorAll('.text-decoration line, .divider line').forEach(line => {
      line.setAttribute('stroke', color);
    });
    document.querySelectorAll('.text-decoration circle, .divider path').forEach(element => {
      element.setAttribute('fill', color);
    });
    document.querySelectorAll('.divider path[fill="none"]').forEach(element => {
      element.setAttribute('stroke', color);
    });
  }

  /**
   * Actualiza el color de fondo de una página específica
   * @param {string} page - Clave de la página (text1, text2, text3)
   * @param {string} color - Valor hexadecimal del color
   * @param {boolean} updateControl - Si se debe actualizar el control asociado
   */
  updatePageColor(page, color, updateControl = true) {
    this.model.updateColor(page, color);
    this.updateColorVariableInDOM(page, color);
    
    const pageElement = this.pageElements[page];
    if (pageElement) {
      pageElement.style.backgroundColor = color;
    }
    
    if (updateControl && this.elements[page]) {
      this.elements[page].value = color;
    }
  }

  /**
   * Aplica un color a todas las páginas
   * @param {string} color - Valor hexadecimal del color
   */
  applyColorToAllPages(color) {
    this.model.applyColorToAllPages(color);
    
    if (this.elements.text1) this.elements.text1.value = color;
    if (this.elements.text2) this.elements.text2.value = color;
    if (this.elements.text3) this.elements.text3.value = color;
    
    this.updatePageColor('text1', color, false);
    this.updatePageColor('text2', color, false);
    this.updatePageColor('text3', color, false);
  }

  /**
   * Actualiza todos los controles de color con los valores del modelo
   */
  updateUIFromModel() {
    const { colors } = this.model.getState();
    
    Object.entries(colors).forEach(([key, value]) => {
      if (this.elements[key]) {
        this.elements[key].value = value;
      }
      
      if (['primary', 'secondary', 'background', 'cover', 'allPages'].includes(key)) {
        this.updateColorVariableInDOM(key, value);
        
        if (key === 'primary') {
          document.querySelectorAll('.text-title, h1').forEach(element => {
            element.style.color = value;
          });
        } else if (key === 'secondary') {
          this.updateSvgColors(value);
          
          document.querySelectorAll('.text-content').forEach(element => {
            element.style.color = value;
          });
          
          document.querySelectorAll('.author, .note, .decoration').forEach(element => {
            element.style.color = value;
          });
        }
      } else if (['text1', 'text2', 'text3'].includes(key)) {
        this.updatePageColor(key, value, false);
      }
    });
  }
}

export default ColorManager;