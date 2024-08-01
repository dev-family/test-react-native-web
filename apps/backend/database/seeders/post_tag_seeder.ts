import PostTag from '#models/post_tag'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await PostTag.createMany([{ value: 'Policies' }, { value: 'Social' }, { value: 'Gender' }])
  }
}
