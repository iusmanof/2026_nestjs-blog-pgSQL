# Nestjs app blog-platform

## js
## postgresSQL
## CQRS 
## DDD
## typescript


Файловая структура:
/blogs
  /api
    blogs.controller.ts
    blogs-public.controller.ts
  /application
    /queries
      get-device.query-handler.ts
      get-user-by-id.query-handler.ts
      get-users.query-handler.ts
    /use-cases
      /auth
        delete-all-devices
        delete-device
        logout
        new-password
        password-recovery
        refresh-session
        register-user
        registr-confirm
        registr-email
            
      /users  
        create-user.usecase.ts
        delete-user.usecase.ts

  /domain
    blogs.entity.ts
  /infra
    blogs.query-repository.ts
    blogs.repository.ts
/posts
/comments
/user-accounts

;