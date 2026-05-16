const AppConfig = {
    regrasCotas: { camiseta: 6, calca: 6, bota: 9, moletom: 12 },
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
    itemSelecionadoParaExcecao: ''
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

        // REGRA DE SENHA CORRIGIDA:
        if (matricula === '123' && senha !== '321') {
            UI.mostrarErroInput(inputSenha);
            alert("Senha incorreta para o perfil de Gestor. Use a senha 321.");
            return;
        }

        localStorage.setItem('user_matricula', matricula);
        localStorage.setItem('user_role', matricula === '123' ? 'gestor' : 'colaborador');
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
            p.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${Math.random() * 100}%; bottom: ${Math.random() * -20}%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-duration: ${Math.random() * 12 + 8}s;
                animation-delay: ${Math.random() * 8}s;
            `;
            fragmento.appendChild(p);
        }
        body.appendChild(fragmento);
    },
    inicializarScrollReveal: () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
            }, { passive: true });
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
    }
};

const DashboardModule = {
    inicializar: () => {
        if (!AppState.matriculaAtual) return window.location.href = 'login.html';

        const displayMatricula = document.getElementById('display-matricula');
        if (displayMatricula) displayMatricula.textContent = AppState.matriculaAtual;

        if (AppState.papelUsuario === 'gestor') {
            const btnGestor = document.getElementById('btn-gestor');
            if (btnGestor) {
                btnGestor.style.display = 'inline-block';
                btnGestor.addEventListener('click', () => window.location.href = 'gestor.html');
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
            }, index * 200 + 400);
        });
    },
    processarRegraItem: (itemKey) => {
        const dataUltima = AppConfig.historicoRetiradas[itemKey];
        const mesesRegra = AppConfig.regrasCotas[itemKey];
        const badge = document.getElementById(`badge-${itemKey}`);
        const statusContainer = document.getElementById(`status-${itemKey}`);
        const txtStatus = document.getElementById(`status-txt-${itemKey}`);
        const btnPadrao = document.getElementById(`btn-padrao-${itemKey}`);

        if (!badge || !statusContainer) return false;
        badge.classList.remove('loading');
        statusContainer.classList.remove('loading');

        const { elegivel, diffMeses } = Utils.calcularElegibilidade(dataUltima, mesesRegra);

        if (elegivel) {
            badge.classList.add('available'); badge.textContent = 'Disponível';
            statusContainer.classList.add('available'); txtStatus.textContent = 'Cota liberada para solicitação';
            btnPadrao.disabled = false;
            
            // Botão de solicitar cota padrão
            btnPadrao.onclick = () => {
                UI.mostrarToast('Cota padrão solicitada com sucesso!');
                btnPadrao.disabled = true;
                badge.className = 'card-badge blocked'; badge.textContent = 'Indisponível';
                statusContainer.className = 'card-status blocked'; txtStatus.textContent = 'Cota recém retirada';
            };
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

const ModalModule = {
    abrir: (nomeItem) => {
        AppState.itemSelecionadoParaExcecao = nomeItem;
        const modal = document.getElementById('modalEmergencia');
        const modalNome = document.getElementById('modal-item-nome');
        if (modal && modalNome) {
            modalNome.innerHTML = `Item: <strong>${nomeItem}</strong>`;
            document.getElementById('justificativaTexto').value = '';
            modal.classList.add('open');
        }
    },
    fechar: () => {
        const modal = document.getElementById('modalEmergencia');
        if (modal) modal.classList.remove('open');
    },
    enviar: () => {
        const textarea = document.getElementById('justificativaTexto');
        const motivoSelect = document.getElementById('motivoEmergencia');
        const texto = textarea.value.trim();

        if (texto.length < 10) {
            UI.mostrarErroInput(textarea);
            alert("Descreva com mais detalhes o motivo da solicitação.");
            return;
        }

        // SALVANDO A PENDÊNCIA CORRETAMENTE
        const novoPedido = {
            id: Date.now(),
            matricula: AppState.matriculaAtual,
            item: AppState.itemSelecionadoParaExcecao,
            motivo: motivoSelect ? motivoSelect.options[motivoSelect.selectedIndex].text : 'Exceção',
            justificativa: texto,
            data: new Date().toLocaleDateString('pt-BR')
        };

        let listaPedidos = JSON.parse(localStorage.getItem('pendencias_valid')) || [];
        listaPedidos.push(novoPedido);
        localStorage.setItem('pendencias_valid', JSON.stringify(listaPedidos));

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
            container.innerHTML = `
                <div class="empty-state-gestor">
                    <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 4L12 14.01l-3-3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <h3>Nenhuma pendência</h3>
                    <p>Sua equipe está com as cotas em dia. Não há solicitações de exceção aguardando sua análise no momento.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";
        listaPedidos.forEach((pedido, i) => {
            const animationDelay = i * 0.1;
            
            // Usando exatamente a mesma estrutura de classes do index.html
            container.innerHTML += `
                <div class="uniform-card visible" style="animation: slideUp 0.6s ease ${animationDelay}s both;">
                    
                    <div class="card-header">
                        <div class="card-icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <span class="card-badge" style="background: #ffffff; color: #000000;">
                            Matrícula: ${pedido.matricula}
                        </span>
                    </div>
                    
                    <div class="card-title">${pedido.item}</div>
                    
                    <div class="card-meta">
                        Motivo: <strong>${pedido.motivo}</strong><br>
                        Solicitado em: ${pedido.data}
                    </div>
                    
                    <div class="card-actions">
                        <button class="btn-request success" onclick="GestorModule.resolverPedido(${pedido.id}, 'Aprovada')">
                            Aprovar Solicitação
                        </button>
                        <button class="btn-request danger" onclick="GestorModule.resolverPedido(${pedido.id}, 'Recusada')">
                            Recusar Pedido
                        </button>
                    </div>
            `;
        });
    },
    resolverPedido: (id, status) => {
        let listaPedidos = JSON.parse(localStorage.getItem('pendencias_valid')) || [];
        listaPedidos = listaPedidos.filter(pedido => pedido.id !== id);
        localStorage.setItem('pendencias_valid', JSON.stringify(listaPedidos));
        UI.mostrarToast(`Solicitação ${status}.`);
        GestorModule.renderizarPendencias();
    }
};

