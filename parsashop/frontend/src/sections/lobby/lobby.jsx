import './lobby.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useReducer } from 'react';
import Product from '../../components/product';


const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, products: action.payload, loading: false};
    case 'FETCH_FAIL': 
      return {...state, loading: false, error: action.payload };
    default: 
    return state  
  }
}

function Lobby() {
  const [{loading, error, products}, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  })

  useEffect(() => {
      const fetchData = async () => {
        dispatch({type: 'FETCH_REQUEST'});
        try {
          const result = await axios.get('/api/products');
          dispatch({type:'FETCH_SUCCESS', payload: result.data});
        } catch(err) {
          dispatch({type:'FETCH_FAIL', payload: err.message });
        }
      }
      fetchData();
    }, [])
    
    return <>
      <p>we are at the lobby</p>
        <div className='products'>
        {loading? 
          <div>loading</div> 
          :
          error? <div>{error}</div>
          :
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {products.map(product => 
              <div className='product p-3' key={product.slug}>
               <Product product={product}></Product>
              </div>)}  
          </div>
          }
        </div>
        <footer className='bg-red-800 text-white py-4 mt-50'>
            <p className='text-center'>
            all rights reserved
            </p>
        </footer>        
    </>
}

export default Lobby