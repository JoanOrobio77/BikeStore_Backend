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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
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
            if (!confirm('¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.')) {
                return;
            }

            const response = await fetch(`${API_URL}/categorias/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar la categoría');
            }

            alert('Categoría eliminada exitosamente');
            this.loadCategorias();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al eliminar la categoría. Asegúrese de que no haya productos asociados.');
        }
    },

    // Obtener categoría por ID
    async getById(id) {
        try {
            const response = await fetch(`${API_URL}/categorias/${id}`, {
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
        if (!container) return;

        if (!categorias || categorias.length === 0) {
            container.innerHTML = '<p>No hay categorías disponibles.</p>';
            return;
        }

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
        try {
            const categoria = await this.getById(id);
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            modalContent.innerHTML = `
                <h3>Editar Categoría</h3>
                <form id="editCategoriaForm">
                    <div class="form-group">
                        <label for="nombre_categoria">Nombre:</label>
                        <input type="text" id="nombre_categoria" value="${categoria.nombre_categoria}" required>
                    </div>
                    <button type="submit">Guardar</button>
                </form>
            `;

            modal.classList.remove('hidden');
            modal.classList.add('show');
            
            document.getElementById('editCategoriaForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    nombre_categoria: document.getElementById('nombre_categoria').value
                };
                
                try {
                    await this.update(id, formData);
                    modal.classList.remove('show');
                    modal.classList.add('hidden');
                    this.loadCategorias();
                } catch (error) {
                    console.error('Error al actualizar categoría:', error);
                    alert(error.message || 'Error al actualizar la categoría');
                }
            });
        } catch (error) {
            console.error('Error al cargar categoría:', error);
            alert('Error al cargar los datos de la categoría');
        }
    },

    // Cargar categorías
    async loadCategorias() {
        try {
            const categorias = await this.getAll();
            this.renderList(categorias);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            alert('Error al cargar las categorías');
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
                        <label for="nombre_categoria">Nombre:</label>
                        <input type="text" id="nombre_categoria" required>
                    </div>
                    <button type="submit">Crear Categoría</button>
                </form>
            `;

            modal.classList.remove('hidden');
            modal.classList.add('show');
            
            document.getElementById('addCategoriaForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    nombre_categoria: document.getElementById('nombre_categoria').value
                };
                
                try {
                    await categorias.create(formData);
                    modal.classList.remove('show');
                    modal.classList.add('hidden');
                    categorias.loadCategorias();
                } catch (error) {
                    console.error('Error al crear categoría:', error);
                    alert(error.message || 'Error al crear la categoría');
                }
            });
        });
    }
}); 