# fastapiapp
## creating fast api application 


# CRUD operations
-create
-Read
-Update
-Delete

# Rest API
-GET
-POST
-PUT
-DELETE


# status code
-200 OK
-201 created
-204 No content
-400 Bad request
-402 Unauthorized
-403 Forbidden
-404 Not found 
-405 Method Not Allowed 
-409 conflict
-500 Internal server error




## modules
-sqlalchemy-orm(obj relational mapping )
-fastapi-- web framework
-uvicorn-- server for runniing fastapi
-application--
  ```bash
  cd backend
  uvicorn app.main:app --reload
  ```
-psycopg2 -- postgresql driver
-pydantics -- data validation
-typing extensions-- type hints

## concepts:
 ---orm (object relational mapping)-- to convert python code t0 sql commands without writing sql commands
 -----depends
    -- dependency injection-- to inject dependencies into route handlers
    
-------sessionmaker
            - to create a session with the database for a single request
    --declarative base 
            -to create a base class for all the models

    --session local 
            to create 



```bash
cd backend
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "initial migration"
alembic upgrade head
```
ybs-cfhr-hwp


npm install axios 
ui > axios > localhost:8000 (api call) > fastapi (python )> db > useeffect > setstate >rerender> ui

useeffect-->  which is used to call the api or which is used to fetch the data from the api automatically when the page is loaded 

useState --> which is used to store the data in the component and which will update the componen when the data is  updated or changed 



    
    
#hashing algorithm
argon2
bcrypt

jwt tokens--> used to authenticate and authorize users 
its in the format xxxx.yyyy.zzzzz basically 3 parts
1.header -> algo + token type : { alg:HS256 , type:JWT }
2.payload ->data, for eg:{user_id: 1, role:admin}
3.signature -> used to verify the token :{hash(header+ payload+ secretkey) }

access token  -> used to access protected resources
refresh token -> used to refresh access token

pip install python-multipart



#Architecture
backend/
  |--app/
      |--main.py
      |--models/
      |--schemas/
      |--routers/
      |--utils/
      |--database/
      


frontend/
    |--src/
        |--components/
        |--pages/
        |--services/
        |--utils/       


# run server
```bash
cd backend
uvicorn app.main:app --reload
```



with rag
user query->embed done by embeddings model->vector->semantic search done by qdra

