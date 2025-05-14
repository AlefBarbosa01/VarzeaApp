"use client"
import { useState, useEffect, useRef } from "react"
import { Search, Trash2 } from "lucide-react"

export default function VarzeaBet() {
  const [activeTab, setActiveTab] = useState("gamesView")
  const [selectedOdds, setSelectedOdds] = useState<Record<string, { choice: string; odds: number }>>({})
  const [betAmount, setBetAmount] = useState("")
  const [longtermBets, setLongtermBets] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Carregar apostas salvas ao iniciar
  useEffect(() => {
    const savedBets = localStorage.getItem("longtermBets")
    if (savedBets) {
      setLongtermBets(JSON.parse(savedBets))
    }
  }, [])

  // Calcular soma das odds
  const sumOdds = Object.values(selectedOdds).reduce((acc, curr) => acc + curr.odds, 0)

  // Selecionar uma odd
  const selectOdd = (matchId: string, choice: string, odds: number) => {
    setSelectedOdds((prev) => {
      const newOdds = { ...prev }

      // Se já estiver selecionado, desmarque
      if (prev[matchId]?.choice === choice) {
        delete newOdds[matchId]
      } else {
        // Caso contrário, selecione
        newOdds[matchId] = { choice, odds }
      }

      return newOdds
    })
  }

  // Submeter apostas
  const submitBets = () => {
    const amount = Number.parseFloat(betAmount)

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

        // Find the selected team
        const selectedTeam = match.teams.find((team) => team.choice === selected.choice)

        return {
          match: match.title,
          choice: selected.choice,
          odds: selected.odds,
          team: selectedTeam?.name || "", // Add the team name
        }
      })
      .filter((bet) => bet)

    // Salvar no localStorage
    localStorage.setItem("longtermBets", JSON.stringify(bets))
    setLongtermBets(bets)

    // Navegar para aba de apostas
    setActiveTab("longtermView")
  }

  // Excluir todas as apostas
  const deleteAllBets = () => {
    localStorage.removeItem("longtermBets")
    setLongtermBets([])
    setSelectedOdds({})
    setBetAmount("")
    setActiveTab("gamesView")
  }

  // Replace the generateBetImage function with this updated version
  const generateBetImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    // Configurar tamanho do canvas
    canvas.width = 600
    canvas.height = 400 + longtermBets.length * 60

    // Desenhar fundo - Agora usando #333 (cinza escuro)
    ctx.fillStyle = "#333"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Desenhar borda laranja
    ctx.strokeStyle = "#f97316"
    ctx.lineWidth = 4
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // Título principal
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillStyle = "#f97316" // Laranja
    ctx.fillText("Sua aposta está pronta para compartilhar!", canvas.width / 2, 50)

    // Título - "Varzea" em branco e "Bet" em laranja
    ctx.font = "bold 40px Arial"
    ctx.textAlign = "center"
    ctx.fillStyle = "white"
    ctx.fillText("Varzea", canvas.width / 2 - 40, 100)
    ctx.fillStyle = "#f97316" // Laranja
    ctx.fillText("Bet", canvas.width / 2 + 60, 100)

    // Desenhar apostas
    ctx.font = "18px Arial"
    ctx.textAlign = "left"
    ctx.fillStyle = "white"

    const startY = 150
    longtermBets.forEach((bet, index) => {
      const y = startY + index * 40
      ctx.fillText(`Partida: ${bet.match}`, 40, y)
      ctx.fillText(`Escolha: ${bet.choice} - ${bet.team} (Odds: ${bet.odds})`, 40, y + 25)
    })

    // Desenhar linha divisória
    ctx.strokeStyle = "white"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, startY + longtermBets.length * 40 + 20)
    ctx.lineTo(canvas.width - 40, startY + longtermBets.length * 40 + 20)
    ctx.stroke()

    // Desenhar resumo
    const amount = Number.parseFloat(betAmount || "0")
    const totalOdds = longtermBets.reduce((acc, bet) => acc + bet.odds, 0)
    const potential = (totalOdds * amount).toFixed(2)

    const summaryY = startY + longtermBets.length * 40 + 60
    ctx.font = "bold 20px Arial"
    ctx.fillStyle = "white"
    ctx.fillText(`Odds totais: ${totalOdds.toFixed(2)}`, 40, summaryY)
    ctx.fillText(`Valor Apostado: R$ ${amount.toFixed(2)}`, 40, summaryY + 30)
    ctx.fillText(`Potencial Retorno: R$ ${potential}`, 40, summaryY + 60)

    // Adicionar marca d'água - posicionada mais acima
    ctx.font = "16px Arial"
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.textAlign = "center"
    ctx.fillText("Gerado por VarzeaBet - " + new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 40)

    return canvas.toDataURL("image/png")
  }

  // Replace the shareOnWhatsApp function with this updated version
  const shareOnWhatsApp = () => {
    const imageUrl = generateBetImage()
    if (!imageUrl) {
      alert("Erro ao gerar imagem das apostas.")
      return
    }

    // Open a new window with the image and instructions
    const newWindow = window.open("", "_blank")
    if (!newWindow) {
      alert("Seu navegador bloqueou a abertura de uma nova janela. Por favor, permita popups para este site.")
      return
    }

    newWindow.document.write(`
    <html>
      <head>
        <title>VarzeaBet - Compartilhar Aposta</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          .bet-image {
            max-width: 100%;
            border: 2px solid #f97316;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          h1 {
            color: #f97316;
            margin-bottom: 30px;
          }
          .instructions {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: left;
          }
          .instructions ol {
            margin-left: 20px;
            line-height: 1.6;
          }
          .whatsapp-button {
            background-color: #25d366;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-weight: bold;
          }
          .whatsapp-button:hover {
            background-color: #128C7E;
          }
          .logo {
            margin-bottom: 20px;
          }
          .logo span.white {
            color: white;
            font-weight: bold;
            font-size: 24px;
          }
          .logo span.orange {
            color: #f97316;
            font-weight: bold;
            font-size: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <span class="white">Varzea</span><span class="orange">Bet</span>
          </div>
          <h1>Sua aposta está pronta para compartilhar!</h1>
          
          <img src="${imageUrl}" alt="Aposta VarzeaBet" class="bet-image" id="betImage" />
          
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

  // Dados dos jogos - Agora com 12 jogos
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

  // Filtrar jogos com base na pesquisa
  const filteredMatches = matches.filter((match) => {
    const query = searchQuery.toLowerCase()
    return (
      match.title.toLowerCase().includes(query) || match.teams.some((team) => team.name.toLowerCase().includes(query))
    )
  })

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-orange-500 py-2 overflow-hidden whitespace-nowrap relative">
        <div className="marquee-content inline-block animate-marquee">
          🔥Os melhores jogos da Várzea ⚽🥅 🔥Os melhores jogos da Várzea ⚽🥅 🔥Os melhores jogos da Várzea ⚽🥅 🔥Os
          melhores jogos da Várzea ⚽🥅 🔥Os melhores jogos da Várzea ⚽🥅 🔥Os melhores jogos da Várzea ⚽🥅 🔥Os
          melhores jogos da Várzea ⚽🥅
        </div>
      </div>

      {/* Brand Bar com barra de pesquisa à direita */}
      <header className="flex justify-between items-center bg-[#1e1e1e] p-4">
        <div
          className="font-bold text-xl whitespace-nowrap select-none cursor-pointer"
          onClick={() => window.location.reload()}
          style={{ userSelect: "none" }}
        >
          <span className="text-white">Varzea⚽</span>
          <span className="text-orange-500">Bet</span>
        </div>

        <div className="relative w-auto max-w-[240px]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full py-1.5 pl-9 pr-8 bg-[#2a2a2a] border border-[#444] rounded-full text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="flex justify-between bg-[#212121] px-4 border-b-2 border-[#212121]">
        <button
          className={`flex-1 border-none py-4 cursor-pointer relative ${activeTab === "gamesView" ? "text-orange-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("gamesView")}
        >
          Jogos
          {activeTab === "gamesView" && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-1 bg-orange-500"></span>
          )}
        </button>
        <button
          className={`flex-1 border-none py-4 cursor-pointer relative ${activeTab === "longtermView" ? "text-orange-500" : "text-gray-500"}`}
          onClick={() => setActiveTab("longtermView")}
        >
          Apostas de Longo Prazo
          {activeTab === "longtermView" && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-1 bg-orange-500"></span>
          )}
        </button>
      </nav>

      <main className="flex-1 pb-16">
        {/* VIEW: JOGOS - Layout responsivo melhorado */}
        {activeTab === "gamesView" && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <div key={match.id} className="bg-[#1c1c1c] p-4 rounded-lg">
                  <p className="mb-2">
                    <strong>{match.date}</strong>
                  </p>
                  <h3 className="mb-2">{match.title}</h3>
                  <div className="flex gap-4 mb-4">
                    {match.teams.map((team) => (
                      <div key={team.choice} className="flex-1 flex flex-col items-center">
                        <label className="mb-1 text-sm text-gray-300">{team.name}</label>
                        <button
                          className={`w-full bg-[#2a2a2a] border-none py-3 px-2 text-white rounded-xl cursor-pointer ${selectedOdds[match.id]?.choice === team.choice ? "bg-orange-500 text-[#121212]" : ""}`}
                          onClick={() => selectOdd(match.id, team.choice, team.odds)}
                        >
                          {team.choice} – {team.odds}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-400 col-span-full">
                <p>Nenhum jogo encontrado para "{searchQuery}"</p>
                <button className="mt-2 text-orange-500 hover:underline" onClick={() => setSearchQuery("")}>
                  Limpar pesquisa
                </button>
              </div>
            )}
          </section>
        )}

        {/* VIEW: APOSTAS DE LONGO PRAZO */}
        {activeTab === "longtermView" && (
          <section>
            <h1 className="p-4 text-center text-xl">Apostas a Longo Prazo</h1>
            <div>
              {longtermBets.length === 0 ? (
                <p className="text-white p-4">Nenhuma aposta de longo prazo.</p>
              ) : (
                <div className="bg-[#1c1c1c] m-4 p-4 rounded-lg">
                  <h3 className="mb-2">Conjunto de Apostas ({longtermBets.length})</h3>

                  {longtermBets.map((bet, index) => (
                    <p key={index} className="mb-2">
                      <strong>{bet.match}</strong> — Escolha: {bet.choice} - {bet.team} (Odds: {bet.odds})
                    </p>
                  ))}

                  <hr className="border-[#333] my-4" />

                  <p className="mb-2">
                    <strong>Odds totais:</strong> {longtermBets.reduce((acc, bet) => acc + bet.odds, 0).toFixed(2)}
                  </p>
                  <p className="mb-2">
                    <strong>Valor Apostado:</strong> R$ {betAmount}
                  </p>
                  <p className="mb-2">
                    <strong>Potencial Retorno:</strong> R${" "}
                    {(
                      longtermBets.reduce((acc, bet) => acc + bet.odds, 0) * Number.parseFloat(betAmount || "0")
                    ).toFixed(2)}
                  </p>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="bg-red-700 text-white border-none rounded-xl py-2 px-4 cursor-pointer hover:bg-red-800 flex items-center gap-1"
                      onClick={deleteAllBets}
                    >
                      <Trash2 className="w-4 h-4" /> Excluir Todas
                    </button>
                    <button
                      className="bg-[#25D366] text-white border-none rounded-xl py-2 px-4 cursor-pointer hover:bg-[#128C7E] flex items-center gap-1"
                      onClick={shareOnWhatsApp}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Enviar no WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Controles globais - Visíveis apenas na view de jogos */}
      {activeTab === "gamesView" && (
        <div className="fixed bottom-0 w-full bg-[#1a1a1a] border-t border-[#333] p-4">
          <div className="flex gap-2 justify-center max-w-md mx-auto">
            <input
              type="number"
              placeholder="Valor da aposta (R$)"
              min="0.01"
              step="0.01"
              className="flex-1 p-2 border border-[#444] rounded-xl bg-[#222] text-white"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitBets()
                }
              }}
            />
            <button
              className="py-3 px-6 border-none rounded-xl bg-orange-500 text-[#121212] cursor-pointer hover:bg-orange-600 font-bold"
              onClick={submitBets}
            >
              Apostar Selecionadas
            </button>
          </div>
          <div className="text-center text-sm mt-2 text-gray-300">
            Odds totais: {sumOdds.toFixed(2)} | Retorno potencial: R${" "}
            {(sumOdds * Number.parseFloat(betAmount || "0")).toFixed(2)}
          </div>
        </div>
      )}

      {/* Canvas escondido para gerar a imagem */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}
