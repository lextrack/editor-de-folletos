/**
 * Gestiona las decoraciones del folleto
 */
class DecorationManager {
  /**
   * @param {BrochureModel} model - Modelo de datos del folleto
   */
  constructor(model) {
    this.model = model;
    this.initElements();
    this.bindEvents();
    this.initDecorations();
  }

  /**
   * Inicializa referencias a elementos DOM
   */
  initElements() {
    this.decorationControls = {
      cover: document.getElementById('coverDecoration'),
      text1: document.getElementById('text1Decoration'),
      text2: document.getElementById('text2Decoration'),
      text3: document.getElementById('text3Decoration')
    };
    
    this.decorationElements = {
      coverDividers: document.querySelectorAll('.cover .divider'),
      text1Decoration: document.querySelector('.page-1-left .text-decoration'),
      text2Decoration: document.querySelector('.page-2-left .text-decoration'),
      text3Decoration: document.querySelector('.page-2-right .text-decoration')
    };
  }

  /**
   * Asocia eventos a los controles
   */
  bindEvents() {
    Object.entries(this.decorationControls).forEach(([section, control]) => {
      if (control) {
        control.addEventListener('change', () => {
          this.updateDecoration(section, control.value);
        });
      }
    });
  }

  /**
   * Inicializa las decoraciones predeterminadas
   */
  initDecorations() {
    if (!this.model.state.decorations) {
      this.model.state.decorations = {
        cover: 'divider-line',
        text1: 'decoration-line',
        text2: 'decoration-line',
        text3: 'decoration-line'
      };
    }
  }

  /**
   * Actualiza la decoración de una sección
   * @param {string} section - Sección a actualizar (cover, text1, text2, text3)
   * @param {string} type - Tipo de decoración
   */
  updateDecoration(section, type) {
    this.model.state.decorations[section] = type;
    
    if (section === 'cover') {
      this.updateCoverDividers(type);
    } else {
      this.updateTextDecoration(section, type);
    }
  }

  /**
   * Actualiza los divisores de la portada
   * @param {string} type - Tipo de divisor
   */
  updateCoverDividers(type) {
    const dividers = this.decorationElements.coverDividers;
    if (!dividers || dividers.length === 0) return;
    
    dividers.forEach(divider => {
      switch(type) {
        case 'divider-none':
          divider.style.display = 'none';
          break;
        case 'divider-dots':
          divider.innerHTML = `
            <line x1="0" y1="10" x2="150" y2="10" stroke="${this.model.state.colors.secondary}" stroke-width="1" stroke-dasharray="3,3"/>
            <circle cx="25" cy="10" r="3" fill="${this.model.state.colors.secondary}"/>
            <circle cx="75" cy="10" r="3" fill="${this.model.state.colors.secondary}"/>
            <circle cx="125" cy="10" r="3" fill="${this.model.state.colors.secondary}"/>
          `;
          divider.style.display = 'block';
          break;
        case 'divider-wave':
          divider.innerHTML = `
            <path d="M0,10 C25,0 50,20 75,10 C100,0 125,20 150,10" fill="none" stroke="${this.model.state.colors.secondary}" stroke-width="1"/>
          `;
          divider.style.display = 'block';
          break;
        case 'divider-floral':
          divider.innerHTML = `
            <line x1="0" y1="10" x2="150" y2="10" stroke="${this.model.state.colors.secondary}" stroke-width="1"/>
            <path d="M70,10 C70,5 75,0 80,0 C85,0 90,5 90,10 C90,15 85,20 80,20 C75,20 70,15 70,10" fill="${this.model.state.colors.secondary}" opacity="0.6"/>
            <path d="M50,10 C50,7 53,4 56,4 C59,4 62,7 62,10 C62,13 59,16 56,16 C53,16 50,13 50,10" fill="${this.model.state.colors.secondary}" opacity="0.4"/>
            <path d="M90,10 C90,7 93,4 96,4 C99,4 102,7 102,10 C102,13 99,16 96,16 C93,16 90,13 90,10" fill="${this.model.state.colors.secondary}" opacity="0.4"/>
          `;
          divider.style.display = 'block';
          break;
        default:
          divider.innerHTML = `
            <line x1="0" y1="10" x2="150" y2="10" stroke="${this.model.state.colors.secondary}" stroke-width="1" stroke-dasharray="1,3"/>
            <path d="M75,5 L80,10 L75,15 L70,10 Z" fill="${this.model.state.colors.secondary}"/>
            <path d="M50,7 C55,5 60,5 65,7 C70,9 75,9 80,7 C85,5 90,5 95,7" fill="none" stroke="${this.model.state.colors.secondary}" stroke-width="1"/>
            <path d="M50,13 C55,15 60,15 65,13 C70,11 75,11 80,13 C85,15 90,15 95,13" fill="none" stroke="${this.model.state.colors.secondary}" stroke-width="1"/>
          `;
          divider.style.display = 'block';
          break;
      }
    });
  }

