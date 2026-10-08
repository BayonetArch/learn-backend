- Use everytime for a new chunk 
  `chunks = Buffer.concat(chunks).toString();`
- Send the response only on req.on('end') for methods like POST,PUT i.e that have stream data 
- Handle the case where the request body only contains `null` by checking i.e `if (parsed === null)`
