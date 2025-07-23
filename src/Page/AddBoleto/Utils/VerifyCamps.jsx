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

    const algumaParcelaInvalida = parcelas.some((parcela) => {
        return (
            !parcela ||
            parcela.valor === '' ||
            parcela.vencimento === '' ||
            parcela.status === ''
        );
    });

    if (algumaParcelaInvalida) {
        return false;
    }
    const valorTotal = parseFloat(newBoletoInfo.valor.replace('R$ ', '').replace(',', '.'));
    const valorTotalParcelas = parcelas.reduce((total, parcela) => {
        return total + parseFloat(parcela.valor.replace('R$ ', '').replace(',', '.'));
    }, 0);

    if (isNaN(valorTotal) || isNaN(valorTotalParcelas)) {
        return false;
    }

    if (Math.abs(valorTotalParcelas - valorTotal) > 0.01) { // tolerância
        return false;
    }


    return true;
}
