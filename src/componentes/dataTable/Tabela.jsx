import React, { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa'; // Importe os ícones do react-icons
import { MdOutlineDoneOutline } from "react-icons/md";

import GetBoletosById from '../../req/GetBoletosById';
import useTableContext from '../../contexts/UseTableContext';
import EditRow from './editRow/EditRow';
import './Tabela.css'; // Importe o arquivo CSS
import { Tag } from 'primereact/tag'; // Mantenha o Tag do PrimeReact se você quiser usá-lo

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

    // Adaptação da lógica de status para o seu Tag do PrimeReact
    const getStatusClass = (status) => {
        switch (status) {
            case true:
                return 'success'; // ✅ verde para true
            case false:
                return 'danger'; // ❌ vermelho para false
            default:
                return 'info'; // 🟦 fallback se for null/undefined
        }
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
            console.log('Boleto:', boleto);
            if (!boleto.parcelas || !Array.isArray(boleto.parcelas)) return [];
            const totalParcelas = boleto.parcelas.length;
            return boleto?.parcelas.map(parcela => ({
                id: boleto.id,
                idBoleto: boleto.idBoleto,
                tipoGasto: boleto.tipoGasto,
                valorTotal: boleto.valor,
                numeroParcela: parcela.numeroParcela,
                totalParcelas: totalParcelas,
                valorParcela: parseFloat(
                    parcela.valor.replace('R$', '').replace('.', '').replace(',', '.')
                ),
                vencimento: parcela.vencimento,
                status: parcela.status
            }));
        });
    }, [boletosData]);

    const handleDelete = (rowData) => {
        if (window.confirm(`Tem certeza que deseja excluir o boleto: ${rowData.codigo}?`)) {
            alert(`Excluir boleto: ${rowData.codigo} (ID: ${rowData.idBoleto})`);
            // Implemente a lógica de exclusão aqui (chamar API, remover do estado, etc.)
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
            const dateA = new Date(a.dataVencimento);
            const dateB = new Date(b.dataVencimento);
            return dateA - dateB; // menor para maior
        });

        // Paginação
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, itemsPerPage]);
    return (
        <>
            {edit ? <EditRow /> : null}
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
                                    <th>Tipo de Gasto</th>
                                    <th>Valor Total</th>
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
                                            <td>R$ {parseFloat(item.valorTotal).toFixed(2)}</td>
                                            <td>{item.numeroParcela}/{item.totalParcelas}</td>
                                            <td style={{ color: '#9C703BFF' }}>R$ {parseFloat(item.valorParcela).toFixed(2)}</td>
                                            <td>{new Date(item.vencimento).toLocaleDateString('pt-BR')}</td>
                                            <td className="always-visible">
                                                <button className="action-button complete">
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
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
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