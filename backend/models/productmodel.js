import mongoose from 'mongoose';

export const cats = {
  ماژول: {
    'ولتاژ ورودی': 'مثال: 12',
    'ولتاژ خروجی': 'مثال: 12',
    'جریان خارجی': 'مثال: 12',
    آمپر: 'مثال: 2',
    توان: 'مثال: 12',
  },
  سنسور: { 'not set': 'not set' },
  موتور: {
    دور: 'مثال: 200',
    گشتاور: 'مثال: 0.8',
    ولتاژ: 'مثال: 12',
    جریان: 'مثال: 2',
    آمپر: 'مثال: 2',
  },
  باتری: { آمپر: 'مثال: 2', ظرفیت: 'مثال: 1000', 'جریان تخلیه': 'مثال: 100' },
  شارژر: { 'ولتاژ خروجی': 'مثال: 12', آمپر: 'مثال: 2' },
  بالانسر: { 'not set': 'not set' },
  فن: { اندازه: 'مثال: 4' },
  'DIY کیت': { 'not set': 'not set' },
  'تجهیزات الکترونیک': { 'not set': 'not set' },
  پروژه: { 'not set': 'not set' },
};

const subsets = {
  ماژول: [
    'کاهنده',
    'افزاینده',
    'کاهنده و افزاینده',
    'تغذیه',
    'بخار سرد',
    'کنترل دور موتور',
    'درایور موتور',
    'استپر موتور',
    'شیلد CNC',
    'دیمر',
    'فست شارژ',
    'پاوربانک',
    'آمپلی فایر',
    'برد توسعه',
    'LED',
    'صفحه کلید',
  ],
  سنسور: [
    'اولتراسونیک',
    'ژیروسکوپ',
    'دود',
    'مادون قرمز',
    'فرستنده و گیرنده',
    'شتاب سنج',
    'متفرقه',
  ],
  موتور: [
    'موتور DC کوچک',
    'موتور 775',
    'موتور 550',
    'موتور با گیربکس',
    'موتور AC',
    'سرو موتور',
    'استپر موتور',
  ],
  باتری: [
    'لیتیوم یون',
    'لیتیوم پلیمر',
    'نیکل متال هیدرید',
    'نیکل کادمیوم',
    'غیر شارژی',
    'استوک',
  ],
  شارژر: [
    'آداپتور',
    'پاور سوِیچینگ',
    'پاور ماینر',
    'شارژر باتری های لیتیومی',
    'استوک',
  ],
  بالانسر: [
    'تک سل',
    'دو سل',
    'سه سل',
    'چهار سل',
    'پنج سل',
    'هفت سل',
    'پیچ گوشتی شارژی',
    'متفرقه',
  ],
  فن: ['فن', 'جت فن', 'فن استوک'],
  'DIY کیت': ['آمپلی فایر', 'تون و کنترل', 'متفرقه'],
  'تجهیزات الکترونیک': [
    'کف چین',
    'هویه',
    'سیم لحیم',
    'قلع کش',
    'سیم لخت کن',
    'ذره بین',
    'پایه هویه',
    'پاک کننده نوک هویه',
    'گیره برد',
    'متفرقه',
  ],
  پروژه: ['قیمت'],
};

export const CATEGORIES = Object.keys(cats);

// Helper to check if a category actually has filters
function hasRealFilters(category) {
  const def = cats[category];
  return (
    def && !(Object.keys(def).length === 1 && def['not set'] === 'not set')
  );
}

// Precompute allowed subsets & filter keys for validation
const allowedSubsets = {};
const filterKeysPerCategory = {};

for (const cat of CATEGORIES) {
  allowedSubsets[cat] = subsets[cat] || [];
  filterKeysPerCategory[cat] = hasRealFilters(cat)
    ? Object.keys(cats[cat]).filter((k) => k !== 'not set')
    : [];
}

// Custom validator for subset
function validateSubset(value, { category }) {
  const allowed = allowedSubsets[category] || [];
  return allowed.includes(value);
}

// Custom validator for filters
function validateFilters(filters, { category }) {
  if (!filters) return !hasRealFilters(category); // ok to be null/undefined if no filters

  if (!hasRealFilters(category)) {
    // Should not have filters at all
    return Object.keys(filters).length === 0;
  }

  const allowedKeys = filterKeysPerCategory[category];
  const givenKeys = Object.keys(filters);

  // Every given key must be allowed
  return givenKeys.every((key) => allowedKeys.includes(key));
}

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    subset: {
      type: String,
      reqiured: true,
      validate: {
        validator: function (v) {
          return validateSubset(v, { category: this.category });
        },
        message: (props) =>
          `${props.value} is not a valid subset for category ${this.category}`,
      },
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (f) {
          return validateFilters(f, { category: this.category });
        },
        message: 'Filters contain invalid or diallowed keys for this category',
      },
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
