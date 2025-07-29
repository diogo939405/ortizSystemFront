import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { AnimatePresence } from "motion/react"
import useTableContext from '../../../contexts/UseTableContext';
import { toast } from 'react-toastify';
import Loading from '../../loading/Loading';
import './AtualizarBoleto.css';
import ChangeStatus from '../../../req/ChangeStatus';

export default function AtualizarBoleto() {
    const { setAtualizarModal, boletoDataId } = useTableContext();
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (boletoDataId) {
            setFormData(boletoDataId)
        }
    }, [boletoDataId])

    const handleParcelaChange = (e) => {
        const { name, value } = e.target;
        const parcelaIndex = formData?.parcelas?.findIndex(
            (p) => p.numeroParcela === formData?.numeroParcela
        );

        if (parcelaIndex === -1) return;

        setFormData(prevData => {
            const updatedParcelas = [...prevData.parcelas];
            updatedParcelas[parcelaIndex] = {
                ...updatedParcelas[parcelaIndex],
                [name]: value
            };
            return {
                ...prevData,
                parcelas: updatedParcelas
            };
        });
    };

    const handleAtualizar = async () => {
        setLoading(true);
        ChangeStatus({ formData })
            .then((response) => {
                if (response) {
                    setLoading(false);
                    toast.success('Status atualizado com sucesso!');
                    setAtualizarModal(false);
                    // setTimeout(() => {
                    window.location.reload();
                    // }, 1500);
                } else {
                    setLoading(false);
                    toast.error('Erro ao atualizar status.');
                }
            }).catch((error) => {
                setLoading(false);
                console.error('Erro ao atualizar status:', error);
                toast.error('Erro ao atualizar status. Fale com a equipe técnica.');
            });
    }

    return (
        <>
            {loading && <Loading />}
            <div className='modalAtualizar'>
                <AnimatePresence mode="wait">
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className='modalAtualizar-Card'>
                            <div className='modalAtualizar-Card-content'>
                                <p>Deseja alterar o status dessa parcela de <strong style={{ fontSize: '25px', fontWeight: '500' }}>pendente </strong>
                                    para <strong style={{ fontSize: '25px', fontWeight: '500' }}> pago</strong> ?</p>
                            </div>
                            <div className='modalAtualizar-Card-content-textArea'>
                                <label htmlFor="observacao">Observação:</label>
                                <textarea
                                    name="observacao"
                                    placeholder="Digite uma observação (opcional)"
                                    value={
                                        formData?.parcelas?.find(p => p.numeroParcela === formData?.numeroParcela)?.observacao || ''
                                    }
                                    onChange={handleParcelaChange}
                                />
                            </div>
                            <div className='modalAtualizar-Card-buttons'>
                                <button className='modalAtualizarButtons atualizar' onClick={handleAtualizar} >Atualizar</button>
                                <button className='modalAtualizarButtons back' onClick={() => setAtualizarModal(false)}>voltar</button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div >
        </>
    )
}
