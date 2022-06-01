# BE Barrio

This provides a simple small server to save and serve listings metadata to OrbitDB, as well as some bootstrap utils for launching and configuring the database. The idea behind using OrbitDB is that the project can eventually be upgraded to reward users for securing their own data (or perhaps data of other users), via tokens that are redeemable on the platform. For now, it acts as a simple skeleton database which can be replicated by others to secure the listings data.

In order to run the project, you'll need to set the following environment variables:

```
WEB3STORAGE_TOKEN - this is used to store and pin listing image data
ORBIT_AUTH - this is a secret password you can set to secure some protected endpoints (such as delete)
```

A utility script is provided for creating the database:

`node orbitdb/createDB.js`

Install dependencies

`npm install`

To start the development server:

`npm run nodemon`

# Deployment

At the root level, Barrio provides a `Procfile` and `package.json` to allow for deployment on Heroku. Once all changes are commit, this can be deployed via `git push heroku master`.
