
# Sistema de Agendamento - PHP Version

Esta é uma versão PHP do Sistema de Agendamento, projetada para rodar em um servidor Apache.

## Requisitos

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Servidor Apache
- PDO PHP Extension ativada

## Instalação

1. Clone ou baixe este repositório para o diretório raiz do seu servidor web
2. Crie um banco de dados MySQL chamado `portal`
3. Importe o arquivo `database.sql` para criar as tabelas e inserir dados de exemplo:
   ```
   mysql -u seu_usuario -p portal < database.sql
   ```
4. Edite as credenciais do banco de dados no arquivo `index.php` (função `connectDB()`) se necessário
5. Acesse o aplicativo pelo navegador (por exemplo, http://localhost/sistema-agendamento)

## Estrutura do Projeto

- `index.php` - Arquivo principal do aplicativo
- `css/styles.css` - Estilos CSS do aplicativo
- `js/scripts.js` - Funções JavaScript do aplicativo
- `database.sql` - Script SQL para criação do banco de dados e tabelas

## Funcionalidades

- Exibição de reuniões agendadas para o dia atual
- Filtro por unidade/localização
- Listagem de salas disponíveis
- Exibição de aniversariantes da semana atual
- Atualização automática do relógio

## Customização

Você pode personalizar este aplicativo editando:

- O arquivo `css/styles.css` para alterar estilos e cores
- As funções no arquivo `index.php` para modificar a lógica de negócio
- Os parâmetros de conexão com o banco de dados na função `connectDB()`

## Manutenção

Para adicionar novas reuniões ou aniversariantes, você pode:

1. Usar o script SQL para inserir diretamente no banco de dados
2. Criar uma interface administrativa (não incluída nesta versão)
3. Integrar com sistemas existentes através de APIs

## Compatibilidade

Este aplicativo foi projetado para funcionar em navegadores modernos e utiliza:

- Flexbox e Grid CSS para layout responsivo
- JavaScript vanilla para funcionalidades do cliente
- PHP PDO para conexões seguras com o banco de dados
