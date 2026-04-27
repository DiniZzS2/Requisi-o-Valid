// 1. LÓGICA DE LOGIN
function fazerLogin() {
    const mat = document.getElementById('matricula').value;
    if(!mat) return alert("Digite sua matrícula!");
    localStorage.setItem('user_matricula', mat);
    localStorage.setItem('user_role', mat === '123' ? 'gestor' : 'colaborador');
    window.location.href = 'index.html';
}

// 2. CONFIGURAÇÕES
const REGRAS = { camiseta: 6, calca: 6, bota: 9, moletom: 12 };
const ultimaRetirada = {
    camiseta: new Date('2025-12-10'), 
    calca: new Date('2025-08-15'),    
    bota: new Date('2025-05-15'),     
    moletom: new Date('2026-02-20')   
};

// 3. DASHBOARD
function inicializarDashboard() {
    const mat = localStorage.getItem('user_matricula') || "847291";
    const role = localStorage.getItem('user_role');
    
    document.getElementById('display-matricula').textContent = mat;
    if(role === 'gestor') document.getElementById('btn-gestor').style.display = 'block';

    Object.keys(REGRAS).forEach(item => {
        verificarItem(item, ultimaRetirada[item], REGRAS[item]);
    });
}

function verificarItem(item, dataUltima, mesesRegra) {
    const dataAtual = new Date();
    let diff = (dataAtual.getFullYear() - dataUltima.getFullYear()) * 12;
    diff -= dataUltima.getMonth();
    diff += dataAtual.getMonth();

    const btn = document.getElementById(`btn-padrao-${item}`);
    const box = document.getElementById(`status-box-${item}`);
    const txt = document.getElementById(`status-texto-${item}`);
    const ico = document.getElementById(`icon-${item}`);

    if (diff >= mesesRegra) {
        btn.disabled = false;
        ico.textContent = "check_circle";
        txt.textContent = `Elegível. Última há ${diff} meses.`;
        box.className = "status-box liberado";
    } else {
        ico.textContent = "block";
        txt.textContent = `Bloqueado. Faltam ${mesesRegra - diff} meses.`;
        box.className = "status-box bloqueado";
    }
}

// 4. MODAL
function abrirModal(nome) {
    document.getElementById('modal-item-nome').innerHTML = `Item: <strong>${nome}</strong>`;
    document.getElementById('modalEmergencia').style.display = 'flex';
}
function fecharModal() { document.getElementById('modalEmergencia').style.display = 'none'; }
function enviarEmergencia() {
    if(document.getElementById('justificativaTexto').value.length < 10) return alert("Justifique melhor o pedido.");
    alert("Solicitação enviada ao gestor!");
    fecharModal();
}

// INICIALIZAÇÃO
window.onload = () => {
    if(document.getElementById('card-camiseta')) inicializarDashboard();
};