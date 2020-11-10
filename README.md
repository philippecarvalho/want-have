# Want/Have

## Um editor de listas de Magic: The Gathering

O [Want/Have](https://want-have.herokuapp.com/) é um site para você criar e editar suas listas de cartas de Magic: The Gathering

[Exemplo de lista](https://want-have.herokuapp.com/list_show/5f96db33a6d02ee74fa021d8)

## Tecnologias utilizadas:
- Node.js
- Express
- Mongoose
- Passport
- NodeMailer
- EJS
- Node-fetch
- Multer
- Feito usando a api do incrível [Scryfall](https://scryfall.com/docs/api)

#### Próximas versões:
- Visualização em texto
- Download do txt da lista

## Instalação 

```
npm install
```
Também é preciso configurar as variáveis de ambiente que são usadas para o mailer e acesso do MongoDB.  
Crie um arquivo chamado .env e definas as variáveis:
- MONGOURI (sua url de acesso do mongodb)
- MAIL_USER (usuário de email para o mailer)
- MAIL_PASS (senha do email)
- SITE_URL (url do site a ser passada nos emails)