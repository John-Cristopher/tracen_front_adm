const staffForm = document.getElementById('staffForm');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const errorToast = document.getElementById('errorToast');
const errorMessage = document.getElementById('errorMessage');

// Toggle Visibilidade Senha
togglePassword?.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
});

// Enviando formulário
staffForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    const btn = staffForm.querySelector('button');

    btn.disabled = true;
    btn.textContent = 'Validando...';

    try {
        const resultado = await window.TracenAPI.validarStaff(username, password);
        if (resultado.válido) {
            localStorage.setItem('staffUser', username);
            localStorage.setItem('staffToken', resultado.token);
            window.location.href = 'staff-dashboard.html';
        } else {
            showError(resultado.erro || 'Email ou senha inválidos.');
            passwordInput.value = '';
            btn.disabled = false;
            btn.textContent = 'Entrar';
        }
    } catch (error) {
        showError('Erro na autenticação. Tente novamente.');
        btn.disabled = false;
        btn.textContent = 'Entrar';
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorToast.classList.remove('hidden', 'toast-exit');
    errorToast.classList.add('toast-error');
    setTimeout(() => {
        errorToast.classList.add('toast-exit');
        setTimeout(() => errorToast.classList.add('hidden'), 300);
    }, 4000);
}