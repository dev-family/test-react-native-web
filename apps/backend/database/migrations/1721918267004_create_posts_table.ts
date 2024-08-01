import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 100).notNullable()
      table.string('description', 200).nullable()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('tag_id')
        .nullable()
        .references('id')
        .inTable(this.tableName)
        .onDelete('RESTRICT')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
