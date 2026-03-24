CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "Users" (
                                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                       login varchar(10) UNIQUE NOT NULL,
                                       email varchar(255) UNIQUE NOT NULL,
                                       "passwordHash" varchar(255) NOT NULL,
                                       "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "UserEmailConfirmations" (
                                                        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                        "userId" uuid NOT NULL,
                                                        code varchar(255) NOT NULL,
                                                        "isConfirmed" boolean DEFAULT false,
                                                        "expiresAt" timestamptz NOT NULL,
                                                        "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP,
                                                        CONSTRAINT fk_email_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Session" (
                                         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                         "userId" uuid NOT NULL,
                                         "deviceId" uuid NOT NULL,
                                         title varchar(255) NOT NULL,
                                         ip varchar(45) NOT NULL,
                                         "refreshTokenHash" varchar(255) NOT NULL,
                                         "isRevoked" boolean DEFAULT false,
                                         "lastActiveDate" timestamptz DEFAULT CURRENT_TIMESTAMP,
                                         "expiresAt" timestamptz NOT NULL,
                                         CONSTRAINT fk_session_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Blogs" (
                                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                       name varchar NOT NULL,
                                       description text NOT NULL,
                                       "websiteUrl" varchar NOT NULL,
                                       "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP,
                                       "isMembership" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "Posts" (
                                       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                       title varchar NOT NULL,
                                       "shortDescription" varchar NOT NULL,
                                       content text NOT NULL,
                                       "blogId" uuid NOT NULL,
                                       "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP,
                                       CONSTRAINT fk_posts_blog FOREIGN KEY ("blogId") REFERENCES "Blogs"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Comments" (
                                          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                          content text NOT NULL,
                                          "userId" uuid NOT NULL,
                                          "userLogin" text NOT NULL,
                                          "likesCount" int DEFAULT 0,
                                          "dislikesCount" int DEFAULT 0,
                                          "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
                                          "postId" uuid NOT NULL,
                                          CONSTRAINT fk_comments_post FOREIGN KEY ("postId") REFERENCES "Posts"(id) ON DELETE CASCADE
);

CREATE TYPE "like_status_enum" AS ENUM ('Like','Dislike','None');

CREATE TABLE IF NOT EXISTS "PostLikes" (
                                           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                           "postId" uuid NOT NULL,
                                           "userId" uuid NOT NULL,
                                           status "like_status_enum" NOT NULL,
                                           "addedAt" timestamptz DEFAULT CURRENT_TIMESTAMP,
                                           CONSTRAINT fk_postlikes_post FOREIGN KEY ("postId") REFERENCES "Posts"(id) ON DELETE CASCADE,
                                           CONSTRAINT fk_postlikes_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE,
                                           CONSTRAINT uq_postlikes UNIQUE ("postId","userId")
);

CREATE TABLE IF NOT EXISTS "CommentLikes" (
                                              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                              status "like_status_enum" NOT NULL,
                                              "commentId" uuid NOT NULL,
                                              "userId" uuid NOT NULL,
                                              CONSTRAINT fk_commentlikes_comment FOREIGN KEY ("commentId") REFERENCES "Comments"(id) ON DELETE CASCADE,
                                              CONSTRAINT fk_commentlikes_user FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE,
                                              CONSTRAINT uq_commentlikes UNIQUE ("commentId","userId")
);