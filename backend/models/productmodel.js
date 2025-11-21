import mongoose from 'mongoose';

export const cats = {
  'ماژول': ['قیمت', 'نوع', 'ولتاژ', 'جریان', 'توان'],
  'سنسور': ['قیمت'],
  'موتور': ['قیمت'],
  'باتری': ['قیمت'],
  'شارژر': ['قیمت'],
  'بالانسر': ['قیمت'],
  'فن': ['قیمت'],
  'DIY کیت': ['قیمت'],
  'پروژه': ['قیمت'],
};

export const subsets = {
  'ماژول': ['قیمت', 'نوع', 'ولتاژ', 'جریان', 'توان'],
  'سنسور': ['قیمت'],
  'موتور': ['قیمت'],
  'باتری': ['قیمت'],
  'شارژر': ['قیمت'],
  'بالانسر': ['قیمت'],
  'فن': ['قیمت'],
  'DIY کیت': ['قیمت'],
  'پروژه': ['قیمت'],
}

export const CATEGORIES = Object.keys(cats)

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: {
        values: CATEGORIES,
      },
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
