# billing-management
Build a small billing (or collection) management app.

## Description
The backend was developed in [Node](https://nodejs.org/) (v10.16.2), database in [MongoDB](https://www.mongodb.com) using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for management of database in cloud and the deployment of application was done in [Heroku](https://www.heroku.com).
Frontend application was developed in [React.js](https://reactjs.org).

## Deployed Application
- Main application: [Frontend](https://billing-management-frontend.herokuapp.com)
- [Backend](https://billing-management-backend.herokuapp.com)

## Installing

Clone the repository:

```git clone git@github.com:hi15/billing-management.git```

Change directory to the repository:

```cd billing-management/```

### Backend

You will need to run two applications, first backend:

```cd backend/```

Use [yarn](https://yarnpkg.com/en/docs/install) (Recommended) or [npm](https://www.npmjs.com/get-npm) to install the packages.

```yarn install```

Configure the file .env:
```cp .env.example .env```

Set the varibles in .env file:
```
MONGODB_URI=mongodb_url_database_billing
MONGODB_URI_TEST=mongo_url_database_billing-test
PORT=3333
NODE_ENV=development #default
MAIL_USER=usermail
MAIL_HOST=smtp.gmail.com
MAIL_PASS=password
MAIL_PORT=port
```

Now run application:
```yarn nodemon src/server.js```

### Frontend

You will need to run to applications, first in backend:

```cd backend/```

Use [yarn](https://yarnpkg.com/en/docs/install) (Recommended) or [npm](https://www.npmjs.com/get-npm) to install the packages.

```yarn install```

Configure the file .env:
```cp .env.example .env```

Set the varibles in .env file:
```
REACT_APP_API_URL=YOUR_BACKEND_URL
#Example
REACT_APP_API_URL=http://localhost:3333
```

Now run application:
```yarn start```


## Testing instructions
In the repository go to backend directory (after running the installing process):
```cd backend/```

Now run application tests with command :
```yarn test```

It will print the results of the test and the coverage of backend.
