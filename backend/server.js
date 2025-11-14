import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedroutes.js';
import productRouter from './routes/productroutes.js';
import userRouter from './routes/userroutes.js';
import orderRouter from './routes/orderroutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 MONGODB_URI used:', process.env.MONGODB_URI); // DEBUG
    process.exit(1); // Exit on failure during startup
  });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('/*path', (req, res) =>
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`serve at http://0.0.0.0:${port}`);
});
