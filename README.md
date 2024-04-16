# cerise-ar-prototype1

Esta API foi desenvolvida para facilitar o gerenciamento de equipamentos, incluindo a
inserção, listagem, obtenção de detalhes, atualização e exclusão de equipamentos, além do
gerenciamento de arquivos associados como imagens, modelos 3D e QR codes.

#### Data: [Images](https://drive.google.com/drive/folders/1RI561DtfMuxoE9ARRBbnHiNUJ4s0cxti?usp=sharing), [Strings](https://drive.google.com/drive/folders/1RI561DtfMuxoE9ARRBbnHiNUJ4s0cxti?usp=sharing), [3D Object](https://drive.google.com/drive/folders/1egfNI7pnUejouX9hE1qF6VAvNgENSjxh?usp=sharing)

#### Como usar a API:
**1. Inserção de Equipamento (‘/equipamentos’):**
* **Método: POST**
* **Corpo da Solicitação:** Inclua os dados do equipamento no corpo da solicitação
em formato ***“multipart/form-data”***. Os campos obrigatórios e opcionais são:
  * **‘nome’** (obrigatório): Nome do equipamento.
  * **‘descricao’** (opcional): Descrição detalhada do equipamento.
  * **‘confiabilidade’** (opcional): Nível de confiabilidade do equipamento.
  * **‘imagem’** (opcional): Arquivo de imagem do equipamento. Deve ser um
dos tipos permitidos (png, jpg, jpeg).
  * **‘modelo3d’** (opcional): Arquivo de modelo 3D do equipamento. Deve ser
do tipo (‘glb’, ‘gltf’).

* **Resposta:** Um JSON contendo a mensagem de sucesso e o nome do
equipamento inserido. Além disso, a API gera um QR code único para o
equipamento, cujo caminho é armazenado junto ao registro do equipamento.

**2. Listagem de Equipamentos (‘/equipamentos’):**
* **Método: GET**
* **Resposta:** Uma lista em JSON de todos os equipamentos registrados na base
de dados. Cada item na lista contém o ID e o nome do equipamento.

**3. Obtenção de Detalhes de Equipamento (‘/equipamentos/<id>’):**
* **Método: GET**
* **URL:** Substitua ***‘id’*** pelo ID do equipamento desejado.
* **Resposta:** Detalhes completos do equipamento solicitado em JSON, incluindo
nome, descrição, confiabilidade e caminhos para os arquivos associados
(imagem, modelo 3D e QR code).

**4. Atualização de Equipamento (‘/equipamentos/<id>’):**
* **Método: PUT**
* **URL:** Substitua ***‘id’*** pelo ID do equipamento que você deseja atualizar.
* **Corpo da Solicitação:** Similar à inserção, mas você pode incluir novos arquivos
para substituir os existentes.
* **Resposta:** Uma mensagem em JSON confirmando a atualização bem-sucedida
do equipamento.

**5. Exclusão de Equipamento (‘/equipamentos/<id>’):**
* **Método: DELETE**
* **URL:** Substitua ***‘id’*** pelo ID do equipamento que você deseja excluir.
* **Resposta:** Confirmação da exclusão do equipamento e a remoção de todos os
arquivos associados.

**6. Acesso a Arquivos Associados (‘/equipamentos/<id>/arquivos/<tipo>’):**
* **Método: GET**
* **URL:** Substitua ***‘id’*** pelo ID do equipamento e ‘tipo’ pelo tipo de arquivo
desejado (‘imagem’, ‘modelo3d’, ‘qrcode’).
* **Resposta:** O arquivo solicitado é servido para download ou visualização,
dependendo do tipo e das configurações do navegador.
