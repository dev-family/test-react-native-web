import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/api/users_controller')
const PostTagsController = () => import('#controllers/admin/post_tags_controller')
const PostCommentsController = () => import('#controllers/api/post_comments_controller')
const PostLikesController = () => import('#controllers/api/post_likes_controller')
const AuthController = () => import('#controllers/api/auth_controller')
const PostsController = () => import('#controllers/api/posts_controller')

router
  .group(() => {
    router
      .group(() => {
        router.resource('posts', PostsController)
        router.post('posts/:postId/vote', [PostsController, 'vote'])
        router.get('tags', [PostTagsController, 'getAll'])
        router
          .group(() => {
            router.post('', [PostLikesController, 'addReaction'])
            router.delete('', [PostLikesController, 'removeReaction'])
          })
          .prefix('posts/:postId/like')

        router
          .group(() => {
            router.get('', [PostCommentsController, 'getCommentsByPostId'])
            router.post('', [PostCommentsController, 'leaveComment'])
            router.delete(':commentId', [PostCommentsController, 'removeComment'])
            router.post(':commentId', [PostCommentsController, 'replyComment'])
            router.get(':commentId', [PostCommentsController, 'getCommentReplies'])
          })
          .prefix('posts/:postId/comments')
      })
      .use([middleware.auth()])

    router
      .group(() => {
        router.post('login', [AuthController, 'login'])
        router.post('register', [AuthController, 'register'])
        router.post('social', [AuthController, 'social'])
        router.post('logout', [AuthController, 'logout']).use([middleware.auth()])
      })
      .prefix('auth')
    router
      .group(() => {
        router.get('', [UsersController, 'get'])
        router.patch('', [UsersController, 'edit'])
        router.delete('', [UsersController, 'delete'])
      })
      .prefix('user')
      .use([middleware.auth()])
  })
  .prefix('api')
