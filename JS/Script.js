/**
 * ============================================================================
 * VALID UNIFORMES — CORE SYSTEM ARQUITETURA SÊNIOR
 * ============================================================================
 */

const AppConfig = {
    regrasCotas: { camiseta: 6, calca: 6, bota: 9, moletom: 12 },
    limitesQuantidade: { camiseta: 2, calca: 2, bota: 1, moletom: 1 },
    historicoRetiradas: {
        camiseta: new Date('2025-12-10'),
        calca: new Date('2025-08-15'),
        bota: new Date('2025-05-15'),
        moletom: new Date('2026-02-20')
    }
};

const AppState = {
    matriculaAtual: localStorage.getItem('user_matricula') || null,
    papelUsuario: localStorage.getItem('user_role') || null,
    itemSelecionadoParaExcecao: '',
    itemConfirmandoCota: ''
};

const AuthModule = {
    login: () => {
        const inputMatricula = document.getElementById('matricula');
        const inputSenha = document.getElementById('senha');
        if (!inputMatricula || !inputSenha) return;

        const matricula = inputMatricula.value.trim();
        const senha = inputSenha.value.trim();

        if (!matricula) return UI.mostrarErroInput(inputMatricula);
        if (!senha) return UI.mostrarErroInput(inputSenha);

        if (matricula === '123' && senha !== '321') {
            alert("Senha incorreta para perfil de Gestor. Use a senha 321.");
            return UI.mostrarErroInput(inputSenha);
        }
        if (matricula === '1234' && senha !== '4321') {
            alert("Senha incorreta para perfil de Almoxarifado. Use a senha 4321.");
            return UI.mostrarErroInput(inputSenha);
        }

        let role = 'colaborador';
        if (matricula === '123') role = 'gestor';
        if (matricula === '1234') role = 'almoxarifado';

        localStorage.setItem('user_matricula', matricula);
        localStorage.setItem('user_role', role);
        window.location.href = 'index.html';
    },
    logout: () => {
        localStorage.removeItem('user_matricula');
        localStorage.removeItem('user_role');
        window.location.href = 'login.html';
    }
};

const UI = {
    mostrarErroInput: (elemento) => {
        elemento.style.borderColor = 'var(--danger)';
        elemento.focus();
    },
    mostrarToast: (mensagem) => {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        if (!toast || !toastMsg) return;
        toastMsg.textContent = mensagem;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    },
    inicializarParticulasLogin: () => {
        const body = document.querySelector('.login-body');
        if (!body) return;
        const fragmento = document.createDocumentFragment();
        const colors = ['rgba(255,255,255,0.04)', 'rgba(61,155,255,0.06)', 'rgba(100,200,255,0.04)'];
        for (let i = 0; i < 14; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 50 + 10;
            p.style.cssText = `width: ${size}px; height: ${size}px; left: ${Math.random() * 100}%; bottom: ${Math.random() * -20}%; background: ${colors[Math.floor(Math.random() * colors.length)]}; animation-duration: ${Math.random() * 12 + 8}s; animation-delay: ${Math.random() * 8}s;`;
            fragmento.appendChild(p);
        }
        body.appendChild(fragmento);
    },
    inicializarScrollReveal: () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('visible'), i * 100);
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.uniform-card').forEach(c => observer.observe(c));
    },
    configurarMenuGlobal: () => {
        const btnMenu = document.getElementById('btn-menu-hamburguer');
        const sidebar = document.getElementById('sidebar-menu');
        const sidebarContent = document.getElementById('sidebar-content');
        const btnFechar = document.getElementById('btn-fechar-menu');
        const injectContainer = document.getElementById('sidebar-links-inject');
        const btnLogout = document.getElementById('btn-sidebar-logout');

        if (!btnMenu || !sidebar || !injectContainer) return;

        const role = AppState.papelUsuario;
        let linksHTML = '';
        const paginaAtual = window.location.pathname.split("/").pop();

        if (role === 'almoxarifado') {
            linksHTML = `
                <button class="sidebar-link-btn ${paginaAtual === 'almoxarifado.html' ? 'active' : ''}" onclick="window.location.href='almoxarifado.html'"> Fila de Distribuição</button>
                <button class="sidebar-link-btn" onclick="alert('Abrindo tela do Figma: Dashboard de Consumo')"> Dashboard de Consumo</button>
                <button class="sidebar-link-btn ${paginaAtual === 'requisicao.html' ? 'active' : ''}" onclick="window.location.href='requisicao.html'"> Minhas Requisições</button>
                <button class="sidebar-link-btn ${paginaAtual === 'index.html' ? 'active' : ''}" onclick="window.location.href='index.html'">Página Inicial</button>
            `;
        } else if (role === 'gestor') {
            linksHTML = `
                <button class="sidebar-link-btn ${paginaAtual === 'gestor.html' ? 'active' : ''}" onclick="window.location.href='gestor.html'"> Pendências Equipe</button>
                <button class="sidebar-link-btn ${paginaAtual === 'requisicao.html' ? 'active' : ''}" onclick="window.location.href='requisicao.html'"> Minhas Requisições</button>
                <button class="sidebar-link-btn ${paginaAtual === 'index.html' ? 'active' : ''}" onclick="window.location.href='index.html'"> Página Inicial</button>
            `;
        } else {
            linksHTML = `
                <button class="sidebar-link-btn ${paginaAtual === 'requisicao.html' ? 'active' : ''}" onclick="window.location.href='requisicao.html'">Minhas Requisições</button>
                <button class="sidebar-link-btn ${paginaAtual === 'index.html' ? 'active' : ''}" onclick="window.location.href='index.html'">Página Inicial</button>
            `;
        }

        injectContainer.innerHTML = linksHTML;

        btnMenu.onclick = () => sidebar.classList.add('open');
        const fechar = () => sidebar.classList.remove('open');
        if (btnFechar) btnFechar.onclick = fechar;
        sidebar.onclick = (e) => { if (e.target === sidebar) fechar(); };
        if (btnLogout) btnLogout.onclick = AuthModule.logout;
    }
};

const DashboardModule = {
    inicializar: () => {
        if (!AppState.matriculaAtual) return window.location.href = 'login.html';
        const displayMatricula = document.getElementById('display-matricula');
        if (displayMatricula) displayMatricula.textContent = AppState.matriculaAtual;

        const btnGestor = document.getElementById('btn-gestor');
        if (btnGestor) {
            if (AppState.papelUsuario === 'gestor') {
                btnGestor.style.display = 'inline-block';
                btnGestor.textContent = "Painel Gestor";
                btnGestor.onclick = () => window.location.href = 'gestor.html';
            } else if (AppState.papelUsuario === 'almoxarifado') {
                btnGestor.style.display = 'inline-block';
                btnGestor.textContent = " Painel Almoxarifado";
                btnGestor.onclick = () => window.location.href = 'almoxarifado.html';
            }
        }

        DashboardModule.calcularCotas();
    },
    calcularCotas: () => {
        let cotasDisponiveis = 0;
        const chaves = Object.keys(AppConfig.regrasCotas);
        chaves.forEach((item, index) => {
            setTimeout(() => {
                if (DashboardModule.processarRegraItem(item)) cotasDisponiveis++;
                if (index === chaves.length - 1) {
                    const statCotas = document.getElementById('stat-cotas');
                    if (statCotas) statCotas.textContent = cotasDisponiveis;
                }
            }, index * 150 + 200);
        });
    },
    processarRegraItem: (itemKey) => {
        const dataUltima = AppConfig.historicoRetiradas[itemKey];
        const mesesRegra = AppConfig.regrasCotas[itemKey];
        const badge = document.getElementById(`badge-${itemKey}`);
        const statusContainer = document.getElementById('status-' + itemKey);
        const txtStatus = document.getElementById(`status-txt-${itemKey}`);
        const btnPadrao = document.getElementById(`btn-padrao-${itemKey}`);

        if (!badge || !statusContainer || !btnPadrao || !txtStatus) return false;
        badge.className = 'card-badge';
        statusContainer.className = 'card-status';

        const { elegivel, diffMeses } = Utils.calcularElegibilidade(dataUltima, mesesRegra);

        if (elegivel) {
            badge.classList.add('available'); badge.textContent = 'Disponível';
            statusContainer.classList.add('available'); txtStatus.textContent = 'Cota liberada para solicitação';
            btnPadrao.disabled = false;
            btnPadrao.onclick = () => { ConfirmationModalModule.abrir(itemKey); };
            return true;
        } else {
            badge.classList.add('blocked'); badge.textContent = 'Indisponível';
            statusContainer.classList.add('blocked');
            const mesesFaltantes = mesesRegra - diffMeses;
            txtStatus.textContent = `Próxima renovação em ${mesesFaltantes} mês${mesesFaltantes > 1 ? 'es' : ''}`;
            btnPadrao.disabled = true;
            return false;
        }
    }
};

const ConfirmationModalModule = {
    abrir: (itemKey) => {
        AppState.itemConfirmandoCota = itemKey;
        const modal = document.getElementById('modalConfirmacaoCota');
        const selectQtd = document.getElementById('confirm-quantidade');
        const titleItem = document.getElementById('confirm-item-nome');

        if (!modal || !selectQtd || !titleItem) return;

        titleItem.innerHTML = `Item: <strong>${itemKey.toUpperCase()}</strong>`;
        
        const limiteMax = AppConfig.limitesQuantidade[itemKey] || 1;
        selectQtd.innerHTML = '';
        for (let i = 1; i <= limiteMax; i++) {
            selectQtd.innerHTML += `<option value="${i}">${i} unidade${i > 1 ? 's' : ''}</option>`;
        }

        modal.classList.add('open');
    },
    fechar: () => {
        const modal = document.getElementById('modalConfirmacaoCota');
        if (modal) modal.classList.remove('open');
    },
    confirmar: () => {
        const itemKey = AppState.itemConfirmandoCota;
        const selectElement = document.getElementById('confirm-quantidade');
        if (!selectElement) return;
        
        const qtdSelected = selectElement.value;
        const itemTextoFinal = `${itemKey.toUpperCase()} (x${qtdSelected})`;
        
        AlmoxarifadoModule.criarPedidoAlmoxarifado(AppState.matriculaAtual, itemTextoFinal, 'Cota Padrão');
        Utils.salvarNoHistoricoGeral(AppState.matriculaAtual, itemKey.toUpperCase(), `Cota Padrão (x${qtdSelected})`, 'No Almoxarifado');

        ConfirmationModalModule.fechar();
        UI.mostrarToast('Cota padrão reservada com sucesso!');
        
        const btnPadrao = document.getElementById(`btn-padrao-${itemKey}`);
        if(btnPadrao) btnPadrao.disabled = true;
        const badge = document.getElementById(`badge-${itemKey}`);
        const statusContainer = document.getElementById(`status-${itemKey}`);
        const txtStatus = document.getElementById(`status-txt-${itemKey}`);
        if(badge) { badge.className = 'card-badge blocked'; badge.textContent = 'Indisponível'; }
        if(statusContainer) { statusContainer.className = 'card-status blocked'; if(txtStatus) txtStatus.textContent = 'Aguardando retirada no balcão'; }
    }
};

const ModalModule = {
    abrir: (nomeItem) => {
        AppState.itemSelecionadoParaExcecao = nomeItem;
        const modal = document.getElementById('modalEmergencia');
        const modalNome = document.getElementById('modal-item-nome');
        if (modal && modalNome) {
            modalNome.innerHTML = `Item: <strong>${nomeItem}</strong>`;
            modal.querySelector('#justificativaTexto').value = '';
            modal.classList.add('open');
        }
    },
    fechar: () => {
        const modal = document.getElementById('modalEmergencia');
        if (modal) modal.classList.remove('open');
    },
    enviar: () => {
        const modal = document.getElementById('modalEmergencia');
        const textarea = modal.querySelector('#justificativaTexto');
        const motivoSelect = modal.querySelector('#motivoEmergencia');
        
        if (!textarea) return;
        const texto = textarea.value.trim();

        if (texto.length < 10) {
            UI.mostrarErroInput(textarea);
            alert("Descreva com mais detalhes o motivo da solicitação.");
            return;
        }

        const itemNome = AppState.itemSelecionadoParaExcecao;
        const novoPedido = {
            id: Date.now(),
            matricula: AppState.matriculaAtual,
            item: itemNome,
            motivo: motivoSelect ? motivoSelect.options[motivoSelect.selectedIndex].text : 'Exceção',
            justificativa: texto,
            data: new Date().toLocaleDateString('pt-BR')
        };

        let listaPedidos = JSON.parse(localStorage.getItem('pendencias_valid')) || [];
        listaPedidos.push(novoPedido);
        localStorage.setItem('pendencias_valid', JSON.stringify(listaPedidos));

        Utils.salvarNoHistoricoGeral(AppState.matriculaAtual, itemNome, `Exceção: ${novoPedido.motivo}`, 'Pendente com Gestor');

        ModalModule.fechar();
        UI.mostrarToast(`Exceção enviada com sucesso ao Gestor!`);
    }
};

const GestorModule = {
    inicializar: () => {
        if (AppState.papelUsuario !== 'gestor') return window.location.href = 'index.html';
        const displayMatricula = document.getElementById('display-matricula');
        if (displayMatricula) displayMatricula.textContent = AppState.matriculaAtual;
        GestorModule.renderizarPendencias();
    },
    renderizarPendencias: () => {
        const container = document.getElementById('lista-pendencias');
        if (!container) return;

        let listaPedidos = JSON.parse(localStorage.getItem('pendencias_valid')) || [];

        if (listaPedidos.length === 0) {
            container.innerHTML = `<div class="empty-state-gestor"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 4L12 14.01l-3-3" stroke-linecap="round" stroke-linejoin="round"/></svg><h3>Nenhuma pendência</h3><p>Sua equipe está com as cotas em dia.</p></div>`;
            return;
        }

        container.innerHTML = "";
        listaPedidos.forEach((pedido, i) => {
            const animationDelay = i * 0.1;
            container.innerHTML += `
                <div class="uniform-card visible" style="animation: slideUp 0.6s ease ${animationDelay}s both;">
                    <div class="card-header">
                        <div class="card-icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>
                        <span class="card-badge" style="background: rgba(0, 180, 216, 0.15); color: var(--cyan);">Matrícula: ${pedido.matricula}</span>
                    </div>
                    <div class="card-title">${pedido.item}</div>
                    <div class="card-meta">Motivo: <strong>${pedido.motivo}</strong><br>Solicitado em: ${pedido.data}</div>
                    <div class="card-status" style="background: rgba(255, 255, 255, 0.05); align-items: flex-start; height: auto;">
                        <span class="status-dot" style="background: var(--warning-bg); margin-top: 5px;"></span>
                        <span style="font-style: italic; color: rgba(255, 255, 255, 0.85);">"${pedido.justificativa}"</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-request success" onclick="GestorModule.resolverPedido(${pedido.id}, true)">Aprovar Solicitação</button>
                        <button class="btn-request danger" onclick="GestorModule.resolverPedido(${pedido.id}, false)">Recusar Pedido</button>
                    </div>
                </div>`;
        });
    },
    resolverPedido: (id, aprovado) => {
        let listaPedidos = JSON.parse(localStorage.getItem('pendencias_valid')) || [];
        const pedido = listaPedidos.find(p => p.id === id);

        if (pedido) {
            if (aprovado) {
                AlmoxarifadoModule.criarPedidoAlmoxarifado(pedido.matricula, pedido.item, `Exceção: ${pedido.motivo}`);
                Utils.atualizarStatusHistoricoGeral(pedido.matricula, pedido.item, 'No Almoxarifado');
            } else {
                Utils.atualizarStatusHistoricoGeral(pedido.matricula, pedido.item, 'Recusado pelo Gestor');
            }
        }

        listaPedidos = listaPedidos.filter(p => p.id !== id);
        localStorage.setItem('pendencias_valid', JSON.stringify(listaPedidos));
        UI.mostrarToast(aprovado ? "Solicitação Aprovada!" : "Solicitação Recusada.");
        GestorModule.renderizarPendencias();
    }
};

const AlmoxarifadoModule = {
    inicializar: () => {
        if (AppState.papelUsuario !== 'almoxarifado') return window.location.href = 'index.html';
        const displayMatricula = document.getElementById('display-matricula');
        if (displayMatricula) displayMatricula.textContent = AppState.matriculaAtual;
        AlmoxarifadoModule.renderizarFilaAlmox();
    },
    criarPedidoAlmoxarifado: (matricula, item, tipo) => {
        let filaAlmox = JSON.parse(localStorage.getItem('almox_valid')) || [];
        filaAlmox.push({
            id: Date.now(),
            matricula: matricula,
            item: item,
            tipo: tipo,
            data: new Date().toLocaleDateString('pt-BR')
        });
        localStorage.setItem('almox_valid', JSON.stringify(filaAlmox));
    },
    renderizarFilaAlmox: () => {
        const container = document.getElementById('lista-almoxarifado');
        if (!container) return;

        let filaAlmox = JSON.parse(localStorage.getItem('almox_valid')) || [];

        if (filaAlmox.length === 0) {
            container.innerHTML = `<div class="empty-state-gestor"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 4L12 14.01l-3-3" stroke-linecap="round" stroke-linejoin="round"/></svg><h3>Fila limpa</h3><p>Nenhum uniforme aguardando distribuição no balcão.</p></div>`;
            return;
        }

        container.innerHTML = "";
        filaAlmox.forEach((pedido, i) => {
            const animationDelay = i * 0.1;
            container.innerHTML += `
                <div class="uniform-card visible" style="animation: slideUp 0.6s ease ${animationDelay}s both;">
                    <div class="card-header">
                        <div class="card-icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        </div>
                        <span class="card-badge" style="background: rgba(0, 180, 216, 0.15); color: var(--cyan);">Matrícula: ${pedido.matricula}</span>
                    </div>
                    <div class="card-title">${pedido.item}</div>
                    <div class="card-meta">Origem: <strong>${pedido.tipo}</strong><br>Liberado em: ${pedido.data}</div>
                    <div class="card-status available">
                        <span class="status-dot"></span>
                        <span>Pronto para Entrega Física</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-request success" onclick="AlmoxarifadoModule.resolverDistribuicao(${pedido.id}, '${pedido.matricula}', '${pedido.item}', 'Entregue')">Confirmar Entrega (Baixa)</button>
                        <button class="btn-request danger" onclick="AlmoxarifadoModule.resolverDistribuicao(${pedido.id}, '${pedido.matricula}', '${pedido.item}', 'Devolvido')">Recusar / Devolver</button>
                    </div>
                </div>`;
        });
    },
    resolverDistribuicao: (id, matricula, itemNome, statusFinal) => {
        let filaAlmox = JSON.parse(localStorage.getItem('almox_valid')) || [];
        filaAlmox = filaAlmox.filter(p => p.id !== id);
        localStorage.setItem('almox_valid', JSON.stringify(filaAlmox));
        
        Utils.atualizarStatusHistoricoGeral(matricula, itemNome, statusFinal);

        UI.mostrarToast(`Item marcado como ${statusFinal}!`);
        AlmoxarifadoModule.renderizarFilaAlmox();
    }
};

const HistoricoUsuarioModule = {
    inicializar: () => {
        const displayMatricula = document.getElementById('display-matricula');
        if (displayMatricula) displayMatricula.textContent = AppState.matriculaAtual;
        HistoricoUsuarioModule.renderizarLista();
    },
    renderizarLista: () => {
        const container = document.getElementById('lista-historico-usuario');
        if (!container) return;

        let todosHistoricos = JSON.parse(localStorage.getItem('historico_global_valid')) || [];
        let meuHistorico = todosHistoricos.filter(h => h.matricula === AppState.matriculaAtual);

        if (meuHistorico.length === 0) {
            container.innerHTML = `<div class="empty-state-gestor"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><h3>Histórico limpo</h3><p>Você ainda não possui solicitações registradas.</p></div>`;
            return;
        }

        container.innerHTML = "";
        meuHistorico.reverse().forEach((req, i) => {
            let classTracking = 'pendente-gestor';
            if (req.status === 'No Almoxarifado') classTracking = 'no-almox';
            if (req.status === 'Entregue') classTracking = 'entregue';
            if (req.status.startsWith('Recusado') || req.status === 'Devolvido') classTracking = 'recusado';

            container.innerHTML += `
                <div class="uniform-card visible" style="animation: slideUp 0.5s ease ${i*0.05}s both;">
                    <div class="card-header">
                        <div class="card-icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <span class="status-badge-tracking ${classTracking}">${req.status}</span>
                    </div>
                    <div class="card-title">${req.item}</div>
                    <div class="card-meta">Tipo: <strong>${req.tipo}</strong><br>Atualizado em: ${req.data}</div>
                </div>
            `;
        });
    }
};

const Utils = {
    calcularElegibilidade: (dataAntiga, mesesRegra) => {
        if (!dataAntiga) return { elegivel: true, diffMeses: 0 };
        const hoje = new Date();
        let diffMeses = (hoje.getFullYear() - dataAntiga.getFullYear()) * 12;
        diffMeses -= dataAntiga.getMonth(); diffMeses += hoje.getMonth();
        if (hoje.getDate() < dataAntiga.getDate()) diffMeses--;
        return { elegivel: diffMeses >= mesesRegra, diffMeses: diffMeses };
    },
    salvarNoHistoricoGeral: (matricula, item, tipo, status) => {
        let historico = JSON.parse(localStorage.getItem('historico_global_valid')) || [];
        historico.push({
            matricula: matricula,
            item: item,
            tipo: tipo,
            status: status,
            data: new Date().toLocaleDateString('pt-BR')
        });
        localStorage.setItem('historico_global_valid', JSON.stringify(historico));
    },
    atualizarStatusHistoricoGeral: (matricula, item, novoStatus) => {
        let historico = JSON.parse(localStorage.getItem('historico_global_valid')) || [];
        const cleanItemName = item.split(' ')[0].toUpperCase();
        for (let i = historico.length - 1; i >= 0; i--) {
            if (historico[i].matricula === matricula && historico[i].item.toUpperCase().startsWith(cleanItemName)) {
                historico[i].status = novoStatus;
                historico[i].data = new Date().toLocaleDateString('pt-BR');
                break;
            }
        }
        localStorage.setItem('historico_global_valid', JSON.stringify(historico));
    }
};

// ==========================================
// BINDINGS DE EVENTOS E INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    UI.configurarMenuGlobal();

    if (document.querySelector('.login-body')) {
        UI.inicializarParticulasLogin();
        const formLogin = document.getElementById('form-login');
        if (formLogin) { formLogin.addEventListener('submit', (e) => { e.preventDefault(); AuthModule.login(); }); }
    }

    if (document.getElementById('section-uniformes')) {
        UI.inicializarScrollReveal();
        DashboardModule.inicializar();
        
        // ==============================================================
        // ISOLAMENTO DE BOTÕES (O que corrigiu o erro da mensagem passada)
        // ==============================================================
        const btnSubmitExcecao = document.getElementById('btn-enviar-excecao');
        if (btnSubmitExcecao) btnSubmitExcecao.onclick = ModalModule.enviar;
        
        const btnSubmitConfirm = document.getElementById('btn-enviar-confirmacao-cota');
        if (btnSubmitConfirm) btnSubmitConfirm.onclick = ConfirmationModalModule.confirmar;

        const modalEmergencia = document.getElementById('modalEmergencia');
        if (modalEmergencia) {
            modalEmergencia.onclick = (e) => { if (e.target === modalEmergencia) ModalModule.fechar(); };
            const closeBtnExcecao = modalEmergencia.querySelector('#btn-close-excecao');
            if (closeBtnExcecao) closeBtnExcecao.onclick = ModalModule.fechar;
        }
        
        const modalConfirmacao = document.getElementById('modalConfirmacaoCota');
        if (modalConfirmacao) {
            modalConfirmacao.onclick = (e) => { if (e.target === modalConfirmacao) ConfirmationModalModule.fechar(); };
            const closeBtnConfirm = modalConfirmacao.querySelector('#btn-close-confirm');
            if (closeBtnConfirm) closeBtnConfirm.onclick = ConfirmationModalModule.fechar;
        }

        document.querySelectorAll('.btn-request.secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dataItem = btn.getAttribute('data-item');
                const cardTitle = dataItem || e.currentTarget.closest('.uniform-card').querySelector('.card-title').textContent;
                ModalModule.abrir(cardTitle);
            });
        });
        
        const btnLogout = document.getElementById('btn-sair');
        if (btnLogout) btnLogout.addEventListener('click', AuthModule.logout);
    }

    if (document.getElementById('lista-pendencias')) { GestorModule.inicializar(); }
    if (document.getElementById('lista-almoxarifado')) { AlmoxarifadoModule.inicializar(); }
    if (document.getElementById('lista-historico-usuario')) { HistoricoUsuarioModule.inicializar(); }
});

window.GestorModule = GestorModule;
window.AlmoxarifadoModule = AlmoxarifadoModule;