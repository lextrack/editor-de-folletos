/**
 * Gestiona las ventanas modales de la aplicación
 */
class ModalManager {
  constructor() {
    this.initModals();
  }

  /**
   * Inicializa las instancias de los modales
   */
  initModals() {
    this.modals = {
      code: new bootstrap.Modal(document.getElementById('codeModal')),
      info: new bootstrap.Modal(document.getElementById('infoModal'))
    };
  }

  /**
   * Muestra el modal de código con el contenido especificado
   * @param {string} htmlCode - Código HTML a mostrar
   */
  showCodeModal(htmlCode) {
    const codeElement = document.getElementById('generatedCode');
    if (codeElement) {
      codeElement.textContent = htmlCode;
    }
    this.modals.code.show();
  }

  /**
   * Muestra el modal de información
   */
  showInfoModal() {
    this.modals.info.show();
  }

  /**
   * Oculta el modal especificado
   * @param {string} modalName - Nombre del modal a ocultar
   */
  hideModal(modalName) {
    if (this.modals[modalName]) {
      this.modals[modalName].hide();
    }
  }
}

export default ModalManager;