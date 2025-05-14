document.addEventListener("DOMContentLoaded", () => {
  // Elementos DOM
  const searchInput = document.getElementById("searchInput")
  const clearSearchBtn = document.getElementById("clearSearch")
  const tabs = document.querySelectorAll(".tab")
  const gamesView = document.getElementById("gamesView")
  const longtermView = document.getElementById("longtermView")
  const matchesContainer = document.getElementById("matchesContainer")
  const noMatchesFound = document.getElementById("noMatchesFound")
  const searchQueryText = document.getElementById("searchQueryText")
  const clearSearchLink = document.getElementById("clearSearchBtn")
  const betAmountInput = document.getElementById("betAmount")
  const submitBetsBtn = document.getElementById("submitBets")
  const sumOddsDisplay = document.getElementById("sumOddsDisplay")
  const longtermBetsContainer = document.getElementById("longtermBetsContainer")
  const betCanvas = document.getElementById("betCanvas")
  const logo = document.querySelector(".logo")

  // Estado da aplicação
  let selectedOdds = {}
  let searchQuery = ""
  let activeTab = "gamesView"

  // Dados dos jogos
  const matches = [
    {
      id: "match1",
      date: "10 de mai. 18:30",
      title: "Mirassol FC SP vs SC Corinthians SP",
      teams: [
        { name: "Mirassol", choice: "1", odds: 3.19 },
        { name: "Empate", choice: "X", odds: 3.24 },
        { name: "Corinthians", choice: "2", odds: 2.4 },
      ],
    },
    {
      id: "match2",
      date: "10 de mai. 18:30",
      title: "Palmeiras vs Flamengo",
      teams: [
        { name: "Palmeiras", choice: "1", odds: 3.19 },
        { name: "Empate", choice: "X", odds: 3.24 },
        { name: "Flamengo", choice: "2", odds: 2.4 },
      ],
    },
    {
      id: "match3",
      date: "10 de mai. 18:30",
      title: "São Paulo vs Santos",
      teams: [
        { name: "São Paulo", choice: "1", odds: 3.19 },
        { name: "Empate", choice: "X", odds: 3.24 },
        { name: "Santos", choice: "2", odds: 2.4 },
      ],
    },
    {
      id: "match4",
      date: "10 de mai. 18:30",
      title: "Coritiba vs Athletico-PR",
      teams: [
        { name: "Coritiba", choice: "1", odds: 3.19 },
        { name: "Empate", choice: "X", odds: 3.24 },
        { name: "Athletico-PR", choice: "2", odds: 2.4 },
      ],
    },
    {
      id: "match5",
      date: "10 de mai. 18:30",
      title: "Fluminense vs Botafogo",
      teams: [
        { name: "Fluminense", choice: "1", odds: 3.19 },
        { name: "Empate", choice: "X", odds: 3.24 },
        { name: "Botafogo", choice: "2", odds: 2.4 },
      ],
    },
    {
      id: "match6",
      date: "10 de mai. 18:30",
      title: "Atlético-MG vs Cruzeiro",
      teams: [
        { name: "Atlético-MG", choice: "1", odds: 3.19 },
        { name: "Empate", choice: "X", odds: 3.24 },
        { name: "Cruzeiro", choice: "2", odds: 2.4 },
      ],
    },
    {
      id: "match7",
      date: "11 de mai. 16:00",
      title: "Real Madrid vs Barcelona",
      teams: [
        { name: "Real Madrid", choice: "1", odds: 2.1 },
        { name: "Empate", choice: "X", odds: 3.5 },
        { name: "Barcelona", choice: "2", odds: 3.2 },
      ],
    },
    {
      id: "match8",
      date: "11 de mai. 16:00",
      title: "Manchester City vs Liverpool",
      teams: [
        { name: "Man City", choice: "1", odds: 1.9 },
        { name: "Empate", choice: "X", odds: 3.6 },
        { name: "Liverpool", choice: "2", odds: 3.8 },
      ],
    },
    {
      id: "match9",
      date: "11 de mai. 13:30",
      title: "Bayern Munich vs Borussia Dortmund",
      teams: [
        { name: "Bayern", choice: "1", odds: 1.75 },
        { name: "Empate", choice: "X", odds: 3.8 },
        { name: "Dortmund", choice: "2", odds: 4.2 },
      ],
    },
    {
      id: "match10",
      date: "12 de mai. 15:45",
      title: "PSG vs Olympique Marseille",
      teams: [
        { name: "PSG", choice: "1", odds: 1.65 },
        { name: "Empate", choice: "X", odds: 3.9 },
        { name: "Marseille", choice: "2", odds: 4.5 },
      ],
    },
    {
      id: "match11",
      date: "12 de mai. 10:00",
      title: "Juventus vs AC Milan",
      teams: [
        { name: "Juventus", choice: "1", odds: 2.3 },
        { name: "Empate", choice: "X", odds: 3.2 },
        { name: "AC Milan", choice: "2", odds: 2.9 },
      ],
    },
    {
      id: "match12",
      date: "12 de mai. 12:15",
      title: "Ajax vs PSV Eindhoven",
      teams: [
        { name: "Ajax", choice: "1", odds: 2.4 },
        { name: "Empate", choice: "X", odds: 3.3 },
        { name: "PSV", choice: "2", odds: 2.7 },
      ],
    },
  ]

  // Inicialização
  renderMatches()
  loadLongtermBets()

  // Event Listeners
  // Logo click para recarregar a página
  logo.addEventListener("click", () => {
    window.location.reload()
  })

  // Navegação por abas
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-target")
      setActiveTab(target)
    })
  })

  // Pesquisa
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value
    toggleClearSearchButton()
    renderMatches()
  })

  clearSearchBtn.addEventListener("click", () => {
    searchQuery = ""
    searchInput.value = ""
    toggleClearSearchButton()
    renderMatches()
  })

  clearSearchLink.addEventListener("click", () => {
    searchQuery = ""
    searchInput.value = ""
    toggleClearSearchButton()
    renderMatches()
  })

  // Submeter apostas
  submitBetsBtn.addEventListener("click", submitBets)

  // Funções
  function setActiveTab(tabId) {
    activeTab = tabId

    // Atualizar classes das abas
    tabs.forEach((tab) => {
      if (tab.getAttribute("data-target") === tabId) {
        tab.classList.add("active")
      } else {
        tab.classList.remove("active")
      }
    })

    // Mostrar/esconder seções
    if (tabId === "gamesView") {
      gamesView.classList.remove("hidden")
      longtermView.classList.add("hidden")
    } else {
      gamesView.classList.add("hidden")
      longtermView.classList.remove("hidden")
      loadLongtermBets()
    }
  }

  function toggleClearSearchButton() {
    if (searchQuery) {
      clearSearchBtn.classList.remove("hidden")
    } else {
      clearSearchBtn.classList.add("hidden")
    }
  }

  function renderMatches() {
    // Filtrar jogos com base na pesquisa
    const filteredMatches = matches.filter((match) => {
      const query = searchQuery.toLowerCase()
      return (
        match.title.toLowerCase().includes(query) || match.teams.some((team) => team.name.toLowerCase().includes(query))
      )
    })

    // Limpar container
    matchesContainer.innerHTML = ""

    // Mostrar mensagem se não houver resultados
    if (filteredMatches.length === 0) {
      noMatchesFound.classList.remove("hidden")
      searchQueryText.textContent = searchQuery
    } else {
      noMatchesFound.classList.add("hidden")

      // Renderizar cards de jogos
      filteredMatches.forEach((match) => {
        const matchCard = document.createElement("div")
        matchCard.className = "match-card"
        matchCard.setAttribute("data-match-id", match.id)

        let teamsHtml = ""
        match.teams.forEach((team) => {
          const isSelected = selectedOdds[match.id]?.choice === team.choice
          teamsHtml += `
            <div class="odd-column">
              <label class="team-name">${team.name}</label>
              <button class="odd-button ${isSelected ? "selected" : ""}" 
                      data-match-id="${match.id}" 
                      data-choice="${team.choice}" 
                      data-odds="${team.odds}">
                ${team.choice} – ${team.odds}
              </button>
            </div>
          `
        })

        matchCard.innerHTML = `
          <p class="match-date">${match.date}</p>
          <h3 class="match-title">${match.title}</h3>
          <div class="odds-container">
            ${teamsHtml}
          </div>
        `

        matchesContainer.appendChild(matchCard)
      })

      // Adicionar event listeners aos botões de odds
      document.querySelectorAll(".odd-button").forEach((button) => {
        button.addEventListener("click", () => {
          const matchId = button.getAttribute("data-match-id")
          const choice = button.getAttribute("data-choice")
          const odds = Number.parseFloat(button.getAttribute("data-odds"))

          toggleOddSelection(matchId, choice, odds)
        })
      })
    }

    // Atualizar soma das odds
    updateSumOdds()
  }

  function toggleOddSelection(matchId, choice, odds) {
    // Se já estiver selecionado, desmarque
    if (selectedOdds[matchId]?.choice === choice) {
      delete selectedOdds[matchId]
    } else {
      // Caso contrário, selecione
      selectedOdds[matchId] = { choice, odds }
    }

    // Atualizar UI
    renderMatches()
  }

  function updateSumOdds() {
    const sum = Object.values(selectedOdds).reduce((acc, curr) => acc + curr.odds, 0)
    const amount = Number.parseFloat(betAmountInput.value) || 0
    const potential = (sum * amount).toFixed(2)
    sumOddsDisplay.textContent = `Odds totais: ${sum.toFixed(2)} | Retorno potencial: R$ ${potential}`
  }

  function submitBets() {
    const amount = Number.parseFloat(betAmountInput.value)

    if (isNaN(amount) || amount <= 0) {
      alert("Digite um valor válido para a aposta.")
      return
    }

    if (amount > 100) {
      alert("O valor máximo permitido para aposta é R$100,00.")
      return
    }

    if (Object.keys(selectedOdds).length === 0) {
      alert("Selecione ao menos uma odd.")
      return
    }

    // Preparar apostas
    const bets = matches
      .map((match) => {
        const selected = selectedOdds[match.id]
        if (!selected) return null

        // Encontrar o time selecionado
        const selectedTeam = match.teams.find((team) => team.choice === selected.choice)

        return {
          match: match.title,
          choice: selected.choice,
          odds: selected.odds,
          team: selectedTeam?.name || "",
        }
      })
      .filter((bet) => bet)

    // Salvar no localStorage
    localStorage.setItem("longtermBets", JSON.stringify(bets))

    // Navegar para aba de apostas
    setActiveTab("longtermView")
  }

  function loadLongtermBets() {
    const betsJson = localStorage.getItem("longtermBets")
    if (!betsJson) {
      longtermBetsContainer.innerHTML = '<p class="no-bets-message">Nenhuma aposta de longo prazo.</p>'
      return
    }

    const bets = JSON.parse(betsJson)
    if (bets.length === 0) {
      longtermBetsContainer.innerHTML = '<p class="no-bets-message">Nenhuma aposta de longo prazo.</p>'
      return
    }

    // Calcular totais
    const totalOdds = bets.reduce((acc, bet) => acc + bet.odds, 0)
    const amount = Number.parseFloat(betAmountInput.value) || 0
    const potential = (totalOdds * amount).toFixed(2)

    // Criar HTML para as apostas
    let betsHtml = ""
    bets.forEach((bet) => {
      betsHtml += `<p class="longterm-bet-item"><strong>${bet.match}</strong> ${bet.choice} - ${bet.team} (Odds: ${bet.odds})</p>`
    })

    // Renderizar card de apostas
    const longtermCard = document.createElement("div")
    longtermCard.className = "longterm-card"
    longtermCard.innerHTML = `
      <h3>Conjunto de Apostas (${bets.length})</h3>
      ${betsHtml}
      <hr class="longterm-divider">
      <p><strong>Odds totais:</strong> ${totalOdds.toFixed(2)}</p>
      <p><strong>Valor Apostado:</strong> R$ ${amount.toFixed(2)}</p>
      <p><strong>Potencial Retorno:</strong> R$ ${potential}</p>
      <div class="longterm-actions">
        <button id="deleteAllBets" class="delete-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          Excluir Todas
        </button>
        <button id="shareOnWhatsApp" class="share-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Enviar no WhatsApp
        </button>
      </div>
    `

    longtermBetsContainer.innerHTML = ""
    longtermBetsContainer.appendChild(longtermCard)

    // Adicionar event listeners aos botões
    document.getElementById("deleteAllBets").addEventListener("click", deleteAllBets)
    document.getElementById("shareOnWhatsApp").addEventListener("click", shareOnWhatsApp)
  }

  function deleteAllBets() {
    localStorage.removeItem("longtermBets")
    selectedOdds = {}
    betAmountInput.value = ""
    setActiveTab("gamesView")
    renderMatches()
  }

  // Gerar imagem das apostas
  function generateBetImage() {
    const canvas = betCanvas
    const ctx = canvas.getContext("2d")

    // Obter apostas
    const betsJson = localStorage.getItem("longtermBets")
    if (!betsJson) return null

    const bets = JSON.parse(betsJson)
    if (bets.length === 0) return null

    // Configurar tamanho do canvas
    canvas.width = 600
    canvas.height = 400 + bets.length * 60

    // Desenhar fundo
    ctx.fillStyle = "#333"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Desenhar cabeçalho
    ctx.fillStyle = "#222"
    ctx.fillRect(0, 0, canvas.width, 80)

    // Título - Agora apenas "VarzeaBet"
    ctx.font = "bold 40px Arial"
    ctx.textAlign = "center"
    ctx.fillStyle = "#f97316" // Laranja
    ctx.fillText("VarzeaBet", canvas.width / 2, 50)

    // Desenhar apostas
    ctx.font = "18px Arial"
    ctx.textAlign = "left"
    ctx.fillStyle = "white"

    bets.forEach((bet, index) => {
      const y = 120 + index * 60
      ctx.fillText(`Partida: ${bet.match}`, 30, y)
      ctx.fillText(`Escolha: ${bet.choice} - ${bet.team} (Odds: ${bet.odds})`, 30, y + 30)
    })

    // Desenhar linha divisória
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(30, 120 + bets.length * 60 + 20)
    ctx.lineTo(canvas.width - 30, 120 + bets.length * 60 + 20)
    ctx.stroke()

    // Desenhar resumo
    const amount = Number.parseFloat(betAmountInput.value || "0")
    const totalOdds = bets.reduce((acc, bet) => acc + bet.odds, 0)
    const potential = (totalOdds * amount).toFixed(2)

    const summaryY = 120 + bets.length * 60 + 60
    ctx.font = "bold 20px Arial"
    ctx.fillText(`Odds totais: ${totalOdds.toFixed(2)}`, 30, summaryY)
    ctx.fillText(`Valor Apostado: R$ ${amount.toFixed(2)}`, 30, summaryY + 40)
    ctx.fillText(`Potencial Retorno: R$ ${potential}`, 30, summaryY + 80)

    // Adicionar marca d'água
    ctx.font = "16px Arial"
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.textAlign = "center"
    ctx.fillText("Gerado por VarzeaBet - " + new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 40)

    return canvas.toDataURL("image/png")
  }

  // Compartilhar no WhatsApp como imagem
  function shareOnWhatsApp() {
  const imageUrl = generateBetImage()
  if (!imageUrl) {
    alert("Erro ao gerar imagem das apostas.")
    return
  }

  // Número em formato internacional (Brasil +55, DDD 11)
  const phone = "5511983281274"
  // Monta a URL de envio, colocando a dataURL como texto
  const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    "Veja minha aposta:\n" + imageUrl
  )}`

  // Abre nova janela apontando para o seu WhatsApp
  const newWindow = window.open(waUrl, "_blank")
  if (!newWindow) {
    alert("Seu navegador bloqueou a abertura de uma nova janela. Por favor, permita popups para este site.")
  }

    newWindow.document.write(`
      <html>
        <head>
          <title>VarzeaBet - Imagem da Aposta</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background-color: #121212;
              color: white;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            img {
              max-width: 100%;
              border: 2px solid #f97316;
              border-radius: 8px;
            }
            h2 {
              color: #f97316;
            }
            .instructions {
              background-color: #1c1c1c;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
              text-align: left;
            }
            .instructions ol {
              margin-left: 20px;
            }
            .whatsapp-button {
              background-color: #25d366;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 8px;
              font-size: 16px;
              cursor: pointer;
              margin-top: 20px;
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Sua aposta está pronta para compartilhar!</h2>
            <img src="${imageUrl}" alt="Aposta VarzeaBet" />
            
            <div class="instructions">
              <h3>Como compartilhar no WhatsApp:</h3>
              <ol>
                <li>Copie a imagem ou tire um print.</li>
                <li>Clique em Abrir o WhatsApp.</li>
                <li>Abra o WhatsApp e cole a imagem na conversa ou envie a Foto da aposta.</li>
              </ol>
            </div>
            
            <button class="whatsapp-button" onclick="window.open('https://web.whatsapp.com')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Abrir WhatsApp Web
            </button>
          </div>
        </body>
      </html>
    `)
    newWindow.document.close()
  }

  // Atualizar soma das odds quando o valor da aposta mudar
  betAmountInput.addEventListener("input", updateSumOdds)
})
