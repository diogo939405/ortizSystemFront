import React from 'react'

export default async function DeleteBoleto() {
    const url = import.meta.env.VITE_API_DELETE_BOLETO
    const idBoleto = localStorage.getItem('idBoletoDelete');
    console.log('idBoleto', idBoleto)
    try {
        const res = await fetch(`${url}/${idBoleto}`, {
            method: "Delete",
            headers: { "Content-Type": "application/json" },
        })
        console.log('res', res)
        if (res.ok) {
            console.log('deletado com sucesso')
            return true
        }
    } catch (err) {
        console.log('error ao deletar', err.message)
    }
}
