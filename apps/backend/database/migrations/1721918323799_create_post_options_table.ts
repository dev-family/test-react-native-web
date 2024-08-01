import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_options'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('option', 80).notNullable()
      table.integer('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
