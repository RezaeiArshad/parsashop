import { useParams } from "react-router-dom"

function ProductScreen() {
   
    const params = useParams();
    const { slug } = params;
    return <>
      <div>
        <h1>{slug}</h1>
        <p className="bg-red-500">we are viewing the product</p>
      </div>
    </>
}

export default ProductScreen