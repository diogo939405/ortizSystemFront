import React, { useState, useEffect } from 'react'
import useTableContext from '../../../contexts/UseTableContext'
import './EditRow.css'
import { MdOutlineAttachMoney } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { TbNumber } from "react-icons/tb";
import Loading from '../../Loading/Loading';
import { toast } from 'react-toastify';
import PatchBoletos from '../../../req/PatchBoletos';
import { motion } from "motion/react"
import { AnimatePresence } from "motion/react"
export default function EditRow() {
    const { setEdit, boletoDataId } = useTableContext();
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [pago, setPago] = useState(false)
    useEffect(() => {
        if (!boletoDataId) {
            setLoading(true);
        } else {
            setFormData(boletoDataId);
            setLoading(false);
        }
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
    }; const handleData = () => {
        setLoading(true);

        if (formData.tipoGasto === '' || formData.valor === '') {
            toast.error('Campos incompletos.');
            setLoading(false);
            return;
        }

        if (!verifySum()) {
            setLoading(false);
            return;
        }

        PatchBoletos({ formData, boletoDataId })
            .then((res) => {
                if (res) {
                    toast.success('boleto atualizado com sucesso');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000); // ✅ array removido
                } else {
                    toast.error('Erro ao atualizar boleto.');
                }
            })
            .catch((err) => {
                console.error("Erro na requisição:", err);
                toast.error('Erro ao enviar dados.');
            })
            .finally(() => {
                setLoading(false); // ✅ Executado sempre no final
            });
    };


    return (
        <>

            {loading && <Loading />}
            {/* <AnimatePresence mode="wait">
                <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                > */}
            {
                !formData ? <Loading /> :

                    <div className='EditRow-container'>
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
                                        readOnly
                                    />
                                    <label>Valor total do Boleto <TbNumber className='icon-input-editRow' /></label>
                                    <input
                                        value={formData?.valor || ''}
                                        onChange={(e) => handleChange(e)}
                                        name='valor'
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className='EditRow-card-content'>
                                {
                                    formData?.parcelas?.map((parcela, index) => {
                                        const isPago = parcela.status === "pago";
                                        // const backgroundColor = isPago ? '#28A746FF' : '#f0f4f8';
                                        const borderLeft = isPago ? '5px solid #28A746FF' : '5px solid #2c3e50';
                                        const borderBottom = isPago ? '4px solid #28A746FF' : '4px solid #2c3e50';
                                        return (
                                            <div key={index} className='EditRow-card-parcelaInfo'>
                                                <div className='EditRow-card-parcelaInfo-inputs' style={{ borderLeft, borderBottom }}>
                                                    {
                                                        isPago && (
                                                            <>
                                                                <label className='labelText' htmlFor="observacao">Observação:</label>
                                                                <textarea
                                                                    value={parcela.observacao || ''}
                                                                    readOnly
                                                                />

                                                            </>
                                                        )
                                                    }
                                                    <label >Parcela {index + 1}</label>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            readOnly={isPago ? true : false}
                                                            value={parcela.valor}
                                                            onChange={(e) => handleParcelaChange(index, 'valor', e.target.value)}
                                                        />


                                                    </div>

                                                    <label >Vencimento</label>
                                                    <div>
                                                        <input
                                                            type="date"
                                                            readOnly={isPago ? true : false}

                                                            value={parcela.vencimento}
                                                            onChange={(e) => handleParcelaChange(index, 'vencimento', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
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
            {/* </motion.div >
            </AnimatePresence > */}
        </>


    );
}
