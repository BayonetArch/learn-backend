# cors

A playground to learn CORS policy and OPTIONS headers


## Points to remember

- The CORS policy doesnot allow frontend to fetch data from other urls. 
- The server must respond with 'Access-Control-Allow-Origin: <url>' in the response header.
- For preflight requests(json,PATCH,DELETE), the server must respond with 'Access-Control-*: * in the response header of OPTIONS requests.
