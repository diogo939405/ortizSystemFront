import React, { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importe os ícones do react-icons
import GetBoletosById from '../../req/GetBoletosById';
import useTableContext from '../../contexts/UseTableContext';
import EditRow from './editRow/EditRow';
import useSidebarContext from '../../contexts/UseSidebarContext';
import './Tabela.css'; // Importe o arquivo CSS
import { Tag } from 'primereact/tag'; // Mantenha o Tag do PrimeReact se você quiser usá-lo

export default function TabelaTeste() {
    const { sidebarOpen } = useSidebarContext();
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
    const itemsPerPage = 10; // Limite de 10 linhas por página

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

        if (data) {
            setBoletoDataId(data);
        }
        setLoading(false);
    };

    const handleDelete = (rowData) => {
        if (window.confirm(`Tem certeza que deseja excluir o boleto: ${rowData.codigo}?`)) {
            alert(`Excluir boleto: ${rowData.codigo} (ID: ${rowData.idBoleto})`);
            // Implemente a lógica de exclusão aqui (chamar API, remover do estado, etc.)
        }
    };
    const filteredData = useMemo(() => {
        if (!globalFilterValue) {
            return boletosData;
        }
        const lowerCaseFilter = globalFilterValue.toLowerCase();
        return boletosData.filter(item =>
            (item.idBoleto?.toString().toLowerCase().includes(lowerCaseFilter)) ||
            (item.codigo?.toLowerCase().includes(lowerCaseFilter)) ||
            (item.valor?.toString().toLowerCase().includes(lowerCaseFilter)) ||
            (item.tipoGasto?.toLowerCase().includes(lowerCaseFilter)) ||
            (item.status ? 'ativo' : 'inativo').includes(lowerCaseFilter)
        );
    }, [boletosData, globalFilterValue]);

    // Calcula o número total de páginas dos dados filtrados
    const totalPages = useMemo(() => {
        return Math.ceil(filteredData.length / itemsPerPage);
    }, [filteredData.length, itemsPerPage]);

    // Obtém os itens da página atual dos dados filtrados
    const currentTableData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, itemsPerPage]);

    return (
        <>
            {edit ? <EditRow /> : null} {/* Mantém seu modal de edição */}
            <div className='bodyTable'>
                <div
                    className="table-container" // Aplica a classe do CSS
                    style={{
                        marginLeft: sidebarOpen ? '0px' : '-80px',
                        marginRight: '30px',
                        transition: 'margin-left 0.3s ease',
                        // Remover as propriedades de height/width aqui, pois já estão no CSS da classe 'table-container'
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
                                {/* REMOVA QUALQUER ESPAÇO/QUEBRA DE LINHA AQUI */}
                                <tr>
                                    <th className="always-visible">ID Boleto</th>
                                    <th>Código Boleto</th>
                                    <th>Valor</th>
                                    <th>Tipo de Gasto</th>
                                    <th>Status</th>
                                    <th className="always-visible">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* CERTIFIQUE-SE DE QUE NÃO HÁ ESPAÇOS/QUEBRAS DE LINHA AQUI TAMBÉM */}
                                {currentTableData.length > 0 ? (
                                    currentTableData.map((item) => (
                                        <tr key={item.idBoleto}>
                                            <td className="always-visible">{item.idBoleto}</td>
                                            <td>{item.codigo}</td>
                                            <td>{item.valor}</td>
                                            <td>{item.tipoGasto}</td>
                                            <td>
                                                <Tag value={item.status ? 'Ativo' : 'Inativo'} severity={getStatusClass(item.status)} />
                                            </td>
                                            <td className="always-visible">
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
                                            Nenhum registro encontrado.
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