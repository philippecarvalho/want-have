![Want/Have](https://raw.githubusercontent.com/philippecarvalho/want-have/master/public/imgs/logo-body.png)


## Um editor de listas de Magic: The Gathering

O [Want/Have](http://phcarvalho.com.br/) é um site para você criar e editar suas listas de cartas de Magic: The Gathering

[Exemplo de lista](http://phcarvalho.com.br/list_show/5fabb5dba78920001bed6c5f)

![lista](https://i.imgur.com/LhoWogF.png)

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