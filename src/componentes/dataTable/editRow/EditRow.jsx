import React, { useState, useEffect } from 'react';
import useTableContext from '../../../contexts/UseTableContext';
import './EditRow.css';
import { MdOutlineAttachMoney } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { TbNumber } from "react-icons/tb";
import Loading from '../../loading/Loading';
import { toast } from 'react-toastify';
import PatchBoletos from '../../../req/PatchBoletos';
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";

export default function EditRow() {
    const { setEdit, boletoDataId } = useTableContext();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Função auxiliar para formatar um número para moeda
    const formatarParaMoeda = (valor) => {
        const num = parseFloat(String(valor).replace(/[^\d,.-]/g, '').replace(',', '.'));

        if (isNaN(num)) return 'R$ 0,00';

        return 'R$ ' + num
            .toFixed(2)
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    useEffect(() => {
        if (!boletoDataId) {
            setLoading(true);
        } else {
            // Crie uma cópia profunda para evitar mutar o objeto original do contexto
            const initialFormData = JSON.parse(JSON.stringify(boletoDataId));

            // Formata o valor total do boleto, se necessário
            initialFormData.valor = formatarParaMoeda(initialFormData.valor);

            // Percorre as parcelas e formata o valor de cada uma
            if (Array.isArray(initialFormData.parcelas)) {
                initialFormData.parcelas = initialFormData.parcelas.map(parcela => ({
                    ...parcela,
                    // Garante que o valor da parcela esteja no formato "R$ XX,XX"
                    valor: formatarParaMoeda(parcela.valor)
                }));
            }
            setFormData(initialFormData);
            setLoading(false);
        }
    }, [boletoDataId]);

    const handleParcelaChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedParcelas = [...prev.parcelas];

            if (field === 'valor') {
                let raw = value.replace(/\D/g, '').substring(0, 10);

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
                updatedParcelas[index][field] = value;
            }

            return {
                ...prev,
                parcelas: updatedParcelas
            };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

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

        // Antes de enviar, precisamos "desformatar" os valores para números novamente
        const dataToSend = JSON.parse(JSON.stringify(formData)); // Copia para não modificar formData diretamente
        dataToSend.valor = parseFloat(String(dataToSend.valor).replace('R$ ', '').replace(/\./g, '').replace(',', '.')) || 0;
        if (Array.isArray(dataToSend.parcelas)) {
            dataToSend.parcelas = dataToSend.parcelas.map(parcela => ({
                ...parcela,
                valor: parseFloat(String(parcela.valor).replace('R$ ', '').replace(/\./g, '').replace(',', '.')) || 0
            }));
        }

        // Passa o objeto desformatado para a função de patch
        PatchBoletos({ formData: dataToSend, boletoDataId })
            .then((res) => {
                if (res) {
                    toast.success('Boleto atualizado com sucesso');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    toast.error('Erro ao atualizar boleto.');
                }
            })
            .catch((err) => {
                console.error("Erro na requisição:", err);
                toast.error('Erro ao enviar dados.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            {loading && <Loading />}
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
                                        value={formData?.valor || ''} // Este já deve vir formatado pelo useEffect
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
                                                            // O valor já vem formatado pelo useEffect
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
        </>
    );
}