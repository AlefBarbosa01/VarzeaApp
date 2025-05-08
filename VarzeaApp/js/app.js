document.addEventListener('DOMContentLoaded', () => {
    // 1) Abas de navegação
    document.querySelectorAll('.nav-tabs .tab').forEach(tab =>
      tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.target;
        document.querySelectorAll('main > section').forEach(sec =>
          sec.id === target ? sec.classList.remove('hidden') : sec.classList.add('hidden')
        );
        if (target === 'longtermView') loadLongtermBets();
      })
    );
  
    // 2) Seleção de odds e soma
    const sumDisplay = document.getElementById('sumOddsDisplay');
    function updateSumOdds() {
      const sum = Array.from(document.querySelectorAll('#gamesView .odds button.selected'))
        .reduce((acc, btn) => acc + parseFloat(btn.dataset.odds), 0);
      sumDisplay.textContent = `Odds totais: ${sum.toFixed(2)}`;
    }
    document.querySelectorAll('#gamesView .odds button').forEach(btn =>
      btn.addEventListener('click', () => {
        btn.closest('.odds').querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        updateSumOdds();
      })
    );
  
    // 3) Apostar Selecionadas — agrupa tudo num só card
    document.getElementById('submitAllBets').addEventListener('click', () => {
      const amountInput = document.getElementById('globalAmount');
      const value = parseFloat(amountInput.value);
      if (isNaN(value) || value <= 0) {
        alert('Digite um valor válido para a aposta.');
        return;
      }
      const amount = value.toFixed(2);
  
      // coleta apostas selecionadas
      const bets = Array.from(document.querySelectorAll('#gamesView .match-card'))
        .map(card => {
          const sel = card.querySelector('.odds button.selected');
          if (!sel) return null;
          return {
            match: card.dataset.match,
            choice: sel.dataset.choice,
            odds: parseFloat(sel.dataset.odds)
          };
        })
        .filter(b => b);
  
      if (!bets.length) {
        alert('Selecione ao menos uma odd.');
        return;
      }
  
      // salva no localStorage
      localStorage.setItem('longtermBets', JSON.stringify(bets));
  
      // navega para "Apostas de Longo Prazo"
      document.querySelector('.tab[data-target="longtermView"]').click();
    });
  
    // 4) Renderiza único card com Ações
    function loadLongtermBets() {
      const bets = JSON.parse(localStorage.getItem('longtermBets') || '[]');
      const container = document.getElementById('betsContainer');
      container.innerHTML = '';
  
      if (!bets.length) {
        container.innerHTML = '<p style="color:#fff; padding:1em;">Nenhuma aposta de longo prazo.</p>';
        return;
      }
  
      const div = document.createElement('div');
      div.className = 'match-card';
      div.innerHTML = `<h3>Conjunto de Apostas (${bets.length})</h3>`;
      bets.forEach(b =>
        div.innerHTML += `<p><strong>${b.match}</strong> — Escolha: ${b.choice} (Odds: ${b.odds})</p>`
      );
  
      const totalOdds = bets.reduce((acc, b) => acc + b.odds, 0).toFixed(2);
      const amount = document.getElementById('globalAmount').value;
      const potential = (totalOdds * amount).toFixed(2);
  
      div.innerHTML += `
        <hr style="border-color:#333; margin:1em 0;">
        <p><strong>Odds totais:</strong> ${totalOdds}</p>
        <p><strong>Valor Apostado:</strong> R$ ${amount}</p>
        <p><strong>Potencial Retorno:</strong> R$ ${potential}</p>
        <div class="actions-single">
          <button class="delete-all">Excluir Todas</button>
          <button class="share-all">Enviar no WhatsApp</button>
        </div>
      `;
      container.appendChild(div);
  
      // “Excluir Todas”
      div.querySelector('.delete-all').addEventListener('click', () => {
        localStorage.removeItem('longtermBets');
        document.getElementById('globalAmount').value = '';
        document.getElementById('sumOddsDisplay').textContent = 'Odds totais: 0.00';
        loadLongtermBets();
        document.querySelector('.tab[data-target="gamesView"]').click();
      });
  
      // “Enviar no WhatsApp”
      div.querySelector('.share-all').addEventListener('click', () => {
        let text = '*Conjunto de Apostas*%0A';
        bets.forEach(b => {
          text += `Partida: ${b.match}%0AEscolha: ${b.choice}%0AOdds: ${b.odds}%0A`;
        });
        text += `%0AValor: R$ ${amount}%0APotencial Retorno: R$ ${potential}`;
        window.open(
          'https://api.whatsapp.com/send?phone=5511983281274&text=' + text,
          '_blank'
        );
      });
    }
  });
  