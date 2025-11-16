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
      <form className="flex h-[80%] my-auto" onSubmit={submitHandler}>
        <input
          onChange={(e) => setQuery(e.target.value)}
          placeHolder="Products For Products..."
          className="w-[80%] h-full bg-bg p-2 rounded-s-xl border-1"
        />
        <button className=" bg-high p-2 rounded-e-xl text-fg-d hover:bg-yellow-400 transition-colors duration-300 cursor-pointer">
          Search
        </button>
      </form>
    </>
  );
}
