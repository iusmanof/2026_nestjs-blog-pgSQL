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
      get-blog-by-id.query-handler.ts
      get-blogs.query-handler.ts
    /use-cases
      create-blog.usecase.ts
      delete-blog.usecase.ts
      update-blog.usecase.ts
  /domain
    blogs.entity.ts
  /infra
    blogs.query-repository.ts
    blogs.repository.ts
/posts
/comments
/user-accounts

;