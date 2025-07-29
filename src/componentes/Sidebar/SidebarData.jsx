import React from 'react'
import { FaHome, FaPlus } from "react-icons/fa";


export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <FaHome />,
        cName: 'nav-text'
    },
    {
        title: 'Adiciona boleto',
        path: '/addBoleto',
        icon: <FaPlus />,
        cName: 'nav-text'
    },
    // {
    //     title: 'Services',
    //     path: '/services',
    //     icon: <FaHome />,
    //     cName: 'nav-text'
    // },
    // {
    //     title: 'Contact',
    //     path: '/contact',
    //     icon: <FaHome />,
    //     cName: 'nav-text'
    // },
    // {
    //     title: 'Sign In',
    //     path: '/signin',
    //     icon: <FaHome />,
    //     cName: 'nav-text'
    // },
]