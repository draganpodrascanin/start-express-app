# START EXPRESS APP

## Easy to use cli to bootstrap your node.js-express project.

### Options:

|           Language            |                 Database                 |
| :---------------------------: | :--------------------------------------: |
| Javascript :heavy_check_mark: |        MongoDb :heavy_check_mark:        |
| Typescript :heavy_check_mark: | SQL(default to mysql) :heavy_check_mark: |

**Authentication** - <br>
You can choose to have basic authentication finished at the start of the project. Only JWT authentication is available at the moment.

## Usage

Everything you need to do is install this package **globally**. <br>

```
npm i start-express-app -g
```

Then in your terminal you can run command

```
start-express-app myapp
```

_myapp - directory you want to start your project in._ <br>

You will be promped with these questions:

- Do you want DB in your project? (y/N):
- Please choose the language for your project:
  - Javascrypt
  - Typescrypt
- Please choose database for your project: (if you chose that you want one)
  - MongoDB
  - SQL (default to mysql)
- Do you want authentication setup? (y/N)
- Initialize a git repository? (y/N)
- Install npm packages? (y/N)

**And you're done!** <br>
_don't forget to change environment variables (and ormconfig.json if you have it) before you start coding_

## API endpoints

If you chose to have authentication setup at the start of the project, you will have some auth endpoints.

<br>

**POST /api/v1/users**

<br>

Sign up user. You should send: password, passwordConfirm, firstName, lastName and email.

```javascript
 {
   email: 'valid@email.com',
   password: 'password',
   passwordConfrim: 'password',
   firstName: 'John',
   lastName: 'Doe'
 }
```

<br>

**POST /api/v1/users/login**

<br>

Sign in user. You should send: valid password and valid email.
Response with jwt cookie and user

```javascript
 {
   email: 'valid@email.com',
   password: 'password'
 }
```

<br>

**POST /api/v1/users/logout**

<br>

Sign out user. No payload.
Responds with empty jwt cookie, effectively logging you out.

<br>

**POST /api/v1/users/forgotPassword**

<br>

Send email for reseting password. You should sand a valid email.
Responds with status 200 , and send email for your password reset.

```javascript
{
	email: 'valid@email.com';
}
```

<br>

**PATCH /api/v1/users/resetPassword/:token**

<br>

Reset users password. You should send new password and passwordConfirm.

```javascript
 {
   password: 'password',
   passwordConfrim: 'password',
 }
```

## ODMs/ORMs

|            |  MONGO   |    SQL    |
| :--------: | :------: | :-------: |
| Javascript | Mongoose | Sequelize |
| Typescript | Mongoose |  TypeORM  |

## Views

All views are rendered with PUG atm.
