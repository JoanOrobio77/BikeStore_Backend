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
            for (let key in productoData) {
                formData.append(key, productoData[key]);
            }

            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
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
            const response = await fetch(`${API_URL}/productos/${id}`, {
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

    // Renderizar lista de productos
    renderList(productos) {
        const container = document.getElementById('productosList');
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${productos.map(producto => `
                        <tr>
                            <td>${producto.id_producto}</td>
                            <td>${producto.nombre}</td>
                            <td>${producto.descripcion}</td>
                            <td>${producto.precio}</td>
                            <td>${producto.stock}</td>
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
        const producto = await this.getById(id);
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modalContent');
        
        modalContent.innerHTML = `
            <h3>Editar Producto</h3>
            <form id="editProductoForm">
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" value="${producto.nombre}" required>
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripción:</label>
                    <textarea id="descripcion" required>${producto.descripcion}</textarea>
                </div>
                <div class="form-group">
                    <label for="precio">Precio:</label>
                    <input type="number" id="precio" value="${producto.precio}" required>
                </div>
                <div class="form-group">
                    <label for="imagen">Imagen:</label>
                    <input type="file" id="imagen">
                </div>
                <button type="submit">Guardar</button>
            </form>
        `;

        modal.classList.remove('hidden');
        
        document.getElementById('editProductoForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                nombre: document.getElementById('nombre').value,
                descripcion: document.getElementById('descripcion').value,
                precio: document.getElementById('precio').value,
                imagen: document.getElementById('imagen').files[0]
            };
            
            try {
                await this.update(id, formData);
                modal.classList.add('hidden');
                this.loadProductos();
            } catch (error) {
                alert(error.message);
            }
        });
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
    
    if (addProductoBtn) {
        addProductoBtn.addEventListener('click', () => {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modalContent');
            
            modalContent.innerHTML = `
                <h3>Nuevo Producto</h3>
                <form id="addProductoForm">
                    <div class="form-group">
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="nombre" required>
                    </div>
                    <div class="form-group">
                        <label for="descripcion">Descripción:</label>
                        <textarea id="descripcion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="precio">Precio:</label>
                        <input type="number" id="precio" required>
                    </div>
                    <div class="form-group">
                        <label for="imagen">Imagen:</label>
                        <input type="file" id="imagen" required>
                    </div>
                    <button type="submit">Crear</button>
                </form>
            `;

            modal.classList.remove('hidden');
            
            document.getElementById('addProductoForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    nombre: document.getElementById('nombre').value,
                    descripcion: document.getElementById('descripcion').value,
                    precio: document.getElementById('precio').value,
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