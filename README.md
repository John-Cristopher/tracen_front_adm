# Tracen Academy - Admin Dashboard (Staff)

![Status](https://img.shields.io/badge/Status-Concluído-green)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Descrição:**
Este é o **Módulo Administrativo (Staff)** do Tracen Academy. Um sistema restrito para gestão acadêmica e controle de acesso, onde a equipe da academia gerencia matrículas, analisa estatísticas e aplica bloqueios administrativos em tempo real.

## Índice
- [Funcionalidades Administrativas](#funcionalidades-administrativas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Segurança](#segurança)
- [Testes](#testes)
- [Autores](#autores)

## Funcionalidades Administrativas
- **Gestão de Alunos:** Visualização completa da base de dados através de tabelas dinâmicas.
- **Controle de Status:** Funcionalidade para bloquear, desbloquear ou editar informações de alunos instantaneamente.
- **Dashboard de Estatísticas:** Cards informativos com contagem de alunos ativos, bloqueados e em observação.
- **Sistema de Busca:** Filtro inteligente por nome ou CPF para localização rápida de cadastros.

## Tecnologias Utilizadas
- **Python:** Utilizado no ecossistema de processamento e integração da API.
- **Firebase:** Persistência de dados (Firestore) e serviços de autenticação para membros do Staff.
- **JavaScript & Tailwind CSS:** Painel administrativo dinâmico e organizado.

## Segurança
O sistema adota múltiplas camadas de proteção para garantir a integridade dos dados acadêmicos:

- **Firebase Security Rules:** Regras granulares que impedem o acesso a documentos por usuários não autorizados ou sem a flag de administrador.
- **Autenticação Robusta:** Integração com Firebase Auth para gerenciamento de sessões seguras.
- **Proteção de Dados (LGPD):** Mascaramento de dados sensíveis (como CPF) na interface e acesso restrito aos logs de auditoria.
- **Validação de API:** Toda integração via Python utiliza validação de tokens JWT para assegurar a identidade do Staff.

*Nota: Nunca armazene chaves de API (`serviceAccountKey.json`) no repositório.*

## 🧪 Testes

O projeto inclui uma **suite completa de testes** com documentação, testes automatizados e checklist interativo.

### 📋 Arquivos de Teste
- **[PLANO-DE-TESTES.md](./PLANO-DE-TESTES.md)** - Documentação completa de todos os testes (10 testes manuais + 2 validações de API)
- **[GUIA-DE-TESTES.md](./GUIA-DE-TESTES.md)** - Guia prático de como usar os testes automatizados
- **[test-checklist.html](./test-checklist.html)** - Checklist interativo visual com acompanhamento em tempo real
- **tests/** - Testes automatizados com Jest
  - `api-handler.test.js` - Testes de validação da API (Testes 2.x e 3.x)
  - `crud.test.js` - Testes do CRUD administrativo (Testes 1.x)
  - `setup.js` - Configuração de mocks globais

### 🚀 Executar Testes

**Instalar dependências:**
```bash
npm install
```

**Executar testes automatizados:**
```bash
npm test
```

**Testes em modo watch (atualiza com mudanças):**
```bash
npm run test:watch
```

**Ver cobertura de testes:**
```bash
npm run test:coverage
```

### 📊 Cobertura de Testes

| Módulo | Testes | Status |
|--------|--------|--------|
| **Frontend Admin (CRUD)** | 4 testes | ✅ Implementado |
| **Catraca (Acesso)** | 4 testes | ✅ Implementado |
| **API Backend** | 2 validações | ✅ Implementado |
| **Total** | **10 testes** | ✅ Completo |

### 📋 Testes Inclusos

**Seção 1: Frontend Administrativo (CRUD)**
- ✅ Teste 1.1: Cadastrando um Aluno (CREATE)
- ✅ Teste 1.2: Consultando Alunos (READ)
- ✅ Teste 1.3: Editando um Aluno (UPDATE)
- ✅ Teste 1.4: Excluindo um Aluno (DELETE)

**Seção 2: Tablet Catraca (Acesso)**
- ✅ Teste 2.1: CPF Com Status ATIVO (Liberação)
- ✅ Teste 2.2: CPF Com Status BLOQUEADO (Barramento)
- ✅ Teste 2.3: CPF Inexistente (Tratamento de Erro)
- ✅ Teste 2.4: Falha de Conexão (Resiliência)

**Seção 3: API Backend**
- ✅ Validação 3.1: JSON da Catraca
- ✅ Validação 3.2: Persistência no Firebase

## Autores
* **John** - *Desenvolvedor Front-end* - [GitHub](https://github.com/John-Cristopher)
* **Vinicius** - *Desenvolvedor Back-end* - [GitHub](https://github.com/ViniciusMarioziOliveira)