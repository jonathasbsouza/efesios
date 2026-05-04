---
description: Adicionar nova aula ao site de estudos em Efésios
---
Este workflow ajuda a processar links de slides, vídeos ou textos fornecidos pelo usuário para compor uma nova aula no site.

**Instruções de execução para o Agente:**
1. Leia a descrição ou os links/textos que o usuário enviou como material base.
2. Analise os arquivos atuais em `src/lessons/` para saber a última sequência utilizada (`order`), de modo a designar um número de ordem e nome de arquivo adequados.
3. Se o usuário fornecer um link de Google Slides, converta-o para a versão de embed, se necessário.
4. Crie ou atualize o respectivo arquivo `.md` em `src/lessons/`, preservando a estrutura de frontmatter:
   ```markdown
   ---
   title: '[Título da Aula]'
   order: [novo número]
   status: 'available'
   googleSlidesEmbedUrl: '[Link do Embed]'
   ---
   
   ## [Tópicos/Conteúdo Extraído]
   [Resumo do material ou links úteis]
   ```
5. Mantenha as aulas cadastradas como 'unavailable' intactas, a menos que esta nova aula substitua uma delas.
6. Após adicionar o arquivo, pergunte ao usuário se ele deseja testar a aplicação localmente (`npm run dev`).

**Como o usuário deve utilizar:**
1. Basta o usuário invocar `/adicionar_aula` ou mencionar o nome deste fluxo de trabalho anexando links/textos.
