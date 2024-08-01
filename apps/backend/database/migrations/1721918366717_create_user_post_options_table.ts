import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_post_options'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.unique(['user_id', 'post_id'])
      table
        .integer('option_id')
        .notNullable()
        .references('id')
        .inTable('post_options')
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
