import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Page/Home/Home'
import Sidebar from './componentes/Sidebar/Sidebar'
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // ✅ Tema escolhido
import 'primereact/resources/primereact.min.css';                  // ✅ Estilos do PrimeReact
import 'primeicons/primeicons.css';                                // ✅ Ícones
import 'primeflex/primeflex.css';
import './App.css'
import GetBoletos from './req/GetBoletos';
import AddBoleto from './Page/AddBoleto/AddBoleto';



function App() {
  return (
    <>
      <GetBoletos />
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/addBoleto' element={<AddBoleto />} />
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
