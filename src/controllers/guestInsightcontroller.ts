// app.get("/products", async (req: Request, res: Response) => {
//   try {
//     const products: { id: number; name: string; price: number } =
//       await queryDatabase("SELECT * FROM product");
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// })