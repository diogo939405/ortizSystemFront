import { createContext, useState } from 'react';

export const SidebarContext = createContext(); // ✅ Definido apenas aqui

export default function SidebarProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}
