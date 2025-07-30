import './App.css';
import DotExpand from './components/CircleReveal';
import Finalstack from './components/Finalstack';
import Hero from './components/Hero';
import LogoBubbles from './components/LogoBubbles';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Hero/>
      <DotExpand/>
      <LogoBubbles/>
      <Finalstack/>
    </div>
  );
}

export default App;
