// Esperamos a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', (e) => {
        // Evitamos que el formulario recargue la página para manejar la validación
        e.preventDefault();

        const emailValue = emailInput.value;
        const passValue = passwordInput.value;

        // Validación de credenciales solicitadas
        if (emailValue === 'admin@mail.com' && passValue === '123456') {
            showToast("Acceso correcto. Redirigiendo al Dashboard...", "success");

            // Redirección al archivo dashboard.html tras 1.5 segundos
            setTimeout(() => {
                window.location.href = '/HTML/dashboard.html';
            }, 1500);

        } else {
            // Mensaje en caso de error
            showToast("Credenciales incorrectas. Intenta de nuevo.", "error");
        }
    });

    /**
     * Crea y muestra un mensaje emergente (Toast) en la pantalla.
     * @param {string} message - El texto a mostrar.
     * @param {string} type - El tipo de mensaje ('success' o 'error').
     */
    function showToast(message, type) {
        // Limpiamos notificaciones anteriores para no amontonarlas
        const oldToast = document.querySelector('.toast-message');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast-message ${type === 'success' ? 'toast-success' : 'toast-error'}`;
        toast.innerText = message;

        document.body.appendChild(toast);

        // Animación de salida y eliminación del elemento
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
});

// 1. DEFINICIÓN DE COMPONENTES
class TicketHubBranding extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="branding">
                <div class="logo-box">
                    <span class="material-symbols-outlined logo-icon">confirmation_number</span>
                </div>
                <h1 class="brand-name">TIKETHUB</h1>
                <p class="brand-subtitle">Admin Console</p>
            </header>
        `;
    }
}

class TicketHubInput extends HTMLElement {
    connectedCallback() {
        const label = this.getAttribute('label') || '';
        const type = this.getAttribute('type') || 'text';
        const id = this.getAttribute('id') || '';
        const icon = this.getAttribute('icon') || '';
        const placeholder = this.getAttribute('placeholder') || '';

        this.innerHTML = `
            <div class="form-group">
                <label class="form-label">${label}</label>
                <div class="input-wrapper">
                    <span class="material-symbols-outlined input-icon">${icon}</span>
                    <input class="form-input" id="${id}-internal" placeholder="${placeholder}" type="${type}"/>
                </div>
            </div>
        `;
    }
}

customElements.define('ticket-hub-branding', TicketHubBranding);
customElements.define('ticket-hub-input', TicketHubInput);

// 2. LÓGICA DE VALIDACIÓN
document.addEventListener('DOMContentLoaded', () => {
    // Estilos para que los componentes se vean
    const style = document.createElement('style');
    style.textContent = `ticket-hub-branding, ticket-hub-input { display: block; width: 100%; }`;
    document.head.appendChild(style);

    const loginForm = document.querySelector('.login-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // IMPORTANTE: Buscamos por el ID que pusiste en el HTML + "-internal"
        const emailInput = document.getElementById('email-field-internal');
        const passwordInput = document.getElementById('password-field-internal');

        if (emailInput && passwordInput) {
            if (emailInput.value === 'admin@mail.com' && passwordInput.value === '123456') {
                showToast("Acceso correcto...", "success");
                setTimeout(() => { window.location.href = '/HTML/dashboard.html'; }, 1500);
            } else {
                showToast("Credenciales incorrectas.", "error");
            }
        }
    });
});

function showToast(message, type) {
    const oldToast = document.querySelector('.toast-message');
    if (oldToast) oldToast.remove();
    const toast = document.createElement('div');
    toast.className = `toast-message ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}