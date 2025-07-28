import { createContext, useState } from 'react';


export const TableContext = createContext();

export const TableProvider = ({ children }) => {
    const [boletosData, setBoletosData] = useState([]);
    const [boletoDataId, setBoletoDataId] = useState([]);
    const [boletoData, setBoletoData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false)
    const [atualizarModal, setAtualizarModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [boletoVencendo, setBoletoVencendo] = useState([]);
    const [boletoVencidos, setBoletoVencidos] = useState([]);

    return (
        <TableContext.Provider value={{
            boletosData, setBoletosData,
            loading, setLoading, filters, setFilters, globalFilterValue,
            setGlobalFilterValue, edit, setEdit, boletoDataId, setBoletoDataId, boletoData, setBoletoData, deleteModal, setDeleteModal,
            atualizarModal, setAtualizarModal, setBoletoVencendo, boletoVencendo, boletoVencidos, setBoletoVencidos

        }}>
            {children}
        </TableContext.Provider>
    )
}
