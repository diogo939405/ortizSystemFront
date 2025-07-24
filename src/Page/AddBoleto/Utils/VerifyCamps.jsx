export default function VerifyCamps(newBoletoInfo) {
    if (
        !newBoletoInfo ||
        newBoletoInfo.tipoGasto === '' ||
        newBoletoInfo.valor === '' ||
        newBoletoInfo.qParcelas === ''
    ) {
        return false;
    }

    const parcelas = Array.isArray(newBoletoInfo.parcelas) ? newBoletoInfo.parcelas : [];

    const algumaParcelaInvalida = parcelas.some((parcela, i) => {
        const isInvalida =
            !parcela ||
            !parcela.valor ||
            !parcela.dataVencimento;

        if (isInvalida) {
            console.warn(`🚨 Parcela inválida [${i}]:`, parcela);
        }

        return isInvalida;
    });

    if (algumaParcelaInvalida) {
        console.log("Alguma parcela está inválida:", newBoletoInfo);
        return false;
    }

    const valorTotal = parseFloat(newBoletoInfo.valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    const valorTotalParcelas = parcelas.reduce((total, parcela) => {
        return total + parseFloat(parcela.valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    }, 0);

    if (isNaN(valorTotal) || isNaN(valorTotalParcelas)) {
        return false;
    }

    if (Math.abs(valorTotalParcelas - valorTotal) > 0.01) {
        return false;
    }

    return true;
}
