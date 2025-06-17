const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../index");

describe("API Endpoints", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it("should return welcome message on GET /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Hello from Express in WSL, Ezekiel!"
    );
  });

  it("should return empty array on GET /items", async () => {
    const res = await request(app).get("/items");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should create an item on POST /items", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "Test Item" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("name", "Test Item");
    expect(res.body).toHaveProperty("_id");
  });
});
