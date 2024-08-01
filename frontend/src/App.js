import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';


import { CartProvider } from './Components/CartProvider';
import './App.css';
import Main from './Components/Main';
function App() {
  return (
    <div className="App">
    <CartProvider>

      <Main/>
    </CartProvider>
    </div>
  );
}

export default App;
