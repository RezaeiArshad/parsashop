import './lobby.css';
import data from '../../assets/data';
import { Link } from 'react-router-dom';

function Lobby() {
    return <>
    <p>we are at the lobby</p>
     <div className='products'>
        {
          data.products.map(product => 
          <div className='product' key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />              
            </Link>
            <p>
              {product.name}
            </p>
            <p>
              {product.price}
            </p>
          </div>)
        }
     </div>
    </>
}

export default Lobby