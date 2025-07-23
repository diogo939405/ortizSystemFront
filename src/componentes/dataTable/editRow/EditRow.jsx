import React, { useState, useEffect } from 'react'
import useTableContext from '../../../contexts/UseTableContext'
import './EditRow.css'
import { MdOutlineAttachMoney } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { TbNumber } from "react-icons/tb";
import Loading from '../../Loading/Loading';
import { toast } from 'react-toastify';
import PatchBoletos from '../../../req/PatchBoletos';
export default function EditRow() {
    const { setEdit, boletoDataId } = useTableContext();
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setFormData(boletoDataId);
    }, [boletoDataId]);

    const handleParcelaChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedParcelas = [...prev.parcelas];

            if (field === 'valor') {
                // Remove tudo que não é número
                let raw = value.replace(/\D/g, '').substring(0, 10);

                // Se estiver vazio, mostra R$ 0,00
                if (!raw) {
                    updatedParcelas[index][field] = 'R$ 0,00';
                } else {
                    const num = parseFloat(raw) / 100;

                    const formatted = 'R$ ' + num
                        .toFixed(2)
                        .replace('.', ',')
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                    updatedParcelas[index][field] = formatted;
                }

            } else {
                // Para vencimento ou outros campos
                updatedParcelas[index][field] = value;
            }

            return {
                ...prev,
                parcelas: updatedParcelas
            };
        });
    };
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const handleClose = () => {
        setEdit(false);
    };

    const verifySum = () => {
        const parcelas = Array.isArray(formData.parcelas) ? formData.parcelas : [];
        const valorTotal = parseFloat(
            String(formData.valor).replace('R$ ', '').replace(/\./g, '').replace(',', '.')
        );

        const valorTotalParcelas = parcelas.reduce((total, parcela) => {
            const valorParcela = parseFloat(
                String(parcela.valor).replace('R$ ', '').replace(/\./g, '').replace(',', '.')
            );
            return total + (isNaN(valorParcela) ? 0 : valorParcela);
        }, 0);

        if (isNaN(valorTotal) || isNaN(valorTotalParcelas)) {
            toast.error('Erro ao converter os valores.');
            return false;
        }

        if (Math.abs(valorTotal - valorTotalParcelas) > 0.01) {
            toast.error('A soma das parcelas está diferente do valor total.');
            return false;
        }

        return true;
    };
    const handleData = () => {
        setLoading(true)
        if (formData.tipoGasto === '' || formData.valor === '') {
            setLoading(false)
            toast.error('Campos incompletos.');
            return;
        }

        if (!verifySum()) {
            setLoading(false)

            return;
        }

        console.log('Tudo certo, pode seguir com o envio...');
        PatchBoletos({ formData, boletoDataId })
            .then((res) => {
                if (res) {
                    setLoading(false)

                    toast.success('boleto atualizado com sucesso')
                    setTimeout(() => {
                        window.location.reload()
                    }, [2000])
                }
            })
        setLoading(false)

    };

    return (
        <>
            {loading ? <Loading /> : null}
            {
                !formData ? <Loading /> : <div className='EditRow-container'>
                    <div className='EditRow-container-card'>
                        <div className='EditRow-title'>
                            <h2>Editar Boleto</h2>
                        </div>

                        <div className='EditRow-card-content'>
                            <div className='EditRow-card-boletoInfo'>
                                <label>tipo do Gasto <ImBooks className='icon-input-editRow' /></label>
                                <input
                                    value={formData?.tipoGasto || ''}
                                    onChange={(e) => handleChange(e)}
                                    name='tipoGasto'
                                />
                                <label>Valor total do Boleto <TbNumber className='icon-input-editRow' /></label>
                                <input
                                    value={formData?.valor || ''}
                                    onChange={(e) => handleChange(e)}
                                    name='valor'
                                />
                            </div>
                        </div>

                        <div className='EditRow-card-content'>
                            {
                                formData?.parcelas?.map((parcela, index) => (
                                    <div key={index} className='EditRow-card-parcelaInfo'>
                                        <div className='EditRow-card-parcelaInfo-inputs'>
                                            <label>Parcela {index + 1}</label>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={parcela.valor}
                                                    onChange={(e) => handleParcelaChange(index, 'valor', e.target.value)}
                                                />
                                            </div>
                                            <label>Vencimento</label>
                                            <div>
                                                <input
                                                    type="date"
                                                    value={parcela.vencimento}
                                                    onChange={(e) => handleParcelaChange(index, 'vencimento', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div className='EditRow-card-buttons'>
                            <button className='button-edit Cancel' onClick={handleClose}>Fechar</button>
                            <button
                                className='button-edit Confirm'
                                onClick={handleData}
                            >
                                Alterar
                            </button>
                        </div>
                    </div>
                </div>

            }

        </>

    );
}
