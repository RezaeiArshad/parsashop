import './lobby.css';
import data from '../assets/data';

function Lobby() {
    return <>
     <div className='products'>
        {
          data.products.map(product => 
          <div className='product' key={product.name}>
            <img src={product.image} alt={product.name} />
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