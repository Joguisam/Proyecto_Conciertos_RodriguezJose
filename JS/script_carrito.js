document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Lógica de Carrito Unificada y Compacta Activa");

    // 1. SELECCIÓN DE ELEMENTOS (Soporta index.html y carrito.html)
    const cartModal = document.getElementById('cart-modal') || document.getElementById('checkout-modal');
    const cartCountBadge = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');
    
    // Estado del carrito sincronizado con LocalStorage
    let cartStorage = JSON.parse(localStorage.getItem('temp_cart')) || [];

    // --- FUNCIÓN PARA ACTUALIZAR LA INTERFAZ ---
    function updateCartUI() {
        if (cartCountBadge) {
            cartCountBadge.innerText = cartStorage.length;
            cartCountBadge.style.display = cartStorage.length > 0 ? 'flex' : 'none';
        }

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let total = 0;
            cartStorage.forEach((item, index) => {
                total += parseFloat(item.price);
                cartItemsContainer.innerHTML += `
                    <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:10px; background:var(--surface-container); border-radius:8px;">
                        <div style="display:flex; gap:10px; align-items:center;">
                            <img src="${item.image}" alt="${item.name}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
                            <div>
                                <h4 style="font-size:0.9rem; margin:0;">${item.name}</h4>
                                <p style="font-size:0.8rem; color:var(--secondary); margin:0;">$${item.price}</p>
                            </div>
                        </div>
                        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:var(--error); cursor:pointer;">
                            <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
                        </button>
                    </div>`;
            });
            if (totalPriceElement) totalPriceElement.innerText = `$${total.toFixed(2)}`;
        }
        localStorage.setItem('temp_cart', JSON.stringify(cartStorage));
    }

    // --- FUNCIÓN TOAST COMPACTO (Esquina Superior) ---
    function showToast(title, msg, isError = false) {
        // Eliminar toasts anteriores para evitar acumulación si se desea
        const existingToasts = document.querySelectorAll('.toast-notification');
        existingToasts.forEach(t => t.remove());

        const toast = document.createElement('div');
        // La clase 'error' se añade si es necesario para el CSS
        toast.className = `toast-notification show ${isError ? 'error' : ''}`;
        
        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icon">
                ${isError ? 'error' : 'check_circle'}
            </span>
            <div class="toast-content">
                <div class="toast-text-line">
                    <span class="toast-title">${title}</span>
                    <span class="toast-msg">${msg}</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // --- MANEJADOR DE CLICS GLOBAL (Delegación de Eventos) ---
    document.addEventListener('click', (e) => {
        // A. AÑADIR AL CARRITO (Botones con clase .add-to-cart-btn)
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            const product = {
                name: addBtn.dataset.name,
                price: addBtn.dataset.price,
                image: addBtn.dataset.image
            };
            cartStorage.push(product);
            updateCartUI();
            showToast("Added", `${product.name} to cart`);
        }

        // B. ABRIR EL CARRITO
        if (e.target.closest('#cart-icon-btn')) {
            if (cartModal) cartModal.classList.add('show');
        }

        // C. CERRAR EL CARRITO
        if (e.target.closest('#close-modal-btn') || e.target.closest('#continue-shopping')) {
            if (cartModal) cartModal.classList.remove('show');
        }

        // D. FINALIZAR COMPRA
        if (e.target.id === 'btn-complete-purchase' || e.target.id === 'buy-now-btn') {
            const form = e.target.closest('form');
            if (form) {
                // Validamos si el formulario es válido antes de procesar
                if (!form.checkValidity()) {
                    showToast("Error", "Please fill all fields", true);
                    return; 
                }
                e.preventDefault(); // Solo prevenimos si vamos a procesar la compra
            }

            const name = document.getElementById('checkout-name')?.value || document.getElementById('cust-name')?.value;
            const email = document.getElementById('checkout-email')?.value || document.getElementById('cust-email')?.value;

            if (cartStorage.length === 0) {
                showToast("Error", "Your cart is empty", true);
                return;
            }

            // Crear objeto de venta para el Dashboard
            const nuevaVenta = {
                id: Math.floor(Math.random() * 1000000), // ID aleatorio si no hay input
                cliente: name,
                email: email,
                monto: totalPriceElement?.innerText || "$0.00",
                fecha: new Date().toLocaleDateString(),
                hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            const ventas = JSON.parse(localStorage.getItem('tickethub_sales')) || [];
            ventas.push(nuevaVenta);
            localStorage.setItem('tickethub_sales', JSON.stringify(ventas));

            // Feedback Visual
            showToast("Success", `Purchase complete, ${name}!`);
            
            // Limpieza
            cartStorage = [];
            updateCartUI();
            if (cartModal) cartModal.classList.remove('show');
            if (form) form.reset();
        }
    });

    // Exponer función de borrado para el onclick="removeFromCart(index)"
    window.removeFromCart = (index) => {
        cartStorage.splice(index, 1);
        updateCartUI();
    };

    // Inicializar UI al cargar la página
    updateCartUI();

    // ... (Mantén el resto de tu código igual hasta la función showToast)

    function showToast(title, msg, isError = false) {
        // 1. Eliminar cualquier toast anterior inmediatamente para que no estorben
        const oldToast = document.querySelector('.toast-mini');
        if (oldToast) oldToast.remove();

        // 2. Crear el nuevo elemento ultra-compacto
        const toast = document.createElement('div');
        toast.className = `toast-mini ${isError ? 'error' : ''}`;
        
        // Estructura en una sola línea: [Icono] TITULO: Mensaje
        toast.innerHTML = `
            <span class="material-symbols-outlined mini-icon">
                ${isError ? 'error' : 'check_circle'}
            </span>
            <div class="mini-content">
                <strong>${title}:</strong> <span>${msg}</span>
            </div>
        `;
        
        document.body.appendChild(toast);

        // 3. Animación rápida de entrada y salida
        setTimeout(() => toast.classList.add('active'), 10);
        
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400);
        }, 2500); 
    }

    // --- MANEJADOR DE CLICS (Asegúrate de que use showToast) ---
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            cartStorage.push({
                name: addBtn.dataset.name,
                price: addBtn.dataset.price,
                image: addBtn.dataset.image
            });
            updateCartUI();
            // Llamada compacta
            showToast("Added", addBtn.dataset.name);
        }
        
        // ... (resto de la lógica de abrir/cerrar modal y compra)
        if (e.target.id === 'btn-complete-purchase' || e.target.id === 'buy-now-btn') {
             // ... (tu validación de inputs)
             showToast("Success", "Order placed!"); 
             // ...
        }
    });
});

const nuevaVenta = {
    id: Math.floor(Math.random() * 1000000),
    cliente: document.getElementById('cust-name')?.value || document.getElementById('checkout-name')?.value,
    email: document.getElementById('cust-email')?.value || document.getElementById('checkout-email')?.value,
    // AQUÍ ESTÁ LA CORRECCIÓN:
    direccion: document.getElementById('cust-address')?.value || document.getElementById('checkout-address')?.value,
    telefono: document.getElementById('cust-phone')?.value || "No proporcionado", 
    monto: totalPriceElement?.innerText || "$0.00",
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: ' 2-digit ' })
};
