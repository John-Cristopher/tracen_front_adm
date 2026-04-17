/**
 * Tracen Academy - App Logic Controller
 */

const MOTIVATIONAL_PHRASES = [
    "Cada galope uma história! Dê o seu melhor na pista hoje!",
    "Você é capaz de alcançar grandes alturas! 🏇",
    "Coragem e determinação são suas melhores amigas!",
    "A pista espera por você! Vá em frente!",
    "Seu sucesso começa aqui! 💪",
    "Cada dia é uma nova oportunidade de brilhar!",
    "Você tem o que é preciso para vencer!"
];

const TracenApp = {
    // --- UTILITÁRIOS COMPARTILHADOS ---
    formatCPF: (value) => value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),

    showToast: (id, message, isError = false) => {
        const toast = document.getElementById(id);
        const msgEl = toast.querySelector('span');
        if (!toast || !msgEl) return;

        msgEl.textContent = message;
        toast.classList.remove('hidden', 'toast-exit');

        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 4000);
    },

    // --- LÓGICA: INDEX (Acesso Aluno) ---
    initIndex: () => {
        const cpfInput = document.getElementById('cpfInput');
        const btnSubmit = document.getElementById('btnSubmit');
        if (!cpfInput) return;

        const updateButton = () => {
            const cpf = cpfInput.value.replace(/\D/g, '');
            btnSubmit.disabled = cpf.length !== 11;
        };

        document.querySelectorAll('[data-num]').forEach(btn => {
            btn.addEventListener('click', () => {
                const current = cpfInput.value.replace(/\D/g, '');
                if (current.length < 11) {
                    cpfInput.value = TracenApp.formatCPF(current + btn.getAttribute('data-num'));
                    updateButton();
                }
            });
        });

        document.getElementById('btnClear')?.addEventListener('click', () => {
            cpfInput.value = '';
            updateButton();
        });

        document.getElementById('btnDelete')?.addEventListener('click', () => {
            const current = cpfInput.value.replace(/\D/g, '');
            cpfInput.value = TracenApp.formatCPF(current.slice(0, -1));
            updateButton();
        });

        btnSubmit?.addEventListener('click', async () => {
            const cpf = cpfInput.value.replace(/\D/g, '');
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Validando...';

            try {
                const res = await window.TracenAPI.validarAluno(cpf);
                if (res.válido && !res.bloqueado) {
                    localStorage.setItem('userCPF', cpf);
                    localStorage.setItem('userName', res.nome);
                    window.location.href = 'student-validation.html?valid=true';
                } else {
                    TracenApp.showToast('errorToast', res.erro || 'Acesso negado.');
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Confirmar Acesso';
                }
            } catch (e) {
                TracenApp.showToast('errorToast', 'Erro de conexão.');
                btnSubmit.disabled = false;
            }
        });
    },

    // --- LÓGICA: STUDENT VALIDATION ---
    initStudentValidation: () => {
        const params = new URLSearchParams(window.location.search);
        const isValid = params.get('valid') === 'true';
        const userCPF = localStorage.getItem('userCPF');
        const accessTimeEl = document.getElementById('accessTime');

        if (accessTimeEl) {
            const now = new Date();
            // Utiliza o locale string para um horário preciso (HH:mm:ss)
            accessTimeEl.textContent = now.toLocaleTimeString('pt-BR');
        }

        const startTimer = (id, target) => {
            let s = 5;
            const el = document.getElementById(id);
            const timer = setInterval(() => {
                if (--s <= 0) { clearInterval(timer); window.location.href = target; }
                if (el) el.textContent = s;
            }, 1000);
        };

        if (isValid && userCPF) {
            document.getElementById('validationCard')?.classList.remove('hidden');
            document.getElementById('timeoutBar')?.classList.add('timeout-bar-valid');
            startTimer('countdown', 'student-access.html');
        } else {
            document.getElementById('errorCard')?.classList.remove('hidden');
            document.getElementById('timeoutBar')?.classList.add('timeout-bar-invalid');
            startTimer('errorCountdown', 'index.html');
        }
    },

    // --- LÓGICA: STUDENT ACCESS (Catraca 20s) ---
    initStudentAccess: () => {
        const nameEl = document.getElementById('studentName');
        const dateEl = document.getElementById('currentDate');
        const phraseEl = document.getElementById('motivationalPhrase');
        const successCard = document.getElementById('successCard');
        const errorCard = document.getElementById('errorCard');

        const params = new URLSearchParams(window.location.search);
        const isError = params.get('error') === 'true';

        if (isError) {
            errorCard?.classList.remove('hidden');
            const errorCountdownEl = document.getElementById('errorCountdown');
            let s = 20;
            const timer = setInterval(() => {
                if (--s <= 0) { clearInterval(timer); window.location.href = 'index.html'; }
                if (errorCountdownEl) errorCountdownEl.textContent = s;
            }, 1000);
        } else {
            successCard?.classList.remove('hidden');
            if (nameEl) nameEl.textContent = localStorage.getItem('userName') || 'Aluno';
            if (dateEl) {
                const now = new Date();
                const dataRef = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
                dateEl.textContent = `${dataRef} às ${now.toLocaleTimeString('pt-BR')}`;
            }
            if (phraseEl) phraseEl.textContent = `"${MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)]}"`;

            const countdownEl = document.getElementById('countdown');
            let s = 20;
            const timer = setInterval(() => {
                if (--s <= 0) { clearInterval(timer); window.location.href = 'index.html'; }
                if (countdownEl) countdownEl.textContent = s;
            }, 1000);

            const cpf = localStorage.getItem('userCPF');
            if (cpf) window.TracenAPI.registrarAcesso(cpf).catch(console.error);
        }
    },

    // --- LÓGICA: STAFF LOGIN ---
    initStaffLogin: () => {
        const form = document.getElementById('staffForm');
        const passInput = document.getElementById('passwordInput');

        document.getElementById('togglePassword')?.addEventListener('click', () => {
            passInput.type = passInput.type === 'password' ? 'text' : 'password';
        });

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('emailInput').value;
            const btn = form.querySelector('button');
            btn.disabled = true;

            const res = await window.TracenAPI.validarStaff(email, passInput.value);
            if (res.válido) {
                localStorage.setItem('staffUser', email);
                window.location.href = 'staff-dashboard.html';
            } else {
                TracenApp.showToast('errorToast', 'Credenciais inválidas.');
                btn.disabled = false;
            }
        });
    },

    // --- LÓGICA: STAFF DASHBOARD ---
    initStaffDashboard: () => {
        const table = document.getElementById('studentTable');
        const staffName = document.getElementById('staffName');

        // Verificação de Autenticação
        if (!localStorage.getItem('staffToken')) {
            window.location.href = 'staff-login.html';
            return;
        }

        const render = async (filter = '') => {
            const alunos = await window.TracenAPI.obterAlunos();
            table.innerHTML = alunos
                .filter(a => a.nome.toLowerCase().includes(filter) || a.cpf.includes(filter))
                .map(a => `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 font-semibold">${a.nome}</td>
                        <td class="px-6 py-4">${TracenApp.formatCPF(a.cpf)}</td>
                        <td class="px-6 py-4 text-center">
                            <span class="${a.bloqueado ? 'bg-rose-100 text-rose-tracen' : 'bg-green-100 text-green-700'} px-3 py-1 rounded-full text-xs font-bold">
                                ${a.bloqueado ? 'BLOQUEADO' : 'ATIVO'}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <button class="text-tracen font-bold px-2">Editar</button>
                            <button class="${a.bloqueado ? 'text-green-600' : 'text-rose-tracen'} font-bold px-2" onclick="TracenApp.toggleStudent('${a.cpf}')">
                                ${a.bloqueado ? 'Desbloquear' : 'Bloquear'}
                            </button>
                        </td>
                    </tr>
                `).join('');
        };

        TracenApp.toggleStudent = async (cpf) => {
            // Simulação de toggle no dashboard
            TracenApp.showToast('successToast', 'Status do aluno atualizado!');
            render();
        };

        document.getElementById('searchInput')?.addEventListener('input', (e) => render(e.target.value.toLowerCase()));
        document.getElementById('btnLogout')?.addEventListener('click', () => {
            localStorage.removeItem('staffUser');
            window.location.href = 'staff-login.html';
        });

        // Modal logic
        const modal = document.getElementById('modalAddStudent');
        document.getElementById('btnAddStudent')?.addEventListener('click', () => modal.classList.remove('hidden'));
        document.getElementById('btnCancelModal')?.addEventListener('click', () => modal.classList.add('hidden'));

        // Lógica de salvamento do novo aluno
        document.getElementById('formAddStudent')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('modalNome').value;
            const cpf = document.getElementById('modalCpf').value.replace(/\D/g, '');
            const obs = document.getElementById('modalObs')?.value || '';

            try {
                await window.TracenAPI.criarAluno(cpf, nome, obs);
                TracenApp.showToast('successToast', 'Aluno cadastrado com sucesso!');
                modal.classList.add('hidden');
                render(); // Atualiza a tabela
            } catch (error) {
                // Exibe o erro de validação definido no api-handler
                TracenApp.showToast('errorToast', error.message, true);
            }
        });

        if (staffName) {
            const email = localStorage.getItem('staffUser') || '';
            staffName.textContent = email.split('@')[0].toUpperCase();
        }

        render();
    }
};

// Inicialização Automática por Rota (Detecta ID único no Body ou URL)
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        TracenApp.initIndex();
    } else if (path.includes('student-validation.html')) {
        TracenApp.initStudentValidation();
    } else if (path.includes('student-access.html')) {
        TracenApp.initStudentAccess();
    } else if (path.includes('staff-login.html')) {
        TracenApp.initStaffLogin();
    } else if (path.includes('staff-dashboard.html')) {
        TracenApp.initStaffDashboard();
    }
});

// Exportar para window para botões com 'onclick' (como no dashboard)
window.TracenApp = TracenApp;