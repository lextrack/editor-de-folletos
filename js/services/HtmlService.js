/**
 * Servicio para generar el HTML y la vista previa de impresión
 */
class HtmlService {
  /**
   * Genera el código HTML del folleto
   * @param {Object} state - Estado completo del folleto
   * @returns {string} - Código HTML generado
   */
  generateHtml(state) {
    const { colors, cover, sections, decorations } = state;
    const { text1, text2, text3 } = sections;
    
    const getCoverDivider = (type) => {
      switch(type) {
        case 'divider-none':
          return '';
        case 'divider-dots':
          return `
            <svg class="divider" viewBox="0 0 150 20">
              <line x1="0" y1="10" x2="150" y2="10" stroke="${colors.secondary}" stroke-width="1" stroke-dasharray="3,3"/>
              <circle cx="25" cy="10" r="3" fill="${colors.secondary}"/>
              <circle cx="75" cy="10" r="3" fill="${colors.secondary}"/>
              <circle cx="125" cy="10" r="3" fill="${colors.secondary}"/>
            </svg>`;
        case 'divider-wave':
          return `
            <svg class="divider" viewBox="0 0 150 20">
              <path d="M0,10 C25,0 50,20 75,10 C100,0 125,20 150,10" fill="none" stroke="${colors.secondary}" stroke-width="1"/>
            </svg>`;
        case 'divider-floral':
          return `
            <svg class="divider" viewBox="0 0 150 20">
              <line x1="0" y1="10" x2="150" y2="10" stroke="${colors.secondary}" stroke-width="1"/>
              <path d="M70,10 C70,5 75,0 80,0 C85,0 90,5 90,10 C90,15 85,20 80,20 C75,20 70,15 70,10" fill="${colors.secondary}" opacity="0.6"/>
              <path d="M50,10 C50,7 53,4 56,4 C59,4 62,7 62,10 C62,13 59,16 56,16 C53,16 50,13 50,10" fill="${colors.secondary}" opacity="0.4"/>
              <path d="M90,10 C90,7 93,4 96,4 C99,4 102,7 102,10 C102,13 99,16 96,16 C93,16 90,13 90,10" fill="${colors.secondary}" opacity="0.4"/>
            </svg>`;
        default:
          return `
            <svg class="divider" viewBox="0 0 150 20">
              <line x1="0" y1="10" x2="150" y2="10" stroke="${colors.secondary}" stroke-width="1" stroke-dasharray="1,3"/>
              <path d="M75,5 L80,10 L75,15 L70,10 Z" fill="${colors.secondary}"/>
              <path d="M50,7 C55,5 60,5 65,7 C70,9 75,9 80,7 C85,5 90,5 95,7" fill="none" stroke="${colors.secondary}" stroke-width="1"/>
              <path d="M50,13 C55,15 60,15 65,13 C70,11 75,11 80,13 C85,15 90,15 95,13" fill="none" stroke="${colors.secondary}" stroke-width="1"/>
            </svg>`;
      }
    };

    const getTextDecoration = (type) => {
      switch(type) {
        case 'decoration-none':
          return '';
        case 'decoration-dots':
          return `
            <svg class="text-decoration" viewBox="0 0 50 10">
              <line x1="0" y1="5" x2="50" y2="5" stroke="${colors.secondary}" stroke-width="1" stroke-dasharray="2,2"/>
              <circle cx="10" cy="5" r="2" fill="${colors.secondary}"/>
              <circle cx="25" cy="5" r="2" fill="${colors.secondary}"/>
              <circle cx="40" cy="5" r="2" fill="${colors.secondary}"/>
            </svg>`;
        case 'decoration-star':
          return `
            <svg class="text-decoration" viewBox="0 0 50 10">
              <line x1="0" y1="5" x2="50" y2="5" stroke="${colors.secondary}" stroke-width="1" stroke-dasharray="2,2"/>
              <path d="M25,0 L27,3 L30,4 L27,5 L25,8 L23,5 L20,4 L23,3 Z" fill="${colors.secondary}"/>
            </svg>`;
        case 'decoration-floral':
          return `
            <svg class="text-decoration" viewBox="0 0 50 10">
              <line x1="0" y1="5" x2="50" y2="5" stroke="${colors.secondary}" stroke-width="1"/>
              <path d="M20,5 C20,3 22,1 25,1 C28,1 30,3 30,5 C30,7 28,9 25,9 C22,9 20,7 20,5" fill="${colors.secondary}" opacity="0.6"/>
              <path d="M15,5 C15,4 16,3 17,3 C18,3 19,4 19,5 C19,6 18,7 17,7 C16,7 15,6 15,5" fill="${colors.secondary}" opacity="0.4"/>
              <path d="M31,5 C31,4 32,3 33,3 C34,3 35,4 35,5 C35,6 34,7 33,7 C32,7 31,6 31,5" fill="${colors.secondary}" opacity="0.4"/>
            </svg>`;
        default:
          return `
            <svg class="text-decoration" viewBox="0 0 50 10">
              <line x1="0" y1="5" x2="50" y2="5" stroke="${colors.secondary}" stroke-width="1" stroke-dasharray="1,3"/>
              <circle cx="25" cy="5" r="3" fill="${colors.secondary}"/>
            </svg>`;
      }
    };
    
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>${cover.title} - ${cover.author}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <style>
    :root {
        --primary-color: ${colors.primary};
        --secondary-color: ${colors.secondary};
        --background-color: ${colors.background};
        --cover-color: ${colors.cover};
        --text1-color: ${colors.text1};
        --text2-color: ${colors.text2};
        --text3-color: ${colors.text3};
        --text-color: #333;
        --border-color: rgba(141, 110, 99, 0.3);
    }

    body {
        font-family: 'Libre Baskerville', Georgia, serif;
        line-height: 1.0;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: var(--background-color);
    }

    .page {
        width: 100%;
        max-width: 1150px;
        height: 800px;
        margin: 20px auto;
        position: relative;
        page-break-after: always;
        background-color: #fff;
        border: 1px solid #ccc;
        box-sizing: border-box;
        overflow: hidden;
    }

    .half-page {
        width: 50%;
        height: 100%;
        float: left;
        position: relative;
        box-sizing: border-box;
        padding: 30px;
        overflow: hidden;
    }

    .left {
        border-right: 1px dashed #999;
    }

    .right {
        float: right;
    }

    .cover {
        background-color: var(--cover-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        position: relative;
    }
    
    .page-1-left {
        background-color: var(--text1-color);
    }
    
    .page-2-left {
        background-color: var(--text2-color);
    }
    
    .page-2-right {
        background-color: var(--text3-color);
    }

    .text-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 10;
    }

    .text {
        width: 90%;
        max-width: 420px;
        position: relative;
    }

    h1 {
        font-family: 'Cormorant', serif;
        font-weight: 600;
        font-size: 36px;
        margin-bottom: 5px;
        color: var(--primary-color);
        position: relative;
        z-index: 10;
    }

    .author {
        font-family: 'Cormorant', serif;
        font-size: 28px;
        margin-top: 15px;
        font-style: italic;
        color: var(--secondary-color);
        position: relative;
        z-index: 10;
    }

    .text-title {
        font-family: 'Cormorant', serif;
        font-weight: 500;
        font-size: 30px;
        margin-bottom: 18px;
        text-align: center;
        color: var(--primary-color);
        position: relative;
    }

    .text-content {
        font-size: 14px;
        text-align: center;
        line-height: 1.6;
        white-space: pre-line;
        position: relative;
        z-index: 10;
        color: var(--secondary-color);
    }

    .text-content.balada {
        font-size: ${text1.fontSize}px;
        line-height: 1.5;
    }

    .text-content.placer {
        font-size: ${text3.fontSize}px;
        line-height: 1.5;
    }

    #text2-content {
        font-size: ${text2.fontSize}px;
    }

    .decoration {
        font-family: 'Cormorant', serif;
        font-size: 20px;
        color: var(--secondary-color);
        margin: 15px 0;
        position: relative;
        z-index: 10;
    }

    .note {
        font-family: 'Libre Baskerville', serif;
        font-style: italic;
        font-size: 13px;
        color: var(--secondary-color);
        margin-top: 12px;
        position: relative;
        z-index: 10;
    }

    .border-frame {
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        border: 1px solid var(--border-color);
        z-index: 2;
        pointer-events: none;
    }

    .divider {
        width: 150px;
        height: 20px;
        margin: 10px auto;
        opacity: 0.6;
        position: relative;
        z-index: 5;
    }

    .text-decoration {
        width: 50px;
        height: 15px;
        display: block;
        margin: 5px auto 15px;
        opacity: 0.6;
    }

    @media print {
        body {
            background-color: white;
            margin: 0;
            padding: 0;
        }
        
        .page {
            margin: 0;
            border: none;
        }
        
        .half-page.left {
            border-right: none;
        }
        
        .interior-page {
            transform: rotate(180deg);
        }
        
        .page-1-left, .page-2-left, .page-2-right, .cover {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        @page {
            size: letter landscape;
            margin: 0;
        }
    }
    </style>
</head>
<body>
    <div class="page">
        <div class="half-page left page-1-left">
            <div class="border-frame"></div> 
            <div class="text-container">
                <div class="text">
                    <div class="text-title">${text1.title}</div>
                    ${getTextDecoration(decorations?.text1 || 'decoration-line')}
                    <div class="text-content balada">${text1.content}</div>
                </div>
            </div>
        </div>

        <div class="half-page right cover">
            <div class="border-frame"></div>
            <div class="decoration">${cover.decoration}</div>
            <h1>${cover.title}</h1>
            ${getCoverDivider(decorations?.cover || 'divider-line')}
            <div class="author">${cover.author}</div>
            ${getCoverDivider(decorations?.cover || 'divider-line')}
            <div class="decoration">${cover.decoration}</div>
            <div class="note">${cover.note}</div>
        </div>
    </div>

    <div class="page">   
        <div class="half-page left page-2-left">
            <div class="border-frame"></div>
            <div class="text-container interior-page">
                <div class="text">
                    <div class="text-title">${text2.title}</div>
                    ${getTextDecoration(decorations?.text2 || 'decoration-line')}
                    <div class="text-content" id="text2-content">${text2.content}</div>
                </div>
            </div>
        </div>

        <div class="half-page right page-2-right">
            <div class="border-frame"></div>
            <div class="text-container interior-page">
                <div class="text">
                    <div class="text-title">${text3.title}</div>
                    ${getTextDecoration(decorations?.text3 || 'decoration-line')}
                    <div class="text-content placer">${text3.content}</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Abre una ventana de impresión con el HTML generado
   * @param {string} htmlCode - Código HTML a imprimir
   */
  openPrintPreview(htmlCode) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlCode);
    printWindow.document.close();
    
    setTimeout(() => printWindow.print(), 500);
  }
}

export default HtmlService;