# Protótipo de Realidade Aumentada - CERISE

Este repositório contém a documentação do back-end do protótipo de um sistema de realidade aumentada para exibir informações em uma tela de celular/tablet dado a leitura de um marcador. Trata-se de um aplicativo Flask integrado com PostgreSQL, utilizando Docker para a containerização. Abaixo, você encontrará instruções detalhadas sobre como configurar, construir e executar o projeto.


* [Clonar repositório](#clonar_repositorio)
* [Estrutura da aplicação](#estrutura_aplicacao)
* [Explicação teórica da estrutura da aplicação](#teoria_estrutura)
* [Pré-requisitos](#pre_requisitos)
* [Como executar](#como_executar)
* [Teste a API](#teste_api)
* [Dados utilizados](#dados_utilizados)
* [Script de backup](#script_backup)


<a name="clonar_repositorio"></a>
## Clonar repositório

Para clonar um repositório siga os passos a seguir:

1. **Instale o Git**: Vá ao site oficial do Git e baixe o instalador para o seu sistema operacional, então execute o instalador. Você pode verificar a instalação através do seguinte comando no terminal:
```
git --version
```

2. **Clone o repositório**: 
```
git clone  `URL`
```

3. **Acesse o diretório do repositório clonado**:
Supondo a URL: `https://github.com/usuario/nome-do-repositorio.git`, digite:
```
cd nome-do-repositorio
```

<a name="estrutura_aplicacao"></a>
## Estrutura da aplicação

Esta aplicação inclui os seguintes arquivos e diretórios:

1. **`Dockerfile`**: Para construir a imagem contêiner Docker do aplicativo Flask.
2. **`docker-compose.yml`**: Para orquestrar o serviço Flask e o serviço PostgreSQL.
3. **`app.py`**: Um exemplo de aplicativo Flask simples.
4. **`Certificados HTTPS`**: Para fazer o redirecionamento HTTP para HTTPS.
5. **`Script de Backup`**: Para automatizar o processo de backup dos dados.

<a name="teoria_estrutura"></a>
## Explicação teórica da estrutura da aplicação
Foi utilizado o conceito de **conteinerização**, que permite empacotar um aplicativo e suas dependências em contêiners, garantindo a sua operação de forma consistente independente do ambiente de execução. Fazendo uso do **Docker**, uma ferramenta de conteinerização, todas as configurações e bibliotecas necessárias para a execução da aplicação foram definidas e construiu-se a imagem do contêiner, simplificando o gerenciamento delas. <br>

Além disso, para o desenvolvimento do back-end utilizou-se o micro framework **Flask**, que é conhecido pela sua simplicidade e flexibilidade. Apesar disso, levou-se um tempo razoável para aprendizado do funcionamento da ferramenta e conexão com as outras. Fez-se uso dos seguintes métodos: `post`, `get`, `put` e `delete`, para se fazer as ações: inserção de equipamento, listagem ou obtenção de detalhes dos equipamentos, atualização e exclusão de dados, respectivamente. <br>

Outra ferramenta usada foi o **PostgreSQL**, também conhecido somente como Postgres. Ele é um sistema de gerenciamento de banco de dados relacional utilizada para armazenamento de dados em conformidade com os padrões SQL. A sua capacidade de suportar uma ampla variedade de tipos de dados e operações complexas o tornam ideal para aplicações web e de análise de dados. Assim, os campos definidos para compor um equipamento foram: `nome` (string), `descrição` (string),`confiabilidade` (string), `imagem` (arquivo .png ou .jpg ou .jpeg), `objeto 3D` (arquivo .glb ou .gltf) e `QR code`. O QR code associado a cada equipamento foi gerado automaticamente após a inserção dele. Ao total foram inseridos no banco de dados 5 equipamentos, através da ferramenta de teste de aplicações **Insomnia**. <br>

Dessa forma, o Docker fez o gerenciamento tanto do serviço Flask quanto do PostgreSQL. <br>

Considerando questões de segurança do usuário propôs-se o **redirecionamento de HTTP para HTTPS** da aplicação. Isso é interessante pois, garante que todas as comunicações entre o usuário e o servidor sejam criptografadas, protegendo dados sensíveis como dados pessoais contra ataques de interceptação. Além disso, o uso de HTTPS melhora a credibilidade e a confiança do usuário na aplicação, uma vez que a maioria dos navegadores modernos sinaliza sites HTTP como "não seguros". <br>

Primeiramente obteve-se um certificado **Secure Sockets Layer (SSL)** através da ferramenta **OpenSSL**, que se fornece tais certificados para criação de canais criptografados entre servidores e navegadores gratuitamente. Para tal, preencheu-se um cadastro contendo dentre outras informações o endereço IP do servidor ativo para utilização do mesmo como domínio na web. Então dois arquivos foram gerados: um `certificado.crt` e uma chave privada `private.key`, que posteriormente foram inseridos na pasta do servidor em que estavam os outros códigos da aplicação. <br>

Após fazer isso, foi necessário ajustar alguns detalhes no código, tais como indicar a porta como sendo `443`, rodar a aplicação novamente e então, ao digitar o endereço IP em um navegador já constava não mais o HTTP, mas HTTPS no lugar, indicando o sucesso do redirecionamento. Apesar disso, por conta de ter sido obtido um certificado auto assinado gratuito e sem ser em uma autoridade de certificação, nos primeiros acessos foi necessário dar permissão para conseguir fazer o acesso, mas nas tentativas posteriores já se conseguiu acesso direto. <br>



<a name="pre_requisitos"></a>
## Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

<a name="como_executar"></a>
## Como Executar

### Passo 1: Construir a Imagem Docker

Construa a imagem Docker do seu aplicativo Flask com o comando:

```bash
docker-compose build
```

### Passo 2: Iniciar os Serviços

Inicie os serviços definidos no `docker-compose.yml` com o comando:

```bash
docker-compose up
```

O aplicativo estará acessível em `https://<IPpublico>:443`.

<a name="teste_api"></a>
## Teste a API

Utilize ferramentas como Postman ou Insomnia para testar as rotas da API.

Esta API foi desenvolvida para facilitar o gerenciamento de equipamentos, incluindo a inserção, listagem, obtenção de detalhes, atualização e exclusão de equipamentos, além do gerenciamento de arquivos associados como imagens, modelos 3D, strings e QR codes.

### 1. Inserção de Equipamento:

- **URL**: `https://<IPpublico>:443/equipamentos`
- **Método**: POST
- **Corpo da Solicitação**: Inclua os dados do equipamento no corpo da solicitação em formato `multipart/form-data`. Os campos obrigatórios e opcionais são:
    - `nome` (obrigatório): Nome do equipamento.
    - `descricao` (opcional): Descrição detalhada do equipamento.
    - `confiabilidade` (opcional): Nível de confiabilidade do equipamento.
    - `imagem` (opcional): Arquivo de imagem do equipamento. Deve ser um dos tipos permitidos: png, jpg ou jpeg.
    - `modelo3d` (opcional): Arquivo de modelo 3D do equipamento. Deve ser do tipo: glb ou gltf.
- **Resposta**: Um JSON contendo a mensagem de sucesso e o nome do equipamento inserido. Além disso, a API gera um QR code único para o equipamento, cujo caminho é armazenado junto ao registro do equipamento.

### 2. Listagem de Equipamentos:

- **URL**: `https://<IPpublico>:443/equipamentos`
- **Método**: GET
- **Resposta**: Uma lista em JSON de todos os equipamentos registrados na base de dados. Cada item na lista contém o ID e o nome do equipamento.

### 3. Obtenção de Detalhes de Equipamento:

- **URL**: `https://<IPpublico>:443/equipamentos/<id>`
- **Método**: GET
- **URL**: Substitua `<id>` pelo ID do equipamento desejado.
- **Resposta**: Detalhes completos do equipamento solicitado em JSON, incluindo nome, descrição, confiabilidade e caminhos para os arquivos associados (imagem, modelo 3D e QR code).

### 4. Atualização de Equipamento:

- **URL**: `https://<IPpublico>:443/equipamentos/<id>`
- **Método**: PUT
- **URL**: Substitua `<id>` pelo ID do equipamento que você deseja atualizar.
- **Corpo da Solicitação**: Similar à inserção, mas você pode incluir somente os campos com os novos arquivos para substituir os existentes.
- **Resposta**: Uma mensagem em JSON confirmando a atualização bem-sucedida do equipamento.

### 5. Exclusão de Equipamento:

- **URL**: `https://<IPpublico>:443/equipamentos/<id>`
- **Método**: DELETE
- **URL**: Substitua `<id>` pelo ID do equipamento que você deseja excluir.
- **Resposta**: Confirmação da exclusão do equipamento e a remoção de todos os arquivos associados.

### 6. Acesso a Arquivos Associados (`/equipamentos/<id>/arquivos/<tipo>`):

- **Método**: GET
- **URL**: Substitua `<id>` pelo ID do equipamento e `<tipo>` pelo tipo de arquivo desejado (`imagem`, `modelo3d`, `qrcode`).
- **Resposta**: O arquivo solicitado é servido para download ou visualização, dependendo do tipo e das configurações do navegador.

<a name="dados_utilizados"></a>
## Dados utilizados

A título de exemplificação seguem detalhes sobre os dados utilizados.

**Equipamento:**
* **Nome:** Impressora 3D
* **Descrição:** Impressora capaz de criar objetos tridimensionais a partir de um modelo digital.
* **Confiabilidade:** 8/10
* **Imagem:** [HEVO-2.PNG](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/HEVO-2.PNG)
* **Objeto 3D:** [hevo30 v60.gltf](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/hevo30%20v60.gltf)

**Equipamento:**
* **Nome:** Bateria Makita
* **Descrição:** Fonte de energia recarregável de alta eficiência, projetada para ferramentas elétricas sem fio.
* **Confiabilidade:** 9.2/10
* **Imagem:** [makita battery_1.JPG](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/makita%20battery_1.JPG)
* **Objeto 3D:** [makita battery.gltf](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/makita%20battery.gltf)

**Equipamento:**
* **Nome:** Polia de velocidade variável
* **Descrição:** Permite ajustar a velocidade de rotação de um eixo motorizado.
* **Confiabilidade:** 9/10
* **Imagem:** [Variable Speed Pulley 2.jpg](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/Variable%20Speed%20Pulley%202.jpg)
* **Objeto 3D:** [variable speed pulley.gltf](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/variable%20speed%20pulley.gltf)

**Equipamento:**
* **Nome:** Guindaste de ponte
* **Descrição:** Equipamento de elevação industrial capaz de levantar até 15 toneladas.
* **Confiabilidade:** 8.7/10
* **Imagem:** [Crane 15 Tons H11, 2M - Rendering.30.png](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/Crane%2015%20Tons%20H11%2C%202M%20-%20Rendering.30.png)
* **Objeto 3D:** [Crane 15 Tons H11 2M.gltf](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/Crane%2015%20Tons%20H11%202M.gltf)

**Equipamento:**
* **Nome:** Hotend
* **Descrição:** Componente de impressora 3D de alta performance que oferece extrusão precisa e eficiente de filamentos.
* **Confiabilidade:** 7/10
* **Imagem:** [E3Neo_Hotend_v1.jpg](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/E3Neo_Hotend_v1.jpg)
* **Objeto 3D:** [e3neo_hotend_v1.gltf](https://github.com/emc-ufg/cerise-ar-prototype1/blob/main/test/e3neo_hotend_v1.gltf)

<a name="script_backup"></a>
## Script de Backup

O script de backup (backup_postgres.sh) automatiza o processo de backup do banco de dados PostgreSQL e de uma pasta específica no sistema de arquivos. O script cria cópias de segurança e remove backups antigos com mais de 7 dias.

### Atualização de Caminhos e Nomes

No script de backup, é importante atualizar os caminhos e nomes das pastas e arquivos a serem backupados para refletir a configuração específica de cada máquina onde o script será executado. Certifique-se de ajustar as variáveis `FOLDER_TO_BACKUP`, `BACKUP_DIRECTORY` e outras, conforme necessário.

### Configuração do Crontab

Para automatizar a execução do script de backup, adicione uma entrada no `crontab`, ferramenta de agendamento de tarefas que permite aos usuários programarem a execução automática de comandos ou scripts em horários, datas ou intervalos de tempo específicos. Abra o crontab com o comando:

```bash
crontab -e
```

Adicione a linha abaixo para executar o script de backup diariamente às 2h da manhã:

```bash
0 2 * * * /bin/bash /caminho/para/o/script/backup.sh
```
