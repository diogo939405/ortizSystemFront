import React, { useEffect, useState } from 'react'
import './DeleteModal.css'
import { motion } from "motion/react"
import { AnimatePresence } from "motion/react"
import useTableContext from '../../../contexts/UseTableContext';
import DeleteBoleto from '../../../req/DeleteBoleto'
import { toast } from 'react-toastify';
import Loading from '../../Loading/Loading';
export default function DeleteModal() {
    const { setDeleteModal, boletoDataId } = useTableContext();
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (boletoDataId) {
            setFormData(boletoDataId)
        }
    }, [boletoDataId])

    const handleDelete = () => {
        setLoading(true);
        // const idBoleto = localStorage.getItem('idBoletoDelete');
        DeleteBoleto()
            .then((res) => {
                if (!res) {
                    setLoading(false);
                    toast.error("Erro ao deletar o boleto. Tente novamente.");
                }
                setLoading(false);
                toast.success("Boleto deletado com sucesso!");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Erro ao deletar o boleto:", error);
                toast.error("Erro ao deletar o boleto. Tente novamente.");
            });
    };

    return (
        <>
            {loading && <Loading />}
            <div className='modalDelete'>
                <AnimatePresence mode="wait">
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className='modalDelete-Card'>
                            <div className='modalDelete-Card-content'>
                                <p>Deseja apagar todas as parcelas do boleto, <strong>{formData?.tipoGasto}</strong>?</p>
                            </div>
                            <div className='modalDelete-Card-buttons'>
                                <button className='buttonsCard delete' onClick={handleDelete}>apagar</button>
                                <button className='buttonsCard back' style={{ backgroundColor: '#007bff' }} onClick={() => setDeleteModal(false)}>voltar</button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div >
        </>
    )
}
