// --- 1. ELEMENTOS DEL DOM ---
const categoryTableBody = document.getElementById('categoryTableBody');
const categoryForm = document.getElementById('categoryForm');
const categoryModal = document.getElementById('categoryModal');
const confirmModal = document.getElementById('confirmModal');
const btnAddNew = document.getElementById('btnAddNew');
const iconOptions = document.querySelectorAll('.icon-option');

// --- 2. ESTADO USANDO LOCAL STORAGE ---
// Cambiado de sessionStorage a localStorage para persistencia permanente
let categories = JSON.parse(localStorage.getItem('tickethub_local_cats')) || [];
let editMode = false;
let currentEditId = null;
let idToDelete = null;

// --- 3. FUNCIONES DE RENDERIZADO ---
function renderCategories() {
    categoryTableBody.innerHTML = '';
    
    if (categories.length === 0) {
        categoryTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--color-outline);">No categories found. Add one to start.</td></tr>';
        return;
    }

    categories.forEach(cat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="category-cell">
                    <div class="category-icon icon-accent">
                        <span class="material-symbols-outlined">${cat.icon}</span>
                    </div>
                    <span class="category-name">${cat.name}</span>
                </div>
            </td>
            <td class="description-cell">${cat.description}</td>
            <td class="date-cell">${cat.date}</td>
            <td class="actions-cell">
                <div class="action-btns">
                    <button class="action-btn edit" onclick="prepareEdit('${cat.id}')">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="action-btn delete" onclick="prepareDelete('${cat.id}')">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        `;
        categoryTableBody.appendChild(tr);
    });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'warning'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- 4. ACCIONES CRUD ---

// GUARDAR (CREAR O EDITAR)
categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedIcon = document.querySelector('.icon-option.selected').dataset.icon;
    const name = document.getElementById('catName').value;
    const desc = document.getElementById('catDesc').value;

    if (editMode) {
        categories = categories.map(c => c.id === currentEditId ? 
            { ...c, name, description: desc, icon: selectedIcon } : c);
        showToast("Save Changes: Category updated");
    } else {
        const newCat = {
            id: Date.now().toString(),
            name,
            description: desc,
            icon: selectedIcon,
            date: new Date().toLocaleDateString()
        };
        categories.push(newCat);
        showToast("Save Changes: Category created");
    }

    // Guardar en LocalStorage
    localStorage.setItem('tickethub_local_cats', JSON.stringify(categories));
    renderCategories();
    closeAllModals();
});

// EDITAR (Global para los botones de la tabla)
window.prepareEdit = (id) => {
    const cat = categories.find(c => c.id === id);
    if (cat) {
        editMode = true;
        currentEditId = id;
        document.getElementById('modalTitle').innerText = "Edit Category";
        document.getElementById('catName').value = cat.name;
        document.getElementById('catDesc').value = cat.description;
        
        iconOptions.forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.icon === cat.icon);
        });
        
        categoryModal.style.display = 'flex';
    }
};

// ELIMINAR (Global para los botones de la tabla)
window.prepareDelete = (id) => {
    idToDelete = id;
    confirmModal.style.display = 'flex';
};

document.getElementById('confirmDelete').onclick = () => {
    categories = categories.filter(c => c.id !== idToDelete);
    localStorage.setItem('tickethub_local_cats', JSON.stringify(categories));
    renderCategories();
    closeAllModals();
    showToast("Save Changes: Category deleted", "delete");
};

// --- 5. CONTROL DE MODALES Y UI ---
function closeAllModals() {
    categoryModal.style.display = 'none';
    confirmModal.style.display = 'none';
    categoryForm.reset();
}

btnAddNew.onclick = () => {
    editMode = false;
    document.getElementById('modalTitle').innerText = "New Category";
    categoryModal.style.display = 'flex';
};

document.getElementById('closeModal').onclick = closeAllModals;
document.getElementById('cancelBtn').onclick = closeAllModals;
document.getElementById('cancelDelete').onclick = closeAllModals;

// Selector de iconos
iconOptions.forEach(option => {
    option.onclick = () => {
        iconOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    };
});

// Carga inicial
renderCategories();