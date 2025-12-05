import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <>
      <form className="flex h-[60%] my-auto" onSubmit={submitHandler}>
        <input
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستو و جو "
          className="w-[80%] h-full bg-bg p-2 border-1 rounded-s-xl"
        />        
        <button className=" bg-high p-2 rounded-e-xl text-bg hover:bg-yellow-400 transition-colors duration-300 cursor-pointer w-40">
          جستو و جو
        </button>
      </form>
    </>
  );
}
