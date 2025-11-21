export default function MessageBox(props) {
    return (
      <div
        className={`${
          props.isSuccess ? 'bg-green-500 text-green-800 border-green-500' : 'bg-red-400 border text-red-900 border-red-400'
        } w-fit my-5 ms-auto me-auto flex-center p-3 rounded-xl`}
      >
        {props.children}
      </div>
    );
}