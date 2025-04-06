// Gestión de productos
const productos = {
    // Obtener todos los productos
    async getAll() {
        try {
            const response = await fetch(`${API_URL}/productos`, {
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

    // Crear producto
    async create(productoData) {
        try {
            const formData = new FormData();
            formData.append('nombre_producto', productoData.nombre_producto);
            formData.append('descripcion', productoData.descripcion);
            formData.append('precio', productoData.precio);
            formData.append('id_categoria', productoData.id_categoria);
            if (productoData.imagen) {
                formData.append('imagen', productoData.imagen);
            }

            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al crear el producto');
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Actualizar producto
    async update(id, productoData) {
        try {
            const formData = new FormData();
            for (let key in productoData) {
                formData.append(key, productoData[key]);
            }

            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Eliminar producto
    async delete(id) {
        try {
            if (!confirm('¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.')) {
                return;
            }

            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar el producto');
            }

            alert('Producto eliminado exitosamente');
            this.loadProductos();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al eliminar el producto');
        }
    },

    // Obtener producto por ID
    async getById(id) {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener el producto');
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Renderizar lista de productos
    renderList(productos) {
        const container = document.getElementById('productosList');
        if (!container) return;

        if (!productos || productos.length === 0) {
            container.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${productos.map(producto => `
                        <tr>
                            <td>${producto.id_producto}</td>
                            <td>${producto.nombre_producto || 'Sin nombre'}</td>
                            <td>${producto.descripcion || 'Sin descripción'}</td>
                            <td>$${producto.precio}</td>
                            <td>${producto.id_categoria}</td>
                            <td>
                                <button onclick="productos.showEditModal(${producto.id_producto})">Editar</button>
                                <button onclick="productos.delete(${producto.id_producto})">Eliminar</button>
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
            const [producto, categorias] = await Promise.all([
                this.getById(id),
                this.loadCategorias()
            ]);

            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            modalContent.innerHTML = `
                <h3>Editar Producto</h3>
                <form id="editProductoForm">
                    <div class="form-group">
                        <label for="nombre_producto">Nombre:</label>
                        <input type="text" id="nombre_producto" name="nombre_producto" value="${producto.nombre_producto}" required>
                    </div>
                    <div class="form-group">
                        <label for="descripcion">Descripción:</label>
                        <textarea id="descripcion" name="descripcion" required>${producto.descripcion}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="precio">Precio:</label>
                        <input type="number" id="precio" name="precio" step="0.01" value="${producto.precio}" required>
                    </div>
                    <div class="form-group">
                        <label for="id_categoria">Categoría:</label>
                        <select id="id_categoria" name="id_categoria" required>
                            <option value="">Seleccione una categoría</option>
                            ${categorias.map(cat => `
                                <option value="${cat.id_categoria}" ${cat.id_categoria === producto.id_categoria ? 'selected' : ''}>
                                    ${cat.nombre_categoria}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="imagen">Imagen:</label>
                        <input type="file" id="imagen" name="imagen" accept="image/*">
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>
            `;

            modal.classList.remove('hidden');
            modal.classList.add('show');
            
            document.getElementById('editProductoForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    nombre_producto: document.getElementById('nombre_producto').value,
                    descripcion: document.getElementById('descripcion').value,
                    precio: document.getElementById('precio').value,
                    id_categoria: document.getElementById('id_categoria').value,
                    imagen: document.getElementById('imagen').files[0]
                };
                
                try {
                    await this.update(id, formData);
                    modal.classList.remove('show');
                    modal.classList.add('hidden');
                    this.loadProductos();
                } catch (error) {
                    alert(error.message || 'Error al actualizar el producto');
                }
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los datos del producto');
        }
    },

    // Cargar categorías
    async loadCategorias() {
        try {
            const response = await fetch(`${API_URL}/categorias`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            throw new Error('Error al cargar las categorías');
        }
    },

    // Cargar productos
    async loadProductos() {
        try {
            const productos = await this.getAll();
            this.renderList(productos);
        } catch (error) {
            alert('Error al cargar productos');
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const addProductoBtn = document.getElementById('addProductoBtn');
    const modal = document.getElementById('modal');
    
    // Cerrar el modal cuando se hace clic fuera de él
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        }
    });
    
    if (addProductoBtn) {
        addProductoBtn.addEventListener('click', () => {
            const modalContent = document.getElementById('modalContent');
            
            modalContent.innerHTML = `
                <h3>Nuevo Producto</h3>
                <form id="addProductoForm">
                    <div class="form-group">
                        <label for="nombre_producto">Nombre:</label>
                        <input type="text" id="nombre_producto" name="nombre_producto" required>
                    </div>
                    <div class="form-group">
                        <label for="descripcion">Descripción:</label>
                        <textarea id="descripcion" name="descripcion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="precio">Precio:</label>
                        <input type="number" id="precio" name="precio" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="id_categoria">Categoría:</label>
                        <select id="id_categoria" name="id_categoria" required>
                            <option value="">Seleccione una categoría</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="imagen">Imagen:</label>
                        <input type="file" id="imagen" name="imagen" accept="image/*">
                    </div>
                    <button type="submit">Crear Producto</button>
                </form>
            `;

            modal.classList.remove('hidden');
            modal.classList.add('show');

            // Cargar categorías en el select
            categorias.getAll().then(cats => {
                const select = document.getElementById('id_categoria');
                cats.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id_categoria;
                    option.textContent = cat.nombre_categoria;
                    select.appendChild(option);
                });
            }).catch(error => {
                console.error('Error al cargar categorías:', error);
                alert('Error al cargar las categorías');
            });

            document.getElementById('addProductoForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    nombre_producto: document.getElementById('nombre_producto').value,
                    descripcion: document.getElementById('descripcion').value,
                    precio: document.getElementById('precio').value,
                    id_categoria: document.getElementById('id_categoria').value,
                    imagen: document.getElementById('imagen').files[0]
                };
                
                try {
                    await productos.create(formData);
                    modal.classList.add('hidden');
                    productos.loadProductos();
                } catch (error) {
                    alert(error.message);
                }
            });
        });
    }
}); 