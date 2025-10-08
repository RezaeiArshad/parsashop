import { Link } from "react-router-dom";
import Rating from "./rating";

function Product(props) {
    const {product} = props;
    return (
      <>
        <Link to={`/product/${product.slug}`}>
          <img className="w-4/5" src={product.image} alt={product.name} />              
        </Link>
        <Link to={`/product/${product.slug}`}>
          <p>
            {product.name}
          </p>        
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
        <p>
          {product.price}
        </p>  
        <button className="bg-orange-500 mb-2">add to cart</button>      
      </>      
    )
}

export default Product;

