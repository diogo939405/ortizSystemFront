import React, { useEffect } from 'react'
import './CardInfo.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoiceDollar, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import useTableContext from '../../../contexts/UseTableContext'
import GetBoletosVencendo from '../../../req/GetBoletosVencendo'
import GetBoletosVencidos from '../../../req/GetBoletosVencidos'
export default function CardInfo() {

    const {
        boletosData,
        boletoVencendo,
        setBoletoVencendo,
        boletoVencidos,
        setBoletoVencidos
    } = useTableContext();

    useEffect(() => {
        async function fetchData() {
            const data = await GetBoletosVencendo();
            // console.log("📦 Boletos vencendo recebidos:", data);
            setBoletoVencendo(data);
        }
        fetchData();
    }, [setBoletoVencendo]);

    useEffect(() => {
        async function fetchVencidos() {
            const vencidos = await GetBoletosVencidos();
            console.log("📦 Boletos vencidos recebidos:", vencidos);
            setBoletoVencidos(vencidos);
        }
        fetchVencidos();
    }, [setBoletoVencidos])
    // const dataVenciment = boletosData.sort((a, b) => new Date(b.boletosData.parcelas.vencimento) - new Date(a.boletosData.parcelas.vencimento));
    const totalBoletos = boletosData.length;
    const totalVencendo = Array.isArray(boletoVencendo) ? boletoVencendo.length : 0;
    const totalVencidos = Array.isArray(boletoVencidos) ? boletoVencidos.length : 0;

    return (
        <div className='Card-content'>
            <div className='Cards'>

                <div className='Card' id='boletoTotal'>
                    <div className="Card-icon">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} />
                    </div>
                    <p className='Card-title'>Total de boletos</p>
                    <span className='Card-value'>{totalBoletos}</span>
                </div>

                <div className='Card' id='boletoVencimento'>
                    <div className="Card-icon">
                        <FontAwesomeIcon icon={faClock} />
                    </div>
                    <p className='Card-title'>Vencimento próximo</p>
                    <span className='Card-value'>{totalVencendo}</span>
                </div>

                <div className='Card' id='boletoVencidos'>
                    <div className="Card-icon">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </div>
                    <p className='Card-title'>Parcelas Vencidas</p>
                    <span className='Card-value'>{totalVencidos}</span>
                </div>

            </div>
        </div>
    )
}
