/**
 * Gestiona los textos y sus controles
 */
class TextManager {
  /**
   * @param {BrochureModel} model - Modelo de datos del folleto
   */
  constructor(model) {
    this.model = model;
    this.initElements();
    this.bindEvents();
  }

  /**
   * Inicializa referencias a elementos DOM
   */
  initElements() {
    // Elementos de controles de portada
    this.coverElements = {
      title: document.getElementById('coverTitle'),
      author: document.getElementById('authorName'),
      note: document.getElementById('coverNote'),
      decoration: document.getElementById('decorationSymbol')
    };
    
    // Elementos de vista previa de portada
    this.coverPreviewElements = {
      title: document.getElementById('preview-cover-title'),
      author: document.getElementById('preview-author-name'),
      note: document.getElementById('preview-cover-note'),
      decoration: [
        document.getElementById('preview-decoration-symbol'),
        document.getElementById('preview-decoration-symbol-2')
      ]
    };
    
    // Elementos de control de las secciones de texto
    this.sectionElements = {};
    ['text1', 'text2', 'text3'].forEach(section => {
      this.sectionElements[section] = {
        title: document.getElementById(`${section}Title`),
        content: document.getElementById(`${section}Content`),
        fontSize: document.getElementById(`${section}FontSize`),
        fontSizeValue: document.getElementById(`${section}FontSizeValue`),
        titleSize: document.getElementById(`${section}TitleSize`),
        titleSizeValue: document.getElementById(`${section}TitleSizeValue`)
      };
    });
    
    // Elementos de vista previa de las secciones de texto
    this.previewElements = {};
    ['text1', 'text2', 'text3'].forEach(section => {
      this.previewElements[section] = {
        title: document.getElementById(`preview-${section}-title`),
        content: document.getElementById(`preview-${section}-content`)
      };
    });
  }

  /**
   * Asocia eventos a los controles
   */
  bindEvents() {
    // Eventos para los controles de portada
    Object.entries(this.coverElements).forEach(([key, element]) => {
      if (element) {
        element.addEventListener('input', () => {
          this.updateCoverProperty(key, element.value);
        });
      }
    });
    
    ['text1', 'text2', 'text3'].forEach(section => {
      const elements = this.sectionElements[section];
      
      if (elements.title) {
        elements.title.addEventListener('input', () => {
          this.updateSectionProperty(section, 'title', elements.title.value);
        });
      }
      
      if (elements.content) {
        elements.content.addEventListener('input', () => {
          this.updateSectionProperty(section, 'content', elements.content.value);
        });
      }
      
      if (elements.fontSize) {
        elements.fontSize.addEventListener('input', () => {
          this.updateFontSize(section, elements.fontSize.value);
        });
      }
      
      if (elements.titleSize) {
        elements.titleSize.addEventListener('input', () => {
          this.updateTitleSize(section, elements.titleSize.value);
        });
      }
    });
  }

  /**
   * Actualiza una propiedad de la portada
   * @param {string} key - Clave de la propiedad a actualizar
   * @param {string} value - Nuevo valor
   */
  updateCoverProperty(key, value) {
    this.model.updateCoverProperty(key, value);
    this.updateCoverPreview(key, value);
  }

  /**
   * Actualiza la vista previa de una propiedad de la portada
   * @param {string} key - Clave de la propiedad
   * @param {string} value - Valor a mostrar
   */
  updateCoverPreview(key, value) {
    if (key === 'decoration') {
      this.coverPreviewElements.decoration.forEach(element => {
        if (element) element.textContent = value;
      });
    } else {
      const previewElement = this.coverPreviewElements[key];
      if (previewElement) previewElement.textContent = value;
    }
  }

  /**
   * Actualiza una propiedad de una sección de texto
   * @param {string} section - Sección a actualizar
   * @param {string} property - Propiedad a actualizar
   * @param {string} value - Nuevo valor
   */
  updateSectionProperty(section, property, value) {
    this.model.updateSectionProperty(section, property, value);
    this.updateSectionPreview(section, property, value);
  }

  /**
   * Actualiza la vista previa de una propiedad de una sección
   * @param {string} section - Sección a actualizar
   * @param {string} property - Propiedad a actualizar
   * @param {string} value - Valor a mostrar
   */
  updateSectionPreview(section, property, value) {
    const previewElement = this.previewElements[section][property];
    if (previewElement) previewElement.textContent = value;
  }

  /**
   * Actualiza el tamaño de fuente de una sección
   * @param {string} section - Sección a actualizar
   * @param {number} value - Nuevo tamaño de fuente
   */
  updateFontSize(section, value) {
    this.model.updateFontSize(section, value);
    
    const fontSizeValueElement = this.sectionElements[section].fontSizeValue;
    const previewElement = this.previewElements[section].content;
    
    if (fontSizeValueElement) fontSizeValueElement.textContent = `${value}px`;
    if (previewElement) previewElement.style.fontSize = `${value}px`;
  }

  /**
   * Actualiza el tamaño del título de una sección
   * @param {string} section - Sección a actualizar
   * @param {number} value - Nuevo tamaño de título
   */
  updateTitleSize(section, value) {
    this.model.updateTitleSize(section, value);
    
    const titleSizeValueElement = this.sectionElements[section].titleSizeValue;
    const previewElement = this.previewElements[section].title;
    
    if (titleSizeValueElement) titleSizeValueElement.textContent = `${value}px`;
    if (previewElement) previewElement.style.fontSize = `${value}px`;
  }

  /**
   * Actualiza todos los controles e interfaz con los datos del modelo
   */
  updateUIFromModel() {
    const { cover, sections } = this.model.getState();
    
    Object.entries(cover).forEach(([key, value]) => {
      if (this.coverElements[key]) {
        this.coverElements[key].value = value;
      }
      this.updateCoverPreview(key, value);
    });
    
    ['text1', 'text2', 'text3'].forEach(section => {
      if (sections[section]) {
        const { title, content, fontSize, titleSize } = sections[section];
        
        const elements = this.sectionElements[section];
        if (elements.title) elements.title.value = title;
        if (elements.content) elements.content.value = content;
        if (elements.fontSize) elements.fontSize.value = fontSize;
        if (elements.titleSize) elements.titleSize.value = titleSize;
        
        this.updateSectionPreview(section, 'title', title);
        this.updateSectionPreview(section, 'content', content);
        this.updateFontSize(section, fontSize);
        this.updateTitleSize(section, titleSize);
      }
    });
  }
}

export default TextManager;