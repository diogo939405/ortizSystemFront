import { createContext, useState } from "react";
export const AddBoletoContext = createContext();


export default function AddBoletoProvider({ children }) {
    const [editParcelas, setEditParcelas] = useState(false);
    const [newBoletoInfo, setNewBoletoInfo] = useState({
        tipoGasto: "",
        valor: "",
        codigo: "2",
        dataVencimento: "",
        qParcelas: "",
        status: true,
        parcelas: []
    })
    return (
        <AddBoletoContext.Provider value={{ editParcelas, setEditParcelas, newBoletoInfo, setNewBoletoInfo }}>
            {children}
        </AddBoletoContext.Provider>
    )
}
