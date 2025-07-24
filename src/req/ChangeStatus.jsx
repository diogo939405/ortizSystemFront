export default async function ChangeStatus({ formData }) {
    const url = import.meta.env.VITE_API_PATCH_STATUS;
    const idBoleto = localStorage.getItem('idBoletoAtualizar');
    console.log(idBoleto, formData);

    try {
        const res = await fetch(`${url}/${idBoleto}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numeroParcela: formData?.numeroParcela,
                observacao: formData?.parcelas?.find(p => p.numeroParcela === formData?.numeroParcela)?.observacao,
                status: 'pago'
            })
        });

        if (res.ok) {
            return true;
        } else {
            console.error('Erro ao atualizar status da parcela.');
            return false;
        }

    } catch (error) {
        console.error('Erro na requisição PATCH:', error.message);
        return false;
    }
}
