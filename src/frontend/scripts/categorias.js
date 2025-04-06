// Gestión de categorías
const categorias = {
    // Obtener todas las categorías
    async getAll() {
        try {
            const response = await fetch(`${API_URL}/categorias`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Crear categoría
    async create(categoriaData) {
        try {
            const response = await fetch(`${API_URL}/categorias`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoriaData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Actualizar categoría
    async update(id, categoriaData) {
        try {
            const response = await fetch(`${API_URL}/categorias/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoriaData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Eliminar categoría
    async delete(id) {
        try {
            const response = await fetch(`${API_URL}/categorias/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Renderizar lista de categorías
    renderList(categorias) {
        const container = document.getElementById('categoriasList');
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${categorias.map(categoria => `
                        <tr>
                            <td>${categoria.id_categoria}</td>
                            <td>${categoria.nombre_categoria}</td>
                            <td>
                                <button onclick="categorias.showEditModal(${categoria.id_categoria})">Editar</button>
                                <button onclick="categorias.delete(${categoria.id_categoria})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    // Mostrar modal de edición
    async showEditModal(id) {
        const categoria = await this.getById(id);
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modalContent');
        
        modalContent.innerHTML = `
            <h3>Editar Categoría</h3>
            <form id="editCategoriaForm">
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" value="${categoria.nombre_categoria}" required>
                </div>
                <button type="submit">Guardar</button>
            </form>
        `;

        modal.classList.remove('hidden');
        
        document.getElementById('editCategoriaForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                nombre_categoria: document.getElementById('nombre').value
            };
            
            try {
                await this.update(id, formData);
                modal.classList.add('hidden');
                this.loadCategorias();
            } catch (error) {
                alert(error.message);
            }
        });
    },

    // Cargar categorías
    async loadCategorias() {
        try {
            const categorias = await this.getAll();
            this.renderList(categorias);
        } catch (error) {
            alert('Error al cargar categorías');
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const addCategoriaBtn = document.getElementById('addCategoriaBtn');
    
    if (addCategoriaBtn) {
        addCategoriaBtn.addEventListener('click', () => {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            modalContent.innerHTML = `
                <h3>Nueva Categoría</h3>
                <form id="addCategoriaForm">
                    <div class="form-group">
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="nombre" required>
                    </div>
                    <button type="submit">Crear</button>
                </form>
            `;

            modal.classList.remove('hidden');
            
            document.getElementById('addCategoriaForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    nombre_categoria: document.getElementById('nombre').value
                };
                
                try {
                    await categorias.create(formData);
                    modal.classList.add('hidden');
                    categorias.loadCategorias();
                } catch (error) {
                    alert(error.message);
                }
            });
        });
    }
}); 