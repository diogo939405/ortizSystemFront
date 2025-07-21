import React from 'react'
import './Home.css'
import GetBoletos from '../../req/GetBoletos'
import Sidebar from '../../componentes/Sidebar/Sidebar'
import Tabela from '../../componentes/dataTable/Tabela'
import CardInfo from './CardInfo/CardInfo'
export default function Home() {


    return (
        <>
            <div className='bodyproject'>
                <CardInfo />
                <Tabela />
            </div>



        </>
    )
}