const Utils = {
    calcularElegibilidade: (dataAntiga, mesesRegra) => {
        if (!dataAntiga) return { elegivel: true, diffMeses: 0 };
        const hoje = new Date();
        let diffMeses = (hoje.getFullYear() - dataAntiga.getFullYear()) * 12;
        diffMeses -= dataAntiga.getMonth();
        diffMeses += hoje.getMonth();
        if (hoje.getDate() < dataAntiga.getDate()) diffMeses--;
        return { elegivel: diffMeses >= mesesRegra, diffMeses: diffMeses };
    }
};


// BINDINGS INICIAIS (Dispara quando a tela carrega)

document.addEventListener('DOMContentLoaded', () => {
    // TELA DE LOGIN
    if (document.querySelector('.login-body')) {
        UI.inicializarParticulasLogin();
        const formLogin = document.getElementById('form-login');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault(); 
                AuthModule.login();
            });
        }
    }

    // TELA PRINCIPAL (UNIFORMES)
    if (document.getElementById('section-uniformes')) {
        UI.inicializarScrollReveal();
        DashboardModule.inicializar();

        const btnModalSubmit = document.querySelector('.btn-modal-submit');
        if (btnModalSubmit) btnModalSubmit.addEventListener('click', ModalModule.enviar);

        const modalOverlay = document.getElementById('modalEmergencia');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) ModalModule.fechar(); });
            const closeBtn = document.querySelector('.modal-close');
            if (closeBtn) closeBtn.addEventListener('click', ModalModule.fechar);
        }

       
        document.querySelectorAll('.btn-request.secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cardTitle = e.currentTarget.closest('.uniform-card').querySelector('.card-title').textContent;
                ModalModule.abrir(cardTitle);
            });
        });

        const btnLogout = document.getElementById('btn-sair');
        if (btnLogout) btnLogout.addEventListener('click', AuthModule.logout);
    }

    // TELA DO GESTOR
    if (document.getElementById('lista-pendencias')) {
        GestorModule.inicializar();
        const btnLogout = document.getElementById('btn-sair');
        if (btnLogout) btnLogout.addEventListener('click', AuthModule.logout);
    }

    // Garante que o HTML consiga encontrar as funções de aprovação
    window.GestorModule = GestorModule;
});