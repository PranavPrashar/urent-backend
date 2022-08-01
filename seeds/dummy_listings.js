const dummyUsers = [
  {
    userID: 1,
    name: "user1",
    username: "user1@gmail.com",
    password: "password",
  },
  {
    userID: 2,
    name: "user2",
    username: "user2@gmail.com",
    password: "password",
  },
  {
    userID: 3,
    name: "user3",
    username: "user3@gmail.com",
    password: "password",
  },
];

const dummyListings = [
  {
    listingId: 84700614,
    price: "1600",
    userId: 1,
    size: "1200sqft",
    listingAddress: "123 Street",
    listingBedrooms: "2",
    listingBathrooms: "1",
    listingDescription:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    listingCity: "toronto",
  },
  {
    listingId: 84700615,
    price: "1600",
    userId: 2,
    size: "1200sqft",
    listingAddress: "123 Street number 2",
    listingBedrooms: "2",
    listingBathrooms: "1",
    listingDescription:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
    listingCity: "waterloo",
  },
  {
    listingId: 84700616,
    price: "1600",
    userId: 3,
    size: "1200sqft",
    listingAddress: "123 Street number 3",
    listingBedrooms: "2",
    listingBathrooms: "1",
    listingDescription:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ",
    listingCity: "waterloo",
  },
];

const dummyfavoriteListing = [
  { id: 1, listingID: 84700614, userID: "1" },
  { id: 2, listingID: 84700615, userID: "2" },
  { id: 3, listingID: 84700616, userID: "3" },
];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  return knex("Users")
    .del()
    .then(() => {
      return knex("Users").insert(dummyUsers);
    })
    .then(() => {
      return knex("Listings").del();
    })
    .then(() => {
      return knex("Listings").insert(dummyListings);
    })
    .then(() => {
      return knex("Favourites").del();
    })
    .then(() => {
      return knex("Favourites").insert(dummyfavoriteListing);
    });
};
