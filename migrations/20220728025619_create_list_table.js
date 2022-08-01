/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("Users", (table) => {
      table.increments("userId").primary();
      table.string("name").notNullable();
      table.string("userName").unique().notNullable();
      table.string("password").notNullable();
    })
    .createTable("Listings", (table) => {
      table.increments("listingID").primary();
      table.string("price").notNullable();
      table
        .integer("userId")
        .unsigned()
        .notNullable()
        .references("userId")
        .inTable("Users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("size").nullable();
      table.string("listingAddress").notNullable();
      table.string("listingBedrooms").notNullable();
      table.string("listingBathrooms").notNullable();
      table.string("listingCity").notNullable();
      table.string("listingDescription").nullable();
    })
    .createTable("Images", (table) => {
      table.increments("id").primary();
      table.string("listingImageID").notNullable();
      table.string("listingImagePath").notNullable();
    })
    .createTable("Favourites", (table) => {
      table.increments("id").primary();
      table
        .integer("listingID")
        .unsigned()
        .notNullable()
        .references("listingID")
        .inTable("Listings")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("userID").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("Users")
    .dropTable("Listings")
    .dropTable("Images")
    .dropTable("Favourites");
};
