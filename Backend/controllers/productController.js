// import { v2 as cloudinary } from "cloudinary"

// //function for add product

// const addProduct = async (req, res) => {
//     try {

//         const {name, description, price, category, subCategory, sizes, bestseller} = req.body

//         const image1 = req.files.image1 && req.files.image1[0]
//         const image2 = req.files.image2 && req.files.image2[0]
//         const image3 = req.files.image1 && req.files.image3[0]
//         const image4 = req.files.image4 && req.files.image4[0]

//         const images = [image1,image2,image3,image4].filter((item)=> item !== undefined)

//         let imagesUrl = await Promise.all(
//             images.map(async (item) => {
//                 let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
//                 return result.secure_url
//             })
//         )

//         console.log(name, description, price, category, subCategory, sizes, bestseller)
//         console.log(imagesUrl)

//         res.json({name, description, price, category, subCategory, sizes, bestseller})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:error.message})
//     }
// }
// imagesUrl

// //function for list product
// const listProducts = async (req, res) => {

// }

// //function for remove product
// const removeProduct = async (req, res) => {

// }

// //function for single product info
// const singleProduct = async (req, res) => {

// }

// export { listProducts, addProduct, removeProduct, singleProduct }

import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const images = [
      req.files.image1,
      req.files.image2,
      req.files.image3,
      req.files.image4,
    ]
      .map((image) => image && image[0])
      .filter((image) => image);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const newProduct = await productModel.create({
      name,
      description,
      price,
      images: imagesUrl,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller,
    });

    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
