/**
 * Utilidades para interactuar con el DOM
 */
class DOMUtils {
  /**
   * Muestra un mensaje de notificación tipo toast
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de mensaje (success, danger, warning, info)
   * @param {number} duration - Duración en milisegundos
   */
  static showToast(message, type = 'success', duration = 3000) {
    const toastEl = document.createElement('div');
    toastEl.className = 'position-fixed bottom-0 start-50 translate-middle-x p-3';
    toastEl.style.zIndex = '2000';
    
    toastEl.innerHTML = `
      <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i> ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    
    document.body.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl.querySelector('.toast'));
    toast.show();
    
    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.remove();
      }
    }, duration);
  }

  /**
   * Muestra un diálogo de confirmación
   * @param {string} message - Mensaje de confirmación
   * @param {Function} onConfirm - Función a ejecutar al confirmar
   * @param {Function} onCancel - Función a ejecutar al cancelar
   */
  static showConfirmDialog(message, onConfirm, onCancel = () => {}) {
    const modalEl = document.createElement('div');
    modalEl.className = 'modal fade';
    modalEl.setAttribute('tabindex', '-1');
    
    modalEl.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar acción</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${message}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cancelBtn" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="confirmBtn">Continuar</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modalEl);
    
    const confirmModal = new bootstrap.Modal(modalEl);
    
    const confirmBtn = modalEl.querySelector('#confirmBtn');
    confirmBtn.addEventListener('click', () => {
      confirmModal.hide();
      onConfirm();
    });
    
    const cancelBtn = modalEl.querySelector('#cancelBtn');
    cancelBtn.addEventListener('click', onCancel);
    
    confirmModal.show();
    
    modalEl.addEventListener('hidden.bs.modal', () => {
      modalEl.remove();
    });
  }

  /**
   * Copia texto al portapapeles
   * @param {string} text - Texto a copiar
   * @returns {Promise<boolean>} - True si se copió correctamente
   */
  static async copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Error al copiar con Clipboard API:', err);
        return this.fallbackCopyToClipboard(text);
      }
    } else {
      return this.fallbackCopyToClipboard(text);
    }
  }

  /**
   * Método alternativo para copiar al portapapeles
   * @param {string} text - Texto a copiar
   * @returns {boolean} - True si se copió correctamente
   * @private
   */
  static fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (err) {
      console.error('Error al copiar:', err);
      document.body.removeChild(textarea);
      return false;
    }
  }
}

export default DOMUtils;