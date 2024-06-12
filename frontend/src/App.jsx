import { useState, useEffect } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="guide" element={<Guide />} />
        <Route path="configuration" element={<Configuration />} />
      </Routes>
    </BrowserRouter>
  );
}

function NavBar() {
  return (
    <div>
      <hr />
      <Link to="/">Home</Link>
      {' | '}
      <Link to="/guide">Prompting Guide</Link>
      {' | '}
      <Link to="/configuration">Configuration</Link>
      <hr />
    </div>
  );
}

function Greeter({ name }) {
  return (
    <h1>
      Hello
      {' '}
      {name}
    </h1>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  function increment() {
    console.log(count);
    setCount((c) => c + 1);
    console.log(count);
  }
  return (
    <>
      <p>
        Counter =
        {count}
      </p>

      <button type="button" onClick={increment}>
        Add 1
      </button>
    </>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <p>
        Time:
        {time.toLocaleTimeString()}
      </p>
    </div>
  );
}

async function getJoke() {
  let jokeText = 'No joke for you!';
  try {
    const joke = await fetch('https://icanhazdadjoke.com/', { headers: { Accept: 'text/plain' } });
    jokeText = await joke.text();
    console.log(jokeText);
  } catch {
    console.log("Something's wrong!");
  }
  return jokeText;
}



function Joke() {
  const [myJoke, setMyJoke] = useState('No Joke yet');

  useEffect(() => {
    async function fetchJoke() {
      const j = await getJoke();
      setMyJoke(j);
    }
    fetchJoke();
  }, []);
  return (
    <p>
      {myJoke}
    </p>
  );
}

async function getPokemon(setMyPokemon) {
  setMyPokemon({});





  // Get the Pokedex's upper Pokemon limit
  // Send a GET request to get the amount of Pokemon we have to work with.
  // Data endpoint: https://pokeapi.co/api/v2/pokemon-species/?limit=0
  // We will use this to generate a random number within the boundaries
  let maxNumber = 0;
  let details = null;

  const allDataReq = await fetch('https://pokeapi.co/api/v2/pokemon-species/?limit=0');
  const allData = await allDataReq.json();
  console.log(allData.count);



  // Send a new GET request to get information about that Pokemon.
  // Data endpoint: https://pokeapi.co/api/v2/pokemon/{integer}
  let pokemon = null;
  let actualPokemon = null;
  let actualNumber = Math.floor(Math.random() * allData.count);
  console.log(actualNumber);
  try {
    pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${actualNumber}`);
    actualPokemon = await pokemon.json();
    console.log(JSON.stringify(actualPokemon))
  } catch (e) {
    console.log("Something's wrong!" + e);
  }
  console.log(actualPokemon);
  console.log(actualPokemon.sprites.back_default)

  setMyPokemon(actualPokemon);
  // Save this data somewhere!
}

function Pokemon() {
  const [myPokemon, setMyPokemon] = useState({});

  useEffect(() => {
    getPokemon(setMyPokemon);
  }, []);
  console.log(myPokemon)


  return (
    <>
      {/* Can we wait for the data fetch to complete before loading the content? */}
      <div>
        My randomly selected pokemon was {(myPokemon.name)} with a height of {JSON.stringify(myPokemon.height)}!
      </div>
      {myPokemon.sprites &&
        (
          <img
            alt="image of Pokemon"
            src={myPokemon.sprites.other['official-artwork'].front_default} />
        )}

    </>
  );
}



function Home() {
  return (
    <div>
      <h2>Home</h2>
      <NavBar />
      <Greeter name="Arjun" />
      <Counter />
      <Clock />
      <Joke />
      <Pokemon />
    </div>
  );
}

function Guide() {
  return (
    <div>
      <h2>Prompting Guide</h2>
      <NavBar />
    </div>
  );
}

function Configuration() {
  return (
    <div>
      <h2>Prompt Configuration</h2>
      <NavBar />
    </div>
  );
}

export default App;
