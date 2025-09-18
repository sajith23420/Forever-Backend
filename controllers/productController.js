import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../models/productModel.js";

// function for product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;

            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory: subcategory,
            bestseller: bestseller === 'true',
            sizes: (() => {
                if (!sizes) return [];
                if (Array.isArray(sizes)) return sizes;
                if (typeof sizes === 'object') return sizes;
                if (typeof sizes === 'string') {
                    // try JSON.parse, fallback to replacing single quotes or splitting by comma
                    try {
                        return JSON.parse(sizes);
                    } catch (err) {
                        try {
                            return JSON.parse(sizes.replace(/'/g, '"'));
                        } catch (err2) {
                            return sizes.split(',').map(s => s.trim()).filter(Boolean);
                        }
                    }
                }
                return [];
            })(),
            image: imagesUrl,
            date: Date.now()

        }

        console.log(productData);

        const product = new ProductModel(productData);
        await product.save();

        res.json({ success: true, message: 'Product added successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// function for list product
const listProduct = async (req, res) => {

    try {
        const products = await ProductModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// function removing product
const removeProduct = async (req, res) => {
    try {
      
        await ProductModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: 'Product removed successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// function for single product info
const singleProduct = async (req, res) => {

    try {

        const { productId } = req.body;
        const product = await ProductModel.findById(productId);
        res.json({ success: true, product });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
        

}

export { addProduct, listProduct, removeProduct, singleProduct }; 