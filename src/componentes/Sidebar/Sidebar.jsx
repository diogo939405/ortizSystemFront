import React from 'react'
import './Sidebar.css'
import logo from '../../assets/logoOrtiz.png'
import { useNavigate, useLocation } from 'react-router-dom';

import { SidebarData } from './SidebarData'
import useSidebarContext from './../../contexts/UseSidebarContext';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";


export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sidebarOpen, setSidebarOpen } = useSidebarContext();
    return (
        <div className='sidebar' style={sidebarOpen ? { width: "200px" } : { width: "90px" }}>
            <div className='sidebarLogo'>
                <img src={logo} width={sidebarOpen ? '160px' : '100px'} height={sidebarOpen ? '170px' : '120px'}></img>
            </div>
            <ul className='sidebarList'>
                {SidebarData.map((val, key) => {
                    return (
                        <li key={key}
                            className='row'
                            style={{ alignItems: sidebarOpen ? 'center' : 'none' }}
                            id={location.pathname === val.path ? 'active' : ''}
                            onClick={() => navigate(val.path)}
                        >
                            <div id='icon' style={{ marginLeft: !sidebarOpen ? '30px' : '0px' }}> {val.icon}</div>{''}
                            <div id='title'>{sidebarOpen ? val.title : ''}</div>
                        </li>
                    )
                })}
                <div className='sidebarFooter'>
                    <MdKeyboardDoubleArrowRight id='sidebarActions' style={{ color: '#fff', fontSize: '30px', display: sidebarOpen ? 'flex' : 'none' }} onClick={() => setSidebarOpen(!sidebarOpen)} />
                    <MdKeyboardDoubleArrowLeft id='sidebarActions' style={{ color: '#fff', marginRight: !sidebarOpen ? '20px' : '0px', fontSize: '30px', display: !sidebarOpen ? 'flex' : 'none' }} onClick={() => setSidebarOpen(!sidebarOpen)} />

                </div>
            </ul>

        </div>
    )
}
