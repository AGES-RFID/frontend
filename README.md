# Frontend AGES RFID

Interface de usuário para o sistema de controle de acesso via RFID, desenvolvida com foco em performance e padronização.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)](https://biomejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## Índice
1. [Configuração do Ambiente](#1-configuração-do-ambiente)
2. [Desenvolvimento](#2-desenvolvimento)
3. [Comandos do Projeto](#3-comandos-do-projeto)
4. [Arquitetura e Estrutura](#4-arquitetura-e-estrutura)
5. [Testes Unitários](#5-testes-unitários)
6. [Git e Colaboração](#6-git-e-colaboração)

---

## 1. Configuração do Ambiente

O projeto utiliza o **Bun** como runtime e gerenciador de pacotes para garantir a máxima velocidade de execução e instalação.

### Instalação do Bun

- **Forma Recomendada:**
  Utilize o instalador oficial multiplataforma disponível em: [bun.com/get](https://bun.com/get).

- **Forma Manual (Scripts):**
  Guia oficial em [bun.com/docs/installation](https://bun.com/docs/installation):

  - **Linux / MacOS:**
    ```bash
    curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash
    ```
  - **Windows:**
    ```powershell
    powershell -c "irm bun.sh/install.ps1 | iex"
    ```

### Instalação das Dependências

1. Instale as dependências:
   ```bash
   bun install
   ```
2. Permissões de Hooks (Linux / MacOS):
   Para que as validações de commit funcionem, conceda permissão de execução à pasta do Husky:
   ```bash
   chmod -R +x .husky/
   ```

---

## 2. Desenvolvimento

O projeto utiliza variáveis de ambiente para a comunicação com o backend.

1. Configure o ambiente local:
   Copie o conteúdo de `.env.example` para um novo arquivo chamado `.env`.
2. Inicie o servidor de desenvolvimento:
   ```bash
   bun dev
   ```
3. A aplicação estará disponível em `http://localhost:3000`.

---

## 3. Comandos do Projeto

| Comando | Descrição |
| :--- | :--- |
| `bun dev` | Executa o servidor de desenvolvimento com Hot Reload. |
| `bun run build` | Compila os artefatos de produção para a pasta `/dist`. |
| `bun lint` | Executa linting. |
| `bun check` | Executa linting, formatação e verificação de tipos simultaneamente. |
| `bun check:fix` | Corrige os problemas de linting e formatação identificados. |
| `bun test` | Inicia a execução dos testes unitários. |
| `bun test:cov` | Gera o relatório de cobertura de testes (exige mínimo de 80%). |

---

## 4. Arquitetura e Estrutura

O design do sistema é modular, priorizando a separação de responsabilidades e a resiliência da interface.

- **Arquitetura de Estado:** Uso do **Zustand** para gerenciamento de estado global simplificado.
- **Roteamento:** Centralizado no `router.tsx` utilizando **React Router**.
- **Segurança e Estilo:** Estilização via **Tailwind CSS** com suporte a classes dinâmicas através do utilitário `cn` (`clsx` + `tailwind-merge`).
- **Resiliência:** Implementação de `ErrorBoundary` na raiz para evitar falhas críticas na renderização.

### Estrutura de Diretórios
- `src/api`: Serviços de integração e cliente HTTP.
- `src/components`: Componentes de UI (base) e componentes de negócio.
- `src/config`: Validação de variáveis de ambiente e configurações globais.
- `src/routes`: Definição das páginas e vistas da aplicação.
- `src/store`: Stores de estado global (Zustand).
- `src/types`: Definições globais de tipos e interfaces TypeScript.
- `src/utils`: Funções utilitárias e helpers.

---

## 5. Testes Unitários

A confiabilidade do código é validada através de testes unitários e de componentes.

### Documentação de Apoio
- **[Bun Test Runner](https://bun.sh/docs/test/usage):** Mocks e asserções nativas.
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/):** Testes de comportamento de componentes.
- **[Happy DOM](https://github.com/capricorn86/happy-dom):** Simulação de DOM para ambiente Bun.

### Exemplo de Teste
```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "bun:test";
import { Button } from "./index";

test("deve exibir o texto enviado via children", () => {
  render(<Button>Confirmar</Button>);
  expect(screen.getByText("Confirmar")).toBeInTheDocument();
});
```

---

## 6. Git e Colaboração

### Branching Model
Adotamos o **[Trunk Based Development](https://trunkbaseddevelopment.com/)**. Utilizamos **short-lived feature branches** integradas à `main` o mais rápido possível para garantir a integridade da pipeline de CI.

[![Trunk-Based Development](https://trunkbaseddevelopment.com/trunk1c.png)](https://trunkbaseddevelopment.com/)

### Convenções
- **Nomenclatura de Branches:** `<tipo>/<issue-id>-<descrição-curta>`
  - Exemplo: `feat/10-leitor-rfid-hook`
- **Mensagens de Commit:** Padrão **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)** em inglês.
  - Exemplo: `feat: implement rfid scanning logic`

### Git Hooks
Utilizamos o **Husky** para automação de regras locais:
1. **commit-msg:** Valida o padrão das mensagens de commit.
2. **pre-commit:** Executa o `bun check` (lint, format e tipos).
3. **pre-push:** Executa a suíte de testes unitários e valida o threshold de cobertura.

---
Desenvolvido para a disciplina de AGES - 2026.
