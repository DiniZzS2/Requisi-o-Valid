const REGRAS = {
    camiseta: 6, 
    bota: 9      
};

const ultimaRetirada = {
    camiseta: new Date('2025-12-10'), // Bloqueado
    bota: new Date('2025-05-15')      // Liberado
};

function inicializarDashboard() {
    verificarItem('camiseta', ultimaRetirada.camiseta, REGRAS.camiseta);
    verificarItem('bota', ultimaRetirada.bota, REGRAS.bota);
}

function verificarItem(item, dataUltima, mesesRegra) {
    const dataAtual = new Date();
    
    let diferencaMeses = (dataAtual.getFullYear() - dataUltima.getFullYear()) * 12;
    diferencaMeses -= dataUltima.getMonth();
    diferencaMeses += dataAtual.getMonth();

    const btnPadrao = document.getElementById(`btn-padrao-${item}`);
    const statusBox = document.getElementById(`status-box-${item}`);
    const statusTexto = document.getElementById(`status-texto-${item}`);
    const icone = document.getElementById(`icon-${item}`);

    if (diferencaMeses >= mesesRegra) {
        btnPadrao.disabled = false;
        icone.textContent = "check_circle"; // Ícone Google
        statusTexto.textContent = `Elegível. Última retirada há ${diferencaMeses} meses.`;
        statusBox.className = "status-box liberado";
    } else {
        const mesesFaltantes = mesesRegra - diferencaMeses;
        btnPadrao.disabled = true;
        icone.textContent = "block"; // Ícone Google
        statusTexto.textContent = `Bloqueado. Faltam ${mesesFaltantes} meses.`;
        statusBox.className = "status-box bloqueado";
    }
}

window.onload = inicializarDashboard;