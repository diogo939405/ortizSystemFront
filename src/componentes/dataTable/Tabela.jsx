import React, { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa'; // Importe os ícones do react-icons
import { MdOutlineDoneOutline } from "react-icons/md";

import GetBoletosById from '../../req/GetBoletosById';
import useTableContext from '../../contexts/UseTableContext';
import EditRow from './editRow/EditRow';
import './Tabela.css'; // Importe o arquivo CSS
import { Tag } from 'primereact/tag'; // Mantenha o Tag do PrimeReact se você quiser usá-lo
import DeleteModal from './deleteModal/DeleteModal';
import AtualizarBoleto from './atualizarBoleto/AtualizarBoleto';

export default function TabelaTeste() {

    const {
        boletosData,
        loading,
        setLoading,
        filters,
        setFilters,
        globalFilterValue,
        setGlobalFilterValue,
        edit,
        setEdit,
        setBoletoDataId,
        setDeleteModal,
        deleteModal,
        atualizarModal,
        setAtualizarModal
    } = useTableContext();

    // Estado local para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    // Inicializa filtros uma vez
    useEffect(() => {
        setFilters({
            global: { value: null, matchMode: 'contains' } // Use string 'contains' para FilterMatchMode
        });
        setGlobalFilterValue('');
    }, [setFilters, setGlobalFilterValue]); // Adicione dependências para useEffect

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        const _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };



    const openEditModal = async (rowData) => {
        setEdit(true);
        setLoading(true);
        const data = await GetBoletosById(rowData.id); // Use idBoleto conforme seus dados
        localStorage.setItem('idBoleto', rowData.id)
        if (data) {
            setBoletoDataId(data);
        }
        setLoading(false);
    };

    // faz a conversão dos dados para o formato de tabela
    const parcelasFlatten = useMemo(() => {
        return boletosData.flatMap(boleto => {
            if (!boleto.parcelas || !Array.isArray(boleto.parcelas)) return [];

            const parcelaPendentes = boleto.parcelas.filter(p => p.status === 'Pendente'); // status === false indica pendente
            const totalParcelas = boleto.parcelas.length;

            return parcelaPendentes.map(parcela => ({
                id: boleto.id,
                tipoGasto: boleto.tipoGasto,
                valorTotal: boleto.valor,
                numeroParcela: parcela.numeroParcela,
                totalParcelas: totalParcelas,
                valorParcela: parcela.valor, // Acessando diretamente o valor da parcela
                vencimento: parcela.vencimento,
                status: parcela.status,
                observacao: parcela.observacao,
            }));
        });
    }, [boletosData]);

    const handleDelete = async (rowData) => {
        localStorage.setItem('idBoletoDelete', rowData.id)
        const data = await GetBoletosById(rowData.id); // Use idBoleto conforme seus dados
        if (data) {
            setBoletoDataId(data);
        }
        setDeleteModal(true)
    };

    const handleAtualizar = async (rowData) => {
        setAtualizarModal(true);
        localStorage.setItem('idBoletoAtualizar', rowData.id);

        const data = await GetBoletosById(rowData.id);
        if (data) {
            // inclui numeroParcela clicada no objeto
            setBoletoDataId({
                ...data,
                numeroParcela: rowData.numeroParcela // <- importante
            });
        }
    };

    // recebe os dados filtrados
    const filteredData = useMemo(() => {
        if (!globalFilterValue) return parcelasFlatten;
        const lowerCaseFilter = globalFilterValue.toLowerCase();
        return parcelasFlatten.filter(item =>
            item.tipoGasto?.toLowerCase().includes(lowerCaseFilter) ||
            item.valorTotal?.toString().includes(lowerCaseFilter) ||
            item.valorParcela?.toString().includes(lowerCaseFilter)
        );
    }, [parcelasFlatten, globalFilterValue]);
    // Calcula o número total de páginas dos dados filtrados
    const totalPages = useMemo(() => {
        return Math.ceil(filteredData.length / itemsPerPage);
    }, [filteredData.length, itemsPerPage]);

    // Obtém os itens da página atual dos dados filtrados e ordena em data de vencimento
    const currentTableData = useMemo(() => {
        // Ordenar os dados pelo vencimento mais próximo
        const sortedData = [...filteredData].sort((a, b) => {
            const dateA = new Date(a.vencimento);
            const dateB = new Date(b.vencimento);
            return dateA - dateB;
        });

        // Paginação
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, itemsPerPage]);
    return (
        <>
            {atualizarModal ? <AtualizarBoleto /> : null}
            {edit ? <EditRow /> : null} {/* Mantido apenas EditRow ou AtualizarBoleto, um dos dois, para evitar conflito */}
            {deleteModal ? <DeleteModal /> : null}
            <div className='bodyTable'>
                <div
                    className="table-container" // Aplica a classe do CSS
                    style={{
                        marginRight: '30px',
                        transition: 'margin-left 0.3s ease',
                    }}
                >
                    {/* Cabeçalho de Pesquisa/Filtro */}
                    <div className="table-header">
                        <input
                            type="text"
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Pesquisar..."
                            className="p-inputtext" // Mantém a classe do PrimeReact para estilização base
                        />
                    </div>

                    {/* Tabela Principal */}
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Carregando dados...</p>
                    ) : (
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Nome do Boleto</th>
                                    <th>Valor Total do Boleto</th>
                                    <th>Parcela</th>
                                    <th>Valor da Parcela</th>
                                    <th>Vencimento</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTableData.length > 0 ? (
                                    currentTableData.map((item, index) => (
                                        <tr key={`${item.id}-${index}`}>
                                            <td>{item.tipoGasto}</td>
                                            <td style={{ color: '#2c5364' }}>R$ {parseFloat(item.valorTotal).toFixed(2)}</td>
                                            <td>{item.numeroParcela}/{item.totalParcelas}</td>
                                            <td style={{ color: '#9C703BFF' }}>
                                                R$ {parseFloat(item.valorParcela).toFixed(2).replace('.', ',')}
                                            </td>
                                            <td>
                                                {/* {item.vencimento} */}
                                                {new Intl.DateTimeFormat('pt-BR', {
                                                    timeZone: 'UTC',
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                }).format(new Date(item.vencimento))}
                                            </td>
                                            <td className="always-visible">
                                                <button className="action-button complete" onClick={() => handleAtualizar(item)}>
                                                    <MdOutlineDoneOutline />
                                                </button>
                                                <button className="action-button" onClick={() => openEditModal(item)}>
                                                    <FaEdit />
                                                </button>
                                                <button className="action-button delete" onClick={() => handleDelete(item)}>
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                            Nenhuma parcela encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    )}
                </div>

                {/* Paginação */}
                <div className="pagination-container">
                    <button
                        className="pagination-button"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="pagination-button"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Próxima
                    </button>
                    <span className="page-info">
                        Página {currentPage} de {totalPages}
                    </span>
                </div>
            </div>
        </>
    );
}