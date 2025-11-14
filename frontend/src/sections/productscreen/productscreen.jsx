import { useNavigate, useParams } from "react-router-dom";
import { useReducer, useEffect, useContext } from "react";
import axios from "axios";
import Rating from "../../components/rating";
import { usePageTitle } from "../../hooks/usepagetitle";
import LoadingBox from "../../components/loadingbox";
import MessageBox from "../../components/messagebox";
import { motion } from "motion/react";
import { getError } from "../../utils";
import { Store } from "../../store";
import PriceComma from "../../hooks/pricecomma";


const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, product: action.payload, loading: false};
    case 'FETCH_FAIL': 
      return {...state, loading: false, error: action.payload };
    default: 
    return state  
  }
}

function ProductScreen() {
    const navigate = useNavigate();
    const params = useParams();
    const { slug } = params;

      const [{loading, error, product}, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  })

  usePageTitle(
    loading ? "Loading..." :
    error ? "Product Not Found" :
    `${product.name} - Parsa Shop`
  )

  useEffect(() => {
      const fetchData = async () => {
        dispatch({type: 'FETCH_REQUEST'});
        try {
          const result = await axios.get(`/api/products/slug/${slug}`);
          dispatch({type:'FETCH_SUCCESS', payload: result.data});
        } catch(err) {
          dispatch({type:'FETCH_FAIL', payload: getError(err) });
        }
      }
      fetchData();
    }, [slug]);

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart} = state;
    const addToCartHandler = async() => {
      const existItem = cart.cartItems.find((x) => x._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;
      const { data } = await axios.get(`/api/products/${product._id}`);
      if (data.countInStock < quantity) {
        window.alert('Sorry . Product is out of stock');
        return
      }
      ctxDispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity},
      });
      navigate('/cart')
    }

    return (<>
    {
      loading ? (
        <LoadingBox />           
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) :
        <>
        <div className="w-[100%] ms-auto me-auto pt-5 md:flex md:px-3 md:gap-2 lg:w-[80%]">
          <img className="product-screen-product-image bg-red-400 
            w-100
            sm:w-90
            " src={product.image} alt={product.name} />
          <div className="product-details
            mt-3 px-2
            ">
            <h1 className="
              mt-10 text-3xl
            ">{product.name}</h1>
            <Rating rating={product.rating} numReviews={product.numReviews} />

            {/* this part is for phone sized screens*/}
            {product.countInStock ?
            <div className="right-0 left-0 bottom-0 fixed h-[10vh] border-t-2 border-solid p-2 flex justify-between align-center md:hidden">
              <h1 className="text-xl font-medium mt-[2%]">
                <PriceComma value={product.price} /> Toman
              </h1>
                <motion.button 
                  initial={{backgroundColor: '#16A34A'}}
                  whileHover={{ backgroundColor: "#DC2626"}}
                  whileTap={{backgroundColor: '#FF0000'}}
                  transition={{ duration: 0.2}}
                  onClick={addToCartHandler}
                  className="mt-2 mb-auto p-3 h-[65%] rounded-xl flex-center">add to cart
                </motion.button> 
              <button> amount</button>            
            </div> : 
            <div className="right-0 left-0 bottom-0 fixed h-[10vh] border-t-2 border-solid p-2 flex justify-between align-center md:hidden">
              <h1>not availible</h1>            
            </div>}
            {/*until here*/}

            <div className="flex gap-1.5 ms-[10%] w-[80%] align-center md:my-3 md:w-[90%] md:ms-[5%]">
              <span className="h-[1px] w-[100%] bg-[#C0C0C0] mt-auto mb-auto"></span>
              <h1 className="md:hidden">{product.brand}</h1>
            </div>
            <h1 className="text-fg2">
              Count In Stock {product.countInStock}
            </h1>
            <h1>
              {product.description}
            </h1>
          </div>

          {/* this one is for tablet sized screens or bigger*/}
          <div className="hidden md:block p-4 border-1 border-fg2 flex-1 rounded-2xl">
            {product.countInStock ? 
            <>
              <div className="flex justify-between">
                <h1 className="font-medium text-xl mt-[-3px]">seller</h1>
                <h1>{product.brand}</h1>              
              </div>
              <h1 className="mt-15"><PriceComma value={product.price} /> Toman</h1>
              <div className="flex justify-between">
                <motion.button 
                  initial={{backgroundColor: '#16A34A'}}
                  whileHover={{ backgroundColor: "#DC2626"}}
                  whileTap={{backgroundColor: '#FF0000'}}
                  onClick={addToCartHandler}
                  transition={{ duration: 0.2}}
                  className="mt-2 mb-auto p-3 h-[65%] rounded-xl">add to cart
                </motion.button> 
                <button> amount</button>                
              </div> 
            </>
            : 
            <>
              <h1>Not Available</h1>
            </>
            }
          </div>
          {/* until here */}

        </div>
        </>
    }
    </>)
}


export default ProductScreen;