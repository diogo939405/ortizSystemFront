import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { TableProvider } from './contexts/TableContext.jsx'
import SidebarProvider from './contexts/SidebarContext.jsx'
import AddBoletoProvider from './contexts/AddBoletoContext.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SidebarProvider>
      <TableProvider>
        <AddBoletoProvider>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <App />
        </AddBoletoProvider>
      </TableProvider>
    </SidebarProvider>
  </StrictMode >
)
