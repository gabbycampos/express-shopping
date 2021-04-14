process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let coffee = { name: "coffee"};

beforeEach(function() {
    items.push(coffee);
});

afterEach(function() {
    // mutates, not redefines 'items'
    items.length = 0;
});

// GET /items
describe("GET /items", function() {
    test("Gets a list of items", async function() {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual({items: [coffee]});
    })
})

// GET /items/[name]
describe("GET /items/:name", function() {
   test("Gets a single item", async function() {
       const resp = await request(app).get(`/items/${coffee.name}`);
       expect(resp.statusCode).toBe(200);
       expect(resp.body).toEqual({ item: coffee });
   });
   test("Responds with 404 if can't find item", async function() {
       const resp = await request(app).get(`/items/0`);
       expect(resp.statusCode).toBe(404);
   });
});

// POST /items
describe("POST /items", function() {
    test("Creates a new item", async function() {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "laptop"
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            item: { name: "laptop" }
        });
    });
});

// PATCH /items/[name]
describe("PATCH /items/:name", function() {
    test("Updates a single item", async function() {
      const resp = await request(app)
        .patch(`/items/${coffee.name}`)
        .send({
          name: "tequila"
        });
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        item: { name: "tequila" }
      });
    });
  
    test("Responds with 404 if id invalid", async function() {
      const resp = await request(app).patch(`/items/0`);
      expect(resp.statusCode).toBe(404);
    });
  });

  describe("DELETE /items/:name", function() {
    test("Deletes a single a item", async function() {
      const resp = await request(app).delete(`/items/${coffee.name}`);
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ message: "Deleted" });
    });
  });