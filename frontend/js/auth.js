import { isValidEmail, validatePassword, storage } from './utils.js';

class Auth {
    constructor() {
        this.apiUrl = '/api';
        this.token = storage.get('token');
        this.user = storage.get('user');
        this.initEventListeners();
    }

    initEventListeners() {
        // Registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegistration(e.target);
            });
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin(e.target);
            });
        }

        // Password validation
        const passwordInput = document.querySelector('input[name="password"]');
        if (passwordInput) {
            passwordInput.addEventListener('input', this.validatePasswordStrength);
        }

        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    async handleRegistration(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            category: formData.get('category'),
            institution: formData.get('institution')
        };

        // Validate inputs
        if (!this.validateRegistrationData(data)) {
            return;
        }

        try {
            this.showLoading(form);
            const response = await this.register(data);
            
            if (response.success) {
                this.showSuccess(form, 'Registration successful! Please check your email for verification.');
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 3000);
            } else {
                this.showError(form, response.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            this.showError(form, 'An error occurred. Please try again later.');
        } finally {
            this.hideLoading(form);
        }
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Validate inputs
        if (!this.validateLoginData(data)) {
            return;
        }

        try {
            this.showLoading(form);
            const response = await this.login(data);
            
            if (response.success) {
                this.setSession(response.token, response.user);
                this.showSuccess(form, 'Login successful!');
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1500);
            } else {
                this.showError(form, response.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            this.showError(form, 'An error occurred. Please try again later.');
        } finally {
            this.hideLoading(form);
        }
    }

    handleLogout() {
        this.clearSession();
        window.location.href = '/';
    }

    validatePasswordStrength(e) {
        const password = e.target.value;
        const result = validatePassword(password);
        const strengthIndicator = document.querySelector('.password-strength');
        
        if (strengthIndicator) {
            strengthIndicator.innerHTML = `
                <div class="strength-item ${result.errors.length ? 'error' : 'valid'}">
                    <i class="fas fa-${result.errors.length ? 'times' : 'check'}"></i>
                    At least 8 characters
                </div>
                <div class="strength-item ${result.errors.upperCase ? 'error' : 'valid'}">
                    <i class="fas fa-${result.errors.upperCase ? 'times' : 'check'}"></i>
                    Uppercase letter
                </div>
                <div class="strength-item ${result.errors.lowerCase ? 'error' : 'valid'}">
                    <i class="fas fa-${result.errors.lowerCase ? 'times' : 'check'}"></i>
                    Lowercase letter
                </div>
                <div class="strength-item ${result.errors.number ? 'error' : 'valid'}">
                    <i class="fas fa-${result.errors.number ? 'times' : 'check'}"></i>
                    Number
                </div>
                <div class="strength-item ${result.errors.specialChar ? 'error' : 'valid'}">
                    <i class="fas fa-${result.errors.specialChar ? 'times' : 'check'}"></i>
                    Special character
                </div>
            `;
        }
    }

    validateRegistrationData(data) {
        if (!data.name || !data.email || !data.password || !data.confirmPassword || !data.category || !data.institution) {
            this.showError(null, 'All fields are required');
            return false;
        }

        if (!isValidEmail(data.email)) {
            this.showError(null, 'Please enter a valid email address');
            return false;
        }

        if (data.password !== data.confirmPassword) {
            this.showError(null, 'Passwords do not match');
            return false;
        }

        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.isValid) {
            this.showError(null, 'Password does not meet requirements');
            return false;
        }

        return true;
    }

    validateLoginData(data) {
        if (!data.email || !data.password) {
            this.showError(null, 'Email and password are required');
            return false;
        }

        if (!isValidEmail(data.email)) {
            this.showError(null, 'Please enter a valid email address');
            return false;
        }

        return true;
    }

    async register(data) {
        const response = await fetch(`${this.apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async login(data) {
        const response = await fetch(`${this.apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    setSession(token, user) {
        this.token = token;
        this.user = user;
        storage.set('token', token);
        storage.set('user', user);
    }

    clearSession() {
        this.token = null;
        this.user = null;
        storage.remove('token');
        storage.remove('user');
    }

    isAuthenticated() {
        return !!this.token;
    }

    showLoading(form) {
        const button = form?.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.innerHTML = '<div class="loading"></div>';
        }
    }

    hideLoading(form) {
        const button = form?.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = button.getAttribute('data-text') || 'Submit';
        }
    }

    showSuccess(form, message) {
        const messageElement = form?.querySelector('.form-message') || 
                             document.createElement('div');
        messageElement.className = 'form-message success';
        messageElement.textContent = message;
        
        if (!form?.querySelector('.form-message')) {
            form?.appendChild(messageElement);
        }
    }

    showError(form, message) {
        const messageElement = form?.querySelector('.form-message') || 
                             document.createElement('div');
        messageElement.className = 'form-message error';
        messageElement.textContent = message;
        
        if (!form?.querySelector('.form-message')) {
            form?.appendChild(messageElement);
        }
    }
}

// Initialize auth
const auth = new Auth();
export default auth;