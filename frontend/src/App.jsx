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

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <NavBar />
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