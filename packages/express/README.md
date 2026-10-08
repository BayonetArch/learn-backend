# express
Learning how to use express for easier backend development.

# Key Points

- CORS middleware first,
- JSON parser middleware second,
- ROUTES
- Error handler middleware last

# Middleware for specific routes

`app.route('/path',middlewareFunction,(req,res) => {})`

- middlewareFunction must return or have signature of (req,res,next)


# Zod for middleware validation

- safeParse

