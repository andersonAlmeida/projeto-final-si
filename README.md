## Importante

Necessário criar um arquivo nodemon.js na raiz do projeto com a seguinte config:

```
{
  "env": {
    "BOT_TOKEN": TOKEN_DO_TELEGRAM
  }
}
```

## Dialogflow

É necessário adicionar as variáveis de ambiente o arquivos com as credenciais de acesso ao serviço.
[DOC](https://cloud.google.com/docs/authentication/getting-started#windows)

```
GOOGLE_APPLICATION_CREDENTIALS = CAMINHO_PARA_O_ARQUIVO
```
