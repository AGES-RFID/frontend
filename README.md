# Frontend AGES RFID

### Tecnologias

- Typescript
- React
- TailwindCSS
- Bun

### Configuração inicial

Para iniciar a aplicação, você vai precisar instalar o [Bun](https://bun.sh/docs/installation).

Com o Bun configurado na sua máquina, instale as dependências do projeto:

```sh
bun install
```

Após instalar as dependências, copie o arquivo `.env.example` para `.env` e execute o projeto:

```sh
bun dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Organização do projeto

Todo o código fonte está na pasta `src`. Dentro dela, temos as seguintes pastas:

- `components`: Componentes reutilizáveis da aplicação, como botões, inputs, modais, etc.
- `routes`: Páginas da aplicação, cada arquivo representa uma rota. Rotas são registradas no arquivo `src/router.tsx`.
- `features`: Funcionalidades específicas da aplicação, como autenticação, gerenciamento de usuários, etc. Cada funcionalidade tem sua própria pasta, que pode conter componentes, hooks, serviços, etc. Mais sobre as features [aqui](src/features/README.md).
- `lib`, `config` e `utils`: Configuração de bibliotecas, arquivos de configuração e funções utilitárias, respectivamente.

### Testes

A aplicação possue testes unitários e de componentes. Eles ficam na mesma pasta dos arquivos que testam, com a extensão `.spec.ts` ou `.spec.tsx`. A nossa meta é manter uma cobertura de testes acima de 80%.

Para rodar os testes, utilize o comando:

```sh
bun test
# caso queira rodar os testes em modo watch, utilize:
bun test --watch
# para ver a cobertura dos testes, utilize:
bun test:cov
```

### Formatação e linting

O projeto utiliza o [BiomeJS](https://biomejs.dev/) para formatação e linting do código. Para garantir que o código esteja formatado corretamente e siga as regras de linting, utilize os seguintes comandos:

```sh
# para formatar o código:
bun format
# para rodar o linting:
bun lint
# para verificar os tipos, formatação e linting:
bun check
```

### Colaboração

O projeto está configurado para utilizar [Trunk Based Development](https://trunkbaseddevelopment.com/), o que significa que todos os desenvolvedores devem trabalhar na mesma branch principal (trunk) e criar branches curtas para desenvolvimento de features ou correção de bugs. As branches devem ser nomeadas seguindo o padrão `<tipo>/<numero da issue>-[descrição]`, similar ao [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Exemplos:

- `feat/12-add-login-page`
- `fix/34-fix-header-bug`
- `chore/56-update-dependencies`

Os commits devem seguir o padrão de mensagens do Conventional Commits, utilizando os tipos `feat`, `fix`, `chore`, entre outros. As mensagens de commit devem ser escritas em inglês e descrever o que foi feito. Exemplos de mensagens de commit:

- `feat: create login page boilerplate with form validation`
- `fix: resolve header bug that caused layout issues on mobile devices`
- `chore: update zod and ky versions`

Antes de realizar o commit ou fazer push de uma branch, temos alguns hooks configurados para manter a qualidade do código. No geral, o que os hooks fazem é garantir que o código esteja formatado corretamente, que os testes estejam passando e que as mensagens de commit sigam o padrão estabelecido. Se algum desses checks falhar, o commit ou push será bloqueado até que os problemas sejam resolvidos.
