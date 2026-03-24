document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELECCIÓN DE ELEMENTOS DEL DOM ---
    const eventForm = document.querySelector('.form-body');
    const categorySelect = document.querySelector('select.input-control');
    const tableBody = document.querySelector('.events-table tbody');
    const submitBtn = eventForm.querySelector('.btn-submit-event');
    const categoryFieldGroup = categorySelect.parentElement;

    // --- 2. ESTADO USANDO LOCAL STORAGE ---
    let categories = JSON.parse(localStorage.getItem('tickethub_local_cats')) || [];
    let events = JSON.parse(localStorage.getItem('tickethub_local_events')) || [];
    let editingEventId = null; 

    // --- 3. FUNCIONES DE UI (MODALES Y TOASTS) ---
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return; // Seguridad por si no existe el contenedor
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'warning'}</span> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function showModal({ title, message, confirmText, isDelete = false, onConfirm }) {
        const modalOverlay = document.createElement('div');
        modalOverlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; align-items: center;
            justify-content: center; z-index: 9999; backdrop-filter: blur(8px);
        `;

        const confirmBtnStyle = isDelete 
            ? 'background: rgba(255, 180, 171, 0.1); color: #ffb4ab; border: 1px solid #ffb4ab;' 
            : 'background: var(--prism-gradient); color: white; border: none;';

        modalOverlay.innerHTML = `
            <div class="create-card" style="width: 420px; border: 1px solid var(--outline-variant); animation: prismReveal 0.4s ease-out;">
                <div class="card-header">
                    <div class="icon-accent" style="${isDelete ? 'background: #ffb4ab; color: #000;' : ''}">
                        <span class="material-symbols-outlined">${isDelete ? 'delete_forever' : 'published_with_changes'}</span>
                    </div>
                    <h2 class="card-title">${title}</h2>
                </div>
                <p style="color: var(--on-surface-variant); margin-bottom: 24px; font-size: 14px;">${message}</p>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="modal-cancel" class="btn-filter" style="padding: 10px 20px;">Cancel</button>
                    <button id="modal-confirm" class="btn-submit-event" style="width: auto; margin-top: 0; padding: 10px 24px; ${confirmBtnStyle}">
                        ${confirmText}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        modalOverlay.querySelector('#modal-cancel').onclick = () => modalOverlay.remove();
        modalOverlay.querySelector('#modal-confirm').onclick = () => {
            onConfirm();
            modalOverlay.remove();
        };
    }

    // --- 4. RENDERIZADO DE TABLA ---
    function renderEvents() {
        tableBody.innerHTML = '';
        if (events.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #888;">No events registered yet.</td></tr>`;
            return;
        }

        events.forEach(ev => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><div class="thumbnail-container"><img class="thumbnail-img" src="${ev.image || ''}" onerror="this.src='https://via.placeholder.com/150'"/></div></td>
                <td><span class="code-badge">${ev.code}</span></td>
                <td><p class="event-main-info">${ev.name}</p><p class="price-tier" style="text-transform: uppercase;">${ev.category}</p></td>
                <td><div class="meta-info-row">
                    <div class="meta-item"><span class="material-symbols-outlined icon-sm">location_on</span> ${ev.city}</div>
                    <div class="meta-item"><span class="material-symbols-outlined icon-sm">calendar_today</span> ${ev.date}</div>
                </div></td>
                <td><p class="price-val">$${ev.price}</p></td>
                <td class="actions-cell">
                    <div class="actions-container">
                        <button class="btn-action edit" onclick="prepareEdit('${ev.id}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-action delete" onclick="handleDelete('${ev.id}')">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>`;
            tableBody.appendChild(tr);
        });
    }

    // --- 5. LÓGICA DE EDICIÓN ---
    window.prepareEdit = (id) => {
        const ev = events.find(e => e.id === id);
        if (!ev) return;
        editingEventId = id; 
        
        eventForm.querySelector('input[placeholder="EVT-001"]').value = ev.code;
        eventForm.querySelector('input[placeholder="Prism Summer Festival"]').value = ev.name;
        categorySelect.value = ev.category;
        eventForm.querySelector('input[type="number"]').value = ev.price;
        eventForm.querySelectorAll('select.input-control')[1].value = ev.city;
        eventForm.querySelector('input[type="date"]').value = ev.date;
        eventForm.querySelector('input[type="time"]').value = ev.time;
        eventForm.querySelector('input[type="url"]').value = ev.image;
        eventForm.querySelector('textarea').value = ev.description;

        submitBtn.textContent = "Update Event Details";
        submitBtn.style.background = "var(--secondary)";
        submitBtn.style.color = "var(--on-secondary)";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- 6. GUARDAR (CREATE / UPDATE) ---
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            code: eventForm.querySelector('input[placeholder="EVT-001"]').value,
            name: eventForm.querySelector('input[placeholder="Prism Summer Festival"]').value,
            category: categorySelect.value,
            price: eventForm.querySelector('input[type="number"]').value,
            city: eventForm.querySelectorAll('select.input-control')[1].value,
            date: eventForm.querySelector('input[type="date"]').value,
            time: eventForm.querySelector('input[type="time"]').value,
            image: eventForm.querySelector('input[type="url"]').value,
            description: eventForm.querySelector('textarea').value
        };

        const isEditing = editingEventId !== null;

        showModal({
            title: isEditing ? "Update Event" : "Publish Event",
            message: isEditing 
                ? `Do you want to save the changes for "${formData.name}"?`
                : `Are you sure you want to publish the new event "${formData.name}"?`,
            confirmText: isEditing ? "Save Changes" : "Publish Now",
            onConfirm: () => {
                if (isEditing) {
                    const index = events.findIndex(ev => ev.id === editingEventId);
                    events[index] = { ...formData, id: editingEventId };
                    editingEventId = null; 
                    submitBtn.textContent = "Publish Event";
                    submitBtn.style.background = "var(--prism-gradient)";
                    showToast("Save Changes: Event updated");
                } else {
                    events.push({ ...formData, id: Date.now().toString() });
                    showToast("Save Changes: Event published");
                }
                
                localStorage.setItem('tickethub_local_events', JSON.stringify(events));
                eventForm.reset();
                renderEvents();
            }
        });
    });

    // --- 7. ELIMINAR ---
    window.handleDelete = (id) => {
        const eventToDelete = events.find(e => e.id === id);
        showModal({
            title: "Delete Event",
            message: `You are about to permanently remove "${eventToDelete?.name || 'this event'}". Are you sure?`,
            confirmText: "Delete",
            isDelete: true,
            onConfirm: () => {
                events = events.filter(ev => ev.id !== id);
                localStorage.setItem('tickethub_local_events', JSON.stringify(events));
                renderEvents();
                showToast("Save Changes: Event deleted", "warning");
            }
        });
    };

    // --- 8. INICIALIZACIÓN ---
    function syncCategories() {
        categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
        if (categories.length === 0) {
            categorySelect.disabled = true;
            categorySelect.innerHTML = '<option value="">No categories available</option>';
        } else {
            categorySelect.disabled = false;
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.name;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
        }
    }

    syncCategories();
    renderEvents();
});