export default async function PostBoletos({ newBoletoInfo }) {
    const url = import.meta.env.VITE_API_ADD_BOLETOS;

    // ✅ Confere se parcelas é um array
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
        idBoleto: newBoletoInfo.idBoleto || "",
        tipoGasto: newBoletoInfo.tipoGasto,
        codigo: newBoletoInfo.codigo,
        valor: limparValorMonetario(newBoletoInfo.valor),
        status: true,
        parcelas: newBoletoInfo.parcelas.map((p, index) => ({
            numeroParcela: index + 1,
            valor: limparValorMonetario(p.valor),
            vencimento: p.vencimento || p.dataVencimento || "",
            status: false
        })),
        createdAt: new Date().toISOString()
    };

    console.log("📦 Payload que será enviado:", payload);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const responseData = await res.json();

        if (res.status === 201) {
            console.log("✅ Boleto criado com sucesso!");
        } else {
            console.error("❌ Erro no envio:", res.status, responseData);
        }
    } catch (err) {
        console.error("❌ Erro ao enviar boleto:", err.message);
    }
}
