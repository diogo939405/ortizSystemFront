import { useState } from 'react'
import Sidebar from '../../componentes/Sidebar/Sidebar'
import './AddBoleto.css'
import { motion } from "motion/react"
import { AnimatePresence } from "motion/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MdOutlineAttachMoney } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { TbNumber } from "react-icons/tb";
import { FaCalendar } from "react-icons/fa";
import { MdStyle } from "react-icons/md";
import { CalcularParcelas } from './Utils/CalcularParcela';
import useAddBoletoContext from './../../contexts/UseAddBoletoContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';
import PostBoletos from '../../req/PostBoletos'
import VerifyCamps from './Utils/VerifyCamps'
import { toast } from 'react-toastify'
import Loading from '../../componentes/Loading/Loading';
export default function AddBoleto() {
    const {
        editParcelas,
        setEditParcelas,
        newBoletoInfo,
        setNewBoletoInfo
    } = useAddBoletoContext();
    const [loading, setLoading] = useState(false);

    const handleData = (e) => {
        const { name, value } = e.target;

        if (name === 'valor') {
            let input = value.replace(/\D/g, '').substring(0, 10);
            let formattedValor = '';
            let rawValor = 0;

            if (input.length > 0) {
                rawValor = parseFloat(input) / 100;
                formattedValor = 'R$ ' + rawValor
                    .toFixed(2)
                    .replace('.', ',')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }

            setNewBoletoInfo((prev) => {
                const qtd = parseInt(prev.qParcelas);
                const parcelas = !isNaN(qtd) && qtd > 0
                    ? Array.from({ length: qtd }, () => ({
                        valor: 'R$ ' + (rawValor / qtd).toFixed(2).replace('.', ','),
                        dataVencimento: ''
                    }))
                    : [];

                return {
                    ...prev,
                    valor: formattedValor,
                    parcelas
                };
            });
            return;
        }

        if (name === 'qParcelas') {
            const input = value.replace(/\D/g, '').replace(/^0+(?!$)/, '');
            setNewBoletoInfo((prev) => ({
                ...prev,
                qParcelas: input,
                parcelas: CalcularParcelas(prev.valor, input, prev.parcelas?.dataVencimento)
            }));
            return;
        }

        setNewBoletoInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const parseVencimento = (value) => {
        if (!value) return null;

        if (value instanceof Date) return value;

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
            const [dia, mes, ano] = value.split('/');
            const data = new Date(ano, mes - 1, dia);
            data.setHours(12);
            return data;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [ano, mes, dia] = value.split('-');
            const data = new Date(ano, mes - 1, dia);
            data.setHours(12);
            return data;
        }

        return null;
    };

    const [vencimento, setVencimento] = useState(parseVencimento(newBoletoInfo.dataVencimento));
    const handleDateChange = (date) => {
        setVencimento(date);

        const formattedDate = date?.toLocaleDateString('pt-BR');

        setNewBoletoInfo((prev) => ({
            ...prev,
            dataVencimento: editParcelas ? null : formattedDate
        }));
    };

    const handlePost = async () => {
        setLoading(true);
        const camposValidos = VerifyCamps(newBoletoInfo);
        console.log(newBoletoInfo)

        if (!camposValidos) {
            toast.error('Verifique os campos obrigatórios e as parcelas!');
            setLoading(false);
            return;
        }

        try {
            const resultado = await PostBoletos(newBoletoInfo);
            if (resultado) {
                setLoading(false);
                toast.success('Boleto adicionado com sucesso!');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setLoading(false);
                toast.error('Erro ao adicionar boleto!');
            }
        } catch (error) {
            setLoading(false);
            console.error('Erro ao enviar boleto:', error);
            toast.error('Erro ao enviar boleto!');
        }
    };

    return (
        <>
            {loading && <Loading />}
            <AnimatePresence mode="wait">
                <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='addBoleto-Body'>
                        <div className='addBoleto-Body-title'>
                            <h3>Adicionar Boleto</h3>
                        </div>
                        <div className='addBoleto-Body-content'>
                            <div className='addBoleto-Body-content-form'>
                                <div className='addBoleto-form-inputs'>
                                    <div className='addBoleto-form-inputs-input'>
                                        <label>Tipo Gasto
                                            <ImBooks className='icon-input' />
                                        </label>
                                        <input value={newBoletoInfo.tipoGasto} name='tipoGasto' type="text" onChange={handleData} placeholder='Digite o tipo de gasto' />
                                    </div>
                                </div>
                                <div className='addBoleto-form-inputs'>
                                    <div className='addBoleto-form-inputs-input'>
                                        <label>Valor
                                            <MdOutlineAttachMoney style={{ fontSize: '22px' }} className='icon-input' />
                                        </label>
                                        <input
                                            name='valor'
                                            value={newBoletoInfo.valor}
                                            type="text"
                                            onChange={handleData}
                                            placeholder='Digite o valor do boleto' />
                                    </div>
                                    <div className='addBoleto-form-inputs-input'>
                                        <label>Quantidade de parcela
                                            <TbNumber className='icon-input' />
                                        </label>
                                        <input
                                            name="qParcelas"
                                            value={newBoletoInfo.qParcelas}
                                            type="text"
                                            onChange={handleData}
                                            placeholder="Digite a quantidade de parcelas"
                                            maxLength={2}
                                        />
                                    </div>
                                    {/* <div className='addBoleto-form-inputs-input' style={editParcelas ? { display: 'none' } : { display: 'flex' }}>
                                        <label>Vencimento
                                            <FaCalendar className='icon-input' />
                                        </label>
                                        <DatePicker
                                            selected={vencimento}
                                            onChange={handleDateChange}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="DD/MM/AAAA"
                                            locale={ptBR}
                                            className="inputData"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            required

                                        />
                                    </div> */}
                                </div>
                                <div className='addBoleto-form-inputs'>
                                    <div className='addBoleto-form-inputs-bookmarks'>
                                        <label>Parcelas personalizadas?
                                            <input type='checkbox' value={editParcelas} onChange={() => setEditParcelas(!editParcelas)} disabled={!newBoletoInfo.qParcelas || newBoletoInfo.qParcelas === ''} />
                                        </label>
                                    </div>
                                </div>
                                {editParcelas && Array.isArray(newBoletoInfo.parcelas) && newBoletoInfo.parcelas.map((parcela, index) => (
                                    <div key={index} className='addBoleto-form-inputs'>
                                        <div className='addBoleto-form-inputs-input-parcelaEdit'>
                                            <label>Parcela {index + 1}</label>
                                            <div>
                                                <input
                                                    type="text"
                                                    value={parcela.valor}
                                                    onChange={(e) => {
                                                        const valor = e.target.value;
                                                        const novasParcelas = [...newBoletoInfo.parcelas];
                                                        novasParcelas[index].valor = valor;
                                                        setNewBoletoInfo((prev) => ({
                                                            ...prev,
                                                            parcelas: novasParcelas
                                                        }));
                                                    }}
                                                    placeholder='Digite o valor da parcela'
                                                />
                                                <input
                                                    type="date"
                                                    value={parcela.dataVencimento}
                                                    onChange={(e) => {
                                                        const data = e.target.value;
                                                        const novasParcelas = [...newBoletoInfo.parcelas];
                                                        novasParcelas[index].dataVencimento = data;
                                                        setNewBoletoInfo((prev) => ({
                                                            ...prev,
                                                            parcelas: novasParcelas
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className='addBoleto-form-buttons'>
                                    <button className='addBoleto-form-buttons' onClick={handlePost}>Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    );
}
