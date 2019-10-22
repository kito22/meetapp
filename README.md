# Meetapp

O Meetapp é um app agregador de eventos para desenvolvedores (um acrônimo à Meetup + App).

Esse repositório é referente ao Back-end da aplicação, e essa aplicação possuirá a versão do web e a mobile.

O backend foi desenvolvido utilizando Node.Js + Express, além de diversas bibliotecas, como Multer, Yup, Jwt, Date-Fns, também foi utilizado o Redis e o Postgres.

Algumas das funcionalidades são:

- Autenticação com JWT
- Validação de dados de entrada
- Upload de arquivos
- Adição de novos eventos
- verificação de dados para cadastro de eventos
- Inscrição de usuários em eventos que irão acontecer
- Envio de e-mail para o organizador do Meetup, sempre que houver uma nova inscrição

A versão Web, desenvolvida utilizando ReactJs pode ser encontrada no link a seguir:

https://github.com/kito22/meetapp-web
