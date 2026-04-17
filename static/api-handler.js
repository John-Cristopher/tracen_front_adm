// API Handler para Tracen Academy
const API_BASE_URL = 'https://tracel-beta.vercel.app';

/**
 * Validar CPF do aluno
 * @param {string} cpf - CPF do aluno (sem formatação)
 * @returns {Promise<{válido: boolean, nome: string, bloqueado: boolean, erro?: string}>}
 */
async function validarAluno(cpf) {
    try {
        // Conectar com API
        const response = await fetch(`${API_BASE_URL}/alunos/${cpf}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return {
                válido: true,
                nome: data.nome || 'Aluno',
                bloqueado: data.bloqueado === true,
                cpf: cpf
            };
        } else if (response.status === 404) {
            return {
                válido: false,
                nome: '',
                bloqueado: false,
                erro: 'CPF não encontrado no cadastro'
            };
        } else {
            return {
                válido: false,
                nome: '',
                bloqueado: false,
                erro: 'Erro ao validar CPF'
            };
        }
    } catch (error) {
        console.error('Erro na validação:', error);
        throw error;
    }
}

/**
 * Validar staff (admin/diretor/instrutor)
 * @param {string} usuario - Usuário/Email do staff
 * @param {string} senha - Senha do staff
 * @returns {Promise<{válido: boolean, nome: string, token?: string, erro?: string}>}
 */
async function validarStaff(usuario, senha) {
    try {
        // Conectar com API
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario,
                senha: senha
            })
        });

        if (response.ok) {
            const data = await response.json();
            return {
                válido: true,
                nome: data.nome || 'Staff',
                token: data.token,
                usuario: usuario
            };
        } else {
            return {
                válido: false,
                nome: '',
                erro: 'Usuário ou senha inválidos'
            };
        }
    } catch (error) {
        console.error('Erro na autenticação:', error);
        throw error;
    }
}

/**
 * Registrar acesso na catraca
 * @param {string} cpf - CPF do aluno
 * @returns {Promise<{sucesso: boolean, mensagem: string}>}
 */
async function registrarAcesso(cpf) {
    try {
        const response = await fetch(`${API_BASE_URL}/catraca`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cpf: cpf
            })
        });

        if (response.ok) {
            return {
                sucesso: true,
                mensagem: 'Acesso registrado com sucesso'
            };
        } else {
            return {
                sucesso: false,
                mensagem: 'Erro ao registrar acesso'
            };
        }
    } catch (error) {
        console.error('Erro ao registrar acesso:', error);
        throw error;
    }
}

/**
 * Obter dados de alunos (para dashboard)
 * @returns {Promise<Array>}
 */
async function obterAlunos() {
    try {
        const response = await fetch(`${API_BASE_URL}/alunos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Erro ao obter lista de alunos');
        }
    } catch (error) {
        console.error('Erro ao obter alunos:', error);
        throw error;
    }
}

/**
 * Obter dados de um aluno específico
 * @param {string} cpf - CPF do aluno
 * @returns {Promise<Object>}
 */
async function obterAluno(cpf) {
    try {
        const response = await fetch(`${API_BASE_URL}/alunos/${cpf}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Aluno não encontrado');
        }
    } catch (error) {
        console.error('Erro ao obter aluno:', error);
        throw error;
    }
}

/**
 * Criar novo aluno
 * @param {string} cpf - CPF do aluno
 * @param {string} nome - Nome do aluno
 * @param {string} observacao - Observação (opcional)
 * @returns {Promise<Object>}
 */
async function criarAluno(cpf, nome, observacao = '') {
    try {
        // Validação de formato básico: CPF deve ter exatamente 11 dígitos numéricos
        if (cpf.length !== 11) {
            throw new Error('Segurança: O CPF deve conter exatamente 11 dígitos.');
        }

        // 1. Busca a lista atual para validação de integridade (Segurança de Negócio)
        const alunosExistentes = await obterAlunos();

        // Validação: Mesmo CPF não pode ter um nome diferente
        const conflitoCPF = alunosExistentes.find(a => a.cpf === cpf);
        if (conflitoCPF && conflitoCPF.nome.toLowerCase() !== nome.toLowerCase()) {
            throw new Error(`Segurança: O CPF ${cpf} já está vinculado ao aluno(a) ${conflitoCPF.nome}.`);
        }

        // Validação: Mesmo nome não pode ter um CPF diferente
        const conflitoNome = alunosExistentes.find(a => a.nome.toLowerCase() === nome.toLowerCase());
        if (conflitoNome && conflitoNome.cpf !== cpf) {
            throw new Error(`Segurança: O nome "${nome}" já está registrado com o CPF ${conflitoNome.cpf}.`);
        }

        const headers = {
            'Content-Type': 'application/json'
        };

        // Adicionar token se disponível
        const token = localStorage.getItem('staffToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/alunos`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                cpf: cpf,
                nome: nome,
                observacao: observacao
            })
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.text();
            console.error('Resposta da API:', response.status, errorData);
            throw new Error(`Erro ao criar aluno: ${response.status} - ${errorData}`);
        }
    } catch (error) {
        console.error('Erro ao criar aluno:', error);
        throw error;
    }
}

/**
 * Atualizar aluno
 * @param {string} cpf - CPF do aluno
 * @param {Object} dados - Dados a atualizar (nome, bloqueado, observacao, etc)
 * @returns {Promise<Object>}
 */
async function atualizarAluno(cpf, dados) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Adicionar token se disponível
        const token = localStorage.getItem('staffToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/alunos/${cpf}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorData = await response.text();
            console.error('Resposta da API:', response.status, errorData);
            throw new Error(`Erro ao atualizar aluno: ${response.status} - ${errorData}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        throw error;
    }
}

/**
 * Deletar aluno
 * @param {string} cpf - CPF do aluno
 * @returns {Promise<{sucesso: boolean}>}
 */
async function deletarAluno(cpf) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Adicionar token se disponível
        const token = localStorage.getItem('staffToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/alunos/${cpf}`, {
            method: 'DELETE',
            headers: headers
        });

        if (response.ok) {
            return { sucesso: true };
        } else {
            const errorData = await response.text();
            console.error('Resposta da API:', response.status, errorData);
            throw new Error(`Erro ao deletar aluno: ${response.status} - ${errorData}`);
        }
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        throw error;
    }
}

// Exportar funções para uso global
window.TracenAPI = {
    validarAluno,
    validarStaff,
    registrarAcesso,
    obterAlunos,
    obterAluno,
    criarAluno,
    atualizarAluno,
    deletarAluno
};