  /**
   * Actualiza la decoración de una sección de texto
   * @param {string} section - Sección (text1, text2, text3)
   * @param {string} type - Tipo de decoración
   */
  updateTextDecoration(section, type) {
    const decoration = this.decorationElements[`${section}Decoration`];
    if (!decoration) return;
    
    switch(type) {
      case 'decoration-none':
        decoration.style.display = 'none';
        break;
      case 'decoration-dots':
        decoration.innerHTML = `
          <line x1="0" y1="5" x2="50" y2="5" stroke="${this.model.state.colors.secondary}" stroke-width="1" stroke-dasharray="2,2"/>
          <circle cx="10" cy="5" r="2" fill="${this.model.state.colors.secondary}"/>
          <circle cx="25" cy="5" r="2" fill="${this.model.state.colors.secondary}"/>
          <circle cx="40" cy="5" r="2" fill="${this.model.state.colors.secondary}"/>
        `;
        decoration.style.display = 'block';
        break;
      case 'decoration-star':
        decoration.innerHTML = `
          <line x1="0" y1="5" x2="50" y2="5" stroke="${this.model.state.colors.secondary}" stroke-width="1" stroke-dasharray="2,2"/>
          <path d="M25,0 L27,3 L30,4 L27,5 L25,8 L23,5 L20,4 L23,3 Z" fill="${this.model.state.colors.secondary}"/>
        `;
        decoration.style.display = 'block';
        break;
      case 'decoration-floral':
        decoration.innerHTML = `
          <line x1="0" y1="5" x2="50" y2="5" stroke="${this.model.state.colors.secondary}" stroke-width="1"/>
          <path d="M20,5 C20,3 22,1 25,1 C28,1 30,3 30,5 C30,7 28,9 25,9 C22,9 20,7 20,5" fill="${this.model.state.colors.secondary}" opacity="0.6"/>
          <path d="M15,5 C15,4 16,3 17,3 C18,3 19,4 19,5 C19,6 18,7 17,7 C16,7 15,6 15,5" fill="${this.model.state.colors.secondary}" opacity="0.4"/>
          <path d="M31,5 C31,4 32,3 33,3 C34,3 35,4 35,5 C35,6 34,7 33,7 C32,7 31,6 31,5" fill="${this.model.state.colors.secondary}" opacity="0.4"/>
        `;
        decoration.style.display = 'block';
        break;
      default:
        decoration.innerHTML = `
          <line x1="0" y1="5" x2="50" y2="5" stroke="${this.model.state.colors.secondary}" stroke-width="1" stroke-dasharray="1,3"/>
          <circle cx="25" cy="5" r="3" fill="${this.model.state.colors.secondary}"/>
        `;
        decoration.style.display = 'block';
        break;
    }
  }

  /**
   * Actualiza la UI desde el modelo
   */
  updateUIFromModel() {
    const { decorations } = this.model.state;
    if (!decorations) return;
    
    Object.entries(decorations).forEach(([section, type]) => {
      const control = this.decorationControls[section];
      if (control) {
        control.value = type;
      }
      
      if (section === 'cover') {
        this.updateCoverDividers(type);
      } else {
        this.updateTextDecoration(section, type);
      }
    });
  }
}

export default DecorationManager;