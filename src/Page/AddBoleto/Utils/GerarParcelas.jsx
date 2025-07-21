export function GerarParcelas(valorTotal, quantidade, vencimentoInicial) {
    const parcelas = [];
    const rawValor = parseFloat(valorTotal.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    const valorParcela = +(rawValor / quantidade).toFixed(2);
    let vencimento = new Date(vencimentoInicial);

    for (let i = 1; i <= quantidade; i++) {
        parcelas.push({
            numeroParcela: i,
            valor: `R$ ${valorParcela.toFixed(2).replace('.', ',')}`,
            vencimento: vencimento.toISOString(),
            status: false
        });
        vencimento.setMonth(vencimento.getMonth() + 1);
    }

    return parcelas;
}

