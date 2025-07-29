export default async function postBoletos(newBoletoInfo) {
    const url = import.meta.env.VITE_API_ADD_BOLETOS;

    console.log(newBoletoInfo);

    if (!Array.isArray(newBoletoInfo.parcelas)) {
        console.error("Parcelas inválidas.");
        return;
    }

    const limparValorMonetario = (valorString) => {
        if (!valorString) return 0;
        return parseFloat(
            valorString.replace('R$', '').replace(/\./g, '').replace(',', '.')
        ) || 0;
    };

    const payload = {

        tipoGasto: newBoletoInfo.tipoGasto,
        valor: limparValorMonetario(newBoletoInfo.valor),
        status: true,
        parcelas: Array.isArray(newBoletoInfo.parcelas)
            ? newBoletoInfo.parcelas.map((p, index) => ({
                tipoGasto: newBoletoInfo.tipoGasto,
                numeroParcela: index + 1,
                valor: limparValorMonetario(p.valor),
                vencimento: p.dataVencimento || "",
                status: 'Pendente',
                observacao: '',
            }))
            : [],
    };
    console.log("Payload final:", JSON.stringify(payload, null, 2));
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const responseData = await res.json();

        if (res.status === 201) {
            console.log("✅ Boleto criado com sucesso!");
            return true
        } else {
            console.error("❌ Erro no envio:", res.status, responseData);
            return false;
        }
    } catch (err) {
        console.error(" Erro ao enviar boleto:", err.message);
    }
};
