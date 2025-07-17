import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { TableProvider } from './contexts/TableContext.jsx'
import SidebarProvider from './contexts/SidebarContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SidebarProvider>
      <TableProvider>
        <App />
      </TableProvider>
    </SidebarProvider>
  </StrictMode>
)
