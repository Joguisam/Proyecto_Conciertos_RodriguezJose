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