if (!localStorage.getItem('staffToken')) window.location.replace('staff-login.html');

const elements = {
    btnLogout: document.getElementById('btnLogout'),
    btnAddStudent: document.getElementById('btnAddStudent'),
    modalAddStudent: document.getElementById('modalAddStudent'),
    btnCancelModal: document.getElementById('btnCancelModal'),
    addStudentForm: document.getElementById('addStudentForm'),
    searchInput: document.getElementById('searchInput'),
    successToast: document.getElementById('successToast'),
    toastMessage: document.getElementById('toastMessage'),
    staffName: document.getElementById('staffName'),
    studentTable: document.getElementById('studentTable'),
    statusFilter: document.getElementById('statusFilter')
};

let alunos = [];
let eventos = [];
let atividades = [];

async function inicializarDashboard() {
    const email = localStorage.getItem('staffUser') || '';
    elements.staffName.textContent = email.includes('diretor') ? 'Diretor' : (email.includes('instrutor') ? 'Instrutor' : 'Admin');

    try {
        alunos = await window.TracenAPI.obterAlunos();
        renderTable(alunos);
        updateStats();
    } catch (e) { showToast('Erro ao carregar dados'); }
}

function updateStats() {
    document.getElementById('totalAlunos').textContent = alunos.length;
    document.getElementById('totalAtivos').textContent = alunos.filter(a => !a.bloqueado).length;
    document.getElementById('totalBloqueados').textContent = alunos.filter(a => a.bloqueado).length;
}

function renderTable(list) {
    elements.studentTable.innerHTML = list.length ? list.map(aluno => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 font-semibold">${aluno.nome}</td>
            <td class="px-6 py-4">${aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</td>
            <td class="px-6 py-4 text-center">
                <span class="${aluno.bloqueado ? 'bg-rose-100 text-rose-tracen' : 'bg-green-100 text-green-700'} px-3 py-1 rounded-full text-xs font-bold">
                    ${aluno.bloqueado ? 'BLOQUEADO' : 'ATIVO'}
                </span>
            </td>
            <td class="px-6 py-4 text-center text-sm">${aluno.observacao || '-'}</td>
            <td class="px-6 py-4 text-center flex gap-2 justify-center">
                <button class="text-blue-600 font-bold" onclick="editarObservacao('${aluno.cpf}')">Obs</button>
                <button class="text-tracen font-bold" onclick="editarAluno('${aluno.cpf}')">Editar</button>
                <button class="${aluno.bloqueado ? 'text-green-600' : 'text-rose-tracen'} font-bold" onclick="toggleBloqueio('${aluno.cpf}')">
                    ${aluno.bloqueado ? 'Desbloquear' : 'Bloquear'}
                </button>
                <button class="text-red-600 font-bold" onclick="deletarAluno('${aluno.cpf}')">Deletar</button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="5" class="text-center py-8">Vazio</td></tr>';
}

window.toggleBloqueio = async (cpf) => {
    const aluno = alunos.find(a => a.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, ''));
    if (!aluno) return;
    try {
        await window.TracenAPI.atualizarAluno(aluno.cpf, { bloqueado: !aluno.bloqueado });
        aluno.bloqueado = !aluno.bloqueado;
        showToast('Status atualizado!');
        updateStats();
        renderTable(alunos);
    } catch (e) { showToast('Erro ao atualizar'); }
};

window.editarObservacao = async (cpf) => {
    const aluno = alunos.find(a => a.cpf === cpf);
    if (!aluno) return;
    const novaObs = prompt(`Observação para ${aluno.nome}:`, aluno.observacao || '');
    if (novaObs === null) return;
    try {
        await window.TracenAPI.atualizarAluno(cpf, { observacao: novaObs });
        aluno.observacao = novaObs;
        renderTable(alunos);
        showToast('Observação atualizada!');
    } catch (e) { showToast('Erro ao salvar observação'); }
};

window.deletarAluno = async (cpf) => {
    if (!confirm('Deseja realmente excluir?')) return;
    try {
        await window.TracenAPI.deletarAluno(cpf);
        alunos = alunos.filter(a => a.cpf !== cpf);
        renderTable(alunos);
        updateStats();
        showToast('Aluno removido');
    } catch (e) { showToast('Erro ao deletar'); }
};

window.editarAluno = (cpf) => {
    const aluno = alunos.find(a => a.cpf === cpf);
    const nomeInput = elements.addStudentForm.querySelector('input[type="text"]');
    const cpfInput = elements.addStudentForm.querySelector('input[placeholder="000.000.000-00"]');

    nomeInput.value = aluno.nome;
    cpfInput.value = aluno.cpf;
    cpfInput.disabled = true;
    document.getElementById('cpfOriginal').value = cpf;

    const btn = elements.addStudentForm.querySelector('button[type="submit"]');
    btn.textContent = 'Atualizar';
    btn.dataset.modo = 'editar';
    elements.modalAddStudent.classList.remove('hidden');
};

elements.addStudentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const modo = btn.dataset.modo;
    const nome = e.target.querySelector('input[type="text"]').value;
    const cpf = e.target.querySelector('input[placeholder="000.000.000-00"]').value.replace(/\D/g, '');

    btn.disabled = true;
    try {
        if (modo === 'editar') {
            await window.TracenAPI.atualizarAluno(cpf, { nome });
            const a = alunos.find(x => x.cpf === cpf);
            if (a) a.nome = nome;
        } else {
            await window.TracenAPI.criarAluno(cpf, nome);
            alunos.push({ cpf, nome, bloqueado: false });
        }
        elements.modalAddStudent.classList.add('hidden');
        renderTable(alunos);
        showToast('Sucesso!');
    } catch (err) { showToast(err.message); }
    finally { btn.disabled = false; btn.textContent = modo === 'editar' ? 'Atualizar' : 'Adicionar'; }
});

elements.btnLogout?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'staff-login.html';
});

elements.btnAddStudent?.addEventListener('click', () => {
    elements.addStudentForm.reset();
    elements.addStudentForm.querySelector('input[placeholder="000.000.000-00"]').disabled = false;
    const btn = elements.addStudentForm.querySelector('button[type="submit"]');
    btn.textContent = 'Adicionar';
    btn.dataset.modo = 'criar';
    elements.modalAddStudent.classList.remove('hidden');
});

elements.btnCancelModal?.addEventListener('click', () => elements.modalAddStudent.classList.add('hidden'));

// Funções de Eventos e Atividades (UI Estática)
window.adicionarEvento = () => {
    const nome = prompt('Nome do evento:');
    if (nome) {
        eventos.push({ nome, data: new Date().toLocaleDateString() });
        showToast('Evento adicionado!');
    }
};

window.adicionarAtividade = () => {
    const desc = prompt('Descrição da atividade:');
    if (desc) {
        atividades.unshift({ descricao: desc, tempo: 'Agora' });
        showToast('Atividade registrada!');
    }
};

elements.searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    renderTable(alunos.filter(a => a.nome.toLowerCase().includes(q) || a.cpf.includes(q)));
});

function showToast(msg) {
    elements.toastMessage.textContent = msg;
    elements.successToast.classList.remove('hidden', 'toast-exit');
    setTimeout(() => {
        elements.successToast.classList.add('toast-exit');
        setTimeout(() => elements.successToast.classList.add('hidden'), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', inicializarDashboard);