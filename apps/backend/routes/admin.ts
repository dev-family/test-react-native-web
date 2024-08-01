import router from '@adonisjs/core/services/router'

const PostTagsController = () => import('#controllers/admin/post_tags_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('', [PostTagsController, 'create'])
        router.get('', [PostTagsController, 'getAll'])
      })
      .prefix('tags')
  })
  .prefix('admin')
