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

## Autores
* **John** - *Desenvolvedor Front-end* - [GitHub](https://github.com/John-Cristopher)
* **Vinicius** - *Desenvolvedor Back-end* - [GitHub](https://github.com/ViniciusMarioziOliveira)