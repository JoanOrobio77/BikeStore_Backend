// Funciones de autenticación
const auth = {
    // Login
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, contrasena: password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.nombre);
            return true;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Registro
    async register(nombre, telefono, email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    nombre, 
                    telefono, 
                    email, 
                    contrasena: password,
                    id_rol: 2 // Rol de usuario normal por defecto
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro');
            }

            return true;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.reload();
    },

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Obtener el token
    getToken() {
        return localStorage.getItem('token');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const userName = document.getElementById('userName');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');

    // Mostrar nombre de usuario si está autenticado
    if (auth.isAuthenticated()) {
        userName.textContent = localStorage.getItem('userName');
        loginSection.classList.add('hidden');
        registerSection.classList.add('hidden');
        document.querySelector('nav').classList.remove('hidden');
    }

    // Manejar login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await auth.login(email, password);
                window.location.reload();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Manejar registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('regNombre').value;
            const telefono = document.getElementById('regTelefono').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            try {
                await auth.register(nombre, telefono, email, password);
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                // Cambiar a la sección de login
                registerSection.classList.add('hidden');
                loginSection.classList.remove('hidden');
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Mostrar formulario de registro
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.classList.add('hidden');
            registerSection.classList.remove('hidden');
        });
    }

    // Mostrar formulario de login
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        });
    }

    // Manejar logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.logout();
        });
    }
}); 