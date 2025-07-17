// contexts/UseSidebarContext.jsx
import { useContext } from 'react';
import { SidebarContext } from './SidebarContext';

export default function useSidebarContext() {
    return useContext(SidebarContext);
}
