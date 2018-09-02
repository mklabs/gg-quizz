# gg-quizz.now.sh

Le principe: Inspiré de https://opentdb.com, ce site vous propose de recenser
questions et réponses pour de futur Quizz (ou trivia game). Cette base de
données pourra ensuite être utilisée pour fournir du contenu à des bots
Discord, ou toute autre application.

L'idée est de bosser ensemble sur le contenu des questions / réponses, en
français, sur des thématique Jeux Vidéos (wow, ff14, etc.).

Merci à https://jeeves.bot/ pour l'inspiration et sa commande `!trivia`

Site web: http://localhost:3000/

## Installation

    npm install

Make sure to have latest nodejs (currently 10.x.x).

## Run locally

    npm start

    # Dev mode with nodemon
    npm run dev

Make sure to have a `./now.dev.json` with all required informations. It
replicates the usual `now.json` file. You need various IDs and client secret
from all these providers, in order for the authentification to work. You can
also choose to just implement and test one. Refer to http://www.passportjs.org/
documentation.

```json
{
  "name": "gg-quizz",
  "public": true,

  "env": {
    "port": "3000",
    "NODE_ENV": "production",

    "DB_NAME": "@db_name",
    "DB_USER": "@db_user",
    "DB_PASSWORD": "@db_password",
    "DB_HOST": "@db_host",

    "TWITTER_CLIENT_ID": "@twitter_client_id",
    "TWITTER_CLIENT_SECRET": "@twitter_client_secret",
    "TWITTER_CALLBACK_URL": "http://localhost:3000/auth/twitter/callback",

    "GOOGLE_CLIENT_ID": "@google_client_id",
    "GOOGLE_CLIENT_SECRET": "@google_client_secret",
    "GOOGLE_CALLBACK_URL": "http://localhost:3000/auth/google/callback",

    "FACEBOOK_CLIENT_ID": "@facebook_client_id",
    "FACEBOOK_CLIENT_SECRET": "@facebook_client_secret",
    "FACEBOOK_CALLBACK_URL": "http://localhost:3000/auth/facebook/callback",

    "BNET_ID": "@bnet_id",
    "BNET_SECRET": "@bnet_secret",
    "BNET_CALLBACK_URL": "http://localhost:3000/auth/bnet/callback"
  }
}
```
