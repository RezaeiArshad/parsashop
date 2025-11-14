export default function CheckoutSteps(props) {
  return (
    <>
      <div id="checkout-steps" className="flex w-[80%] ms-[10%] mt-3">
        <div
          className={`flex-1 text-center pb-1 ${
            props.step1 ? 'border-b-3 border-b-high' : 'bg-bg dark:bg-bg-d'
          }`}
        >
          Sign-In
        </div>
        <div
          className={`flex-1 text-center pb-1 ${
            props.step2 ? 'border-b-3 border-b-high' : 'bg-bg dark:bg-bg-d'
          }`}
        >
          Shipping
        </div>
        <div
          className={`flex-1 text-center pb-1 ${
            props.step3 ? 'border-b-3 border-b-high' : 'bg-bg dark:bg-bg-d'
          }`}
        >
          Payment
        </div>
        <div
          className={`flex-1 text-center pb-1 ${
            props.step4 ? 'border-b-3 border-b-high' : 'bg-bg dark:bg-bg-d'
          }`}
        >
          Place Order
        </div>
      </div>
    </>
  );
}
