import React from 'react'
import useTableContext from '../../../contexts/UseTableContext'
import './EditRow.css'

export default function EditRow() {
    const { setEdit, boletoDataId } = useTableContext();

    const handleClose = () => {
        setEdit(false);
    };

    return (
        <div className='EditRow-container'>
            <div className='EditRow-container-card'>
                <h2>Editar Boleto</h2>

                <p><strong>ID:</strong> {boletoDataId?.idBoleto}</p>
                <p><strong>Código:</strong> {boletoDataId?.codigo}</p>
                <p><strong>Valor:</strong> R$ {boletoDataId?.valor}</p>
                <p><strong>Tipo de Gasto:</strong> {boletoDataId?.tipoGasto}</p>
                <p><strong>Status:</strong> {boletoDataId?.status ? 'Ativo' : 'Inativo'}</p>

                <button onClick={handleClose}>Fechar</button>
            </div>
        </div>
    )
}
