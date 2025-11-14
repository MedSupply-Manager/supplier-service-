const request = require("supertest");
const express = require("express");

// Mock the Cart sequelize model BEFORE loading the router
jest.mock("../src/models/cart", () => ({
  findAll: jest.fn(),
  create: jest.fn()
}));

const Cart = require("../src/models/cart");
const cartRouter = require("../src/routes/cartroutes");

const app = express();
app.use(express.json());
app.use("/cart", cartRouter);

describe("Cart Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------
  // GET /cart
  // -----------------------------
  it("GET /cart should return all cart items", async () => {
    const mockItems = [
      { id: 1, product_id: 10, quantity: 2 },
      { id: 2, product_id: 5, quantity: 1 }
    ];

    Cart.findAll.mockResolvedValue(mockItems);

    const res = await request(app).get("/cart");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockItems);
    expect(Cart.findAll).toHaveBeenCalledTimes(1);
  });

  // -----------------------------
  // POST /cart
  // -----------------------------
  it("POST /cart should create a new cart item", async () => {
    const mockCreated = { id: 1, product_id: 10, quantity: 3 };

    Cart.create.mockResolvedValue(mockCreated);

    const res = await request(app)
      .post("/cart")
      .send({ product_id: 10, quantity: 3 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mockCreated);

    expect(Cart.create).toHaveBeenCalledWith({
      product_id: 10,
      quantity: 3
    });
  });

  // -----------------------------
  // POST /cart Error Case
  // -----------------------------
  it("POST /cart should return 500 on error", async () => {
    Cart.create.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/cart")
      .send({ product_id: 10, quantity: 3 });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
