import { Link } from 'react-router-dom';
import Rating from './rating';
import { motion } from 'motion/react';
import PriceComma from '../hooks/pricecomma';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../store';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry . Product is out of stock');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  return (
    <>
      <Link to={`/product/${product.slug}`}>
        <img className="w-4/5" src={product.image} alt={product.name} />
      </Link>
      <Link to={`/product/${product.slug}`}>
        <p>{product.name}</p>
      </Link>
      <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
      <p>
        <PriceComma value={product.price} /> Toman
      </p>
      {product.countInStock === 0 ? (
        <button className='bg-fg2 h-[9%] p-3 rounded-xl flex-center mt-2' disabled>
          Out of stock
        </button>
      ) : (
        <motion.button
          initial={{ backgroundColor: '#16A34A' }}
          whileHover={{ backgroundColor: '#DC2626' }}
          whileTap={{ backgroundColor: '#FF0000' }}
          transition={{ duration: 0.2 }}
          className="mt-2 p-3 h-[9%] flex-center rounded-xl"
          onClick={() => addToCartHandler(product)}
        >
          add to cart
        </motion.button>
      )}
    </>
  );
}

export default Product;
