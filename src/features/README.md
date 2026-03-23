# Features

Essa pasta contém os módulos de funcionalidades da aplicação. Cada módulo é responsável por uma funcionalidade específica, como autenticação, gerenciamento de usuários, carros, tags, etc. As features possuem uma estrutura padronizada com os seguintes arquivos e pastas:

- `components/`: Componentes específicos da feature, como formulários, listas, etc.
- `FeatureService.ts`: Serviço responsável por fazer as requisições à API relacionadas à feature.
- `hooks/`: Hooks personalizados relacionados à feature, como hooks para buscar dados, mutações, etc. Sempre um hook por arquivo.
- `dtos/`: Armazenam os esquemas de validação com Zod e os tipos relacionados à feature, como tipos de entidades, requisições e respostas da API.

Além desses, podem ser criadas pastas `utils/` para funções utilitárias específicas da feature, `types/` para tipos relacionados à feature, etc. O importante é manter uma organização clara e consistente dentro de cada feature.

Como exemplo, consulte a feature `users`.
