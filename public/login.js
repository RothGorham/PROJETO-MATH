// Form switching functionality
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
});

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            button.classList.remove('fa-eye');
            button.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            button.classList.remove('fa-eye-slash');
            button.classList.add('fa-eye');
        }
    });
});

// CPF formatting
function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

['cpf-login', 'cpf-register'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', (e) => {
        e.target.value = formatCPF(e.target.value);
    });
});

// Form validation
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    
    let sum = 0;
    let remainder;
    
    if (cpf === '00000000000') return false;
    
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

function validatePassword(password) {
    return password.length >= 8;
}

function showError(input, message) {
    const inputGroup = input.parentElement;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error-color)';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.style.marginLeft = '15px';
    
    // Remove existing error message if any
    const existingError = inputGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    inputGroup.appendChild(errorDiv);
    input.classList.add('error');
    inputGroup.classList.add('form-error');
}

function removeError(input) {
    const inputGroup = input.parentElement;
    const errorDiv = inputGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('error');
    inputGroup.classList.remove('form-error');
}

// Form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cpf = document.getElementById('cpf-login');
    const password = document.getElementById('password-login');
    let isValid = true;

    if (!validateCPF(cpf.value)) {
        showError(cpf, 'CPF inválido');
        isValid = false;
    } else {
        removeError(cpf);
    }

    if (!validatePassword(password.value)) {
        showError(password, 'Senha deve ter no mínimo 8 caracteres');
        isValid = false;
    } else {
        removeError(password);
    }

    if (isValid) {
        loginForm.submit(); // Submit the form if valid
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name-register');
    const cpf = document.getElementById('cpf-register');
    const password = document.getElementById('password-register');
    const confirmPassword = document.getElementById('confirm-password');
    let isValid = true;

    if (name.value.length < 3) {
        showError(name, 'Nome deve ter no mínimo 3 caracteres');
        isValid = false;
    } else {
        removeError(name);
    }

    if (!validateCPF(cpf.value)) {
        showError(cpf, 'CPF inválido');
        isValid = false;
    } else {
        removeError(cpf);
    }

    if (!validatePassword(password.value)) {
        showError(password, 'Senha deve ter no mínimo 8 caracteres');
        isValid = false;
    } else {
        removeError(password);
    }

    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'As senhas não coincidem');
        isValid = false;
    } else {
        removeError(confirmPassword);
    }

    if (isValid) {
        registerForm.submit(); // Submit the form if valid
    }
});