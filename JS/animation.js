document.addEventListener('DOMContentLoaded', () => {
    // 1. Inyectamos estilos de ENTRADA y SALIDA
    const style = document.createElement('style');
    style.textContent = `
        /* Estado inicial: Invisible y desenfocado */
        .prism-universal-animate {
            opacity: 0 !important;
            filter: blur(12px) !important;
            transform: translateY(20px) !important;
            transition: 
                opacity 0.6s ease, 
                filter 0.6s ease, 
                transform 0.7s cubic-bezier(0.23, 1, 0.32, 1) !important;
        }

        /* Estado visible */
        .prism-universal-animate.reveal-active {
            opacity: 1 !important;
            filter: blur(0) !important;
            transform: translateY(0) !important;
        }

        /* Animación de salida para toda la página */
        body.page-exit {
            opacity: 0;
            filter: blur(10px);
            transform: scale(0.98);
            transition: all 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // 2. Animación de ENTRADA al cargar
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.05 });

    // Seleccionamos todo el contenido relevante
    const elements = document.querySelectorAll('section, .stat-card, .welcome-section, .form-container, .table-container, table tr, .sidebar, .login-card, .filter-bar, .live-chip');

    elements.forEach((el, i) => {
        el.classList.add('prism-universal-animate');
        // Cascada automática: cada elemento tarda 0.04s más que el anterior
        el.style.transitionDelay = `${i * 0.04}s`;
        observer.observe(el);
    });

    // 3. LOGICA DE CAMBIO DE PÁGINA (SALIDA)
    // Detectamos clics en todos los enlaces internos
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.getAttribute('href');

            // Solo animamos si es un enlace interno (no # ni externos)
            if (destination && destination !== '#' && !destination.startsWith('http')) {
                e.preventDefault(); // Detenemos la carga instantánea

                // Aplicamos clase de salida al cuerpo de la página
                document.body.classList.add('page-exit');

                // Esperamos a que la animación termine antes de cambiar de URL
                setTimeout(() => {
                    window.location.href = destination;
                }, 400); // 400ms coincide con la transición del CSS
            }
        });
    });
});