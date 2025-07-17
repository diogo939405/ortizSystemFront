import React, { useEffect } from 'react'
import './Home.css'
import GetBoletos from '../../req/GetBoletos'
import Sidebar from '../../componentes/Sidebar/Sidebar'
import useTableContext from '../../contexts/UseTableContext'
import Tabela from '../../componentes/dataTable/Tabela'
export default function Home() {


    return (
        <>
            <div className='bodyproject'>
                <Sidebar />
                <Tabela />

            </div>



        </>
    )
}
