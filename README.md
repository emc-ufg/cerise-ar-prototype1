# cerise-ar-prototype1

Esta API foi desenvolvida para facilitar o gerenciamento de equipamentos, incluindo a
inserção, listagem, obtenção de detalhes, atualização e exclusão de equipamentos, além do
gerenciamento de arquivos associados como imagens, modelos 3D e QR codes.

**Dados:** verificar o tópico "Arquivos" a seguir

**Porta:** 443 (HTTPS)

Para verificar se a API está em execução, digite na URL do navegador: **https://*'IP do servidor'*:porta**

### Como usar a API:
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

**3. Obtenção de Detalhes de Equipamento (‘/equipamentos/id’):**
* **Método: GET**
* **URL:** Substitua ***‘id’*** pelo ID do equipamento desejado.
* **Resposta:** Detalhes completos do equipamento solicitado em JSON, incluindo
nome, descrição, confiabilidade e caminhos para os arquivos associados
(imagem, modelo 3D e QR code).

**4. Atualização de Equipamento (‘/equipamentos/id’):**
* **Método: PUT**
* **URL:** Substitua ***‘id’*** pelo ID do equipamento que você deseja atualizar.
* **Corpo da Solicitação:** Similar à inserção, mas você pode incluir novos arquivos
para substituir os existentes.
* **Resposta:** Uma mensagem em JSON confirmando a atualização bem-sucedida
do equipamento.

**5. Exclusão de Equipamento (‘/equipamentos/id’):**
* **Método: DELETE**
* **URL:** Substitua ***‘id’*** pelo ID do equipamento que você deseja excluir.
* **Resposta:** Confirmação da exclusão do equipamento e a remoção de todos os
arquivos associados.

**6. Acesso a Arquivos Associados (‘/equipamentos/id/arquivos/tipo’):**
* **Método: GET**
* **URL:** Substitua ***‘id’*** pelo ID do equipamento e ***‘tipo’*** pelo tipo de arquivo
desejado (‘imagem’, ‘modelo3d’, ‘qrcode’).
* **Resposta:** O arquivo solicitado é servido para download ou visualização,
dependendo do tipo e das configurações do navegador.


### Arquivos
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
