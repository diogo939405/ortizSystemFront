export default async function PatchBoletos({ formData }) {
    const url = import.meta.env.VITE_API_EDIT_BOLETOS;
    const idBoleto = localStorage.getItem('idBoleto')
    // console.log(boletoDataId, idBoleto)
    // const limparValorMonetario = (valorString) => {
    //     if (!valorString) return 0;

    //     const valorComoString = String(valorString);

    //     return (
    //         parseFloat(
    //             valorComoString.replace('R$', '').replace(/\./g, '').replace(',', '.')
    //         ) || 0
    //     );
    // };

    try {
        const finalUrl = `${url}/${idBoleto}/parcelas`;
        const bodyData = {
            parcelas: formData?.parcelas
        };

        const response = await fetch(finalUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        });

        const responseData = await response.json(); // ✅ Só depois disso pode usar a variável


        if (response.ok) {
            return true;
        } else {
            console.log('Erro ao salvar boleto atualizado:', responseData);
            return false;
        }
    } catch (error) {
        console.error('Erro na requisição PATCH:', error.message);
        return false;
    }

}



