import React, { useEffect } from 'react'
import './CardInfo.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoiceDollar, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import useTableContext from '../../../contexts/UseTableContext'
import GetBoletosVencendo from '../../../req/GetBoletosVencendo'
export default function CardInfo() {

    const {
        boletosData,
        setBoletoVencendo,
        boletoVencendo,
        boletoVencidos,
        setBoletoVencidos
    } = useTableContext();


    useEffect(() => {
        GetBoletosVencendo()
            .then(data => {
                setBoletoVencendo(data);
                console.log('Boletos vencendo:', data);
            })
            .catch(error => {
                console.error('Erro ao buscar boletos vencendo:', error);
            })

    }, [boletoVencendo, setBoletoVencendo]);

    // useEffect(() => {
    //     GetBoletosVencendo()
    //         .then(data => {
    //             setBoletoVencidos(data);
    //             console.log('Boletos vencidos:', data);
    //         })
    //         .catch(error => {
    //             console.error('Erro ao buscar boletos vencidos:', error);
    //         })
    // })


    // const dataVenciment = boletosData.sort((a, b) => new Date(b.boletosData.parcelas.vencimento) - new Date(a.boletosData.parcelas.vencimento));
    const totalBoletos = boletosData.length;
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
                    <span className='Card-value'>{boletoVencendo.length}</span>
                </div>

                <div className='Card' id='boletoVencidos'>
                    <div className="Card-icon">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </div>
                    <p className='Card-title'>Boletos vencidos</p>
                    <span className='Card-value'>{boletoVencidos.length}</span>
                </div>

            </div>
        </div>
    )
}
