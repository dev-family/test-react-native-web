import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_post_comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.integer('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.string('comment', 300).notNullable()
      table
        .integer('reply_id')
        .nullable()
        .references('id')
        .inTable(this.tableName)
        .onDelete('RESTRICT')
      table.timestamp('created_at')
      table.timestamp('deleted_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
