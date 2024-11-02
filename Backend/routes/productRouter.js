// import express from 'express'
// import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js'
// import upload from '../middleware/multer.js';

// const productRouter = express.Router();

// productRouter.post('/add',addProduct);
// productRouter.post('/remove',removeProduct);
// productRouter.post('/single',singleProduct);
// productRouter.get('/list',listProducts)

// export default productRouter
import express from "express";
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",adminAuth,
  upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" },
  ]),
  addProduct
);
productRouter.post("/remove",adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProducts);


export default productRouter;
