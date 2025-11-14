import './lobby.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useReducer } from 'react';
import Product from '../../components/product';
import { usePageTitle } from '../../hooks/usepagetitle';
import LoadingBox from '../../components/loadingbox';
import MessageBox from '../../components/messagebox';


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

  usePageTitle("Parsa Shop");

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
      <p className='text-4xl ms-8 my-8'>we are at the lobby</p>
        <div className='products'>
        { loading ? (
        <LoadingBox />           
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) :
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {products.map(product => 
            <div className='product p-3' key={product.slug}>
             <Product product={product}></Product>
            </div>)}  
        </div>
        }
        </div>      
    </>
}

export default Lobby