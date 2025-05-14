"use client"
import { useState } from "react"
import { Search } from "lucide-react"

export default function TabletPreview() {
  const [activeTab, setActiveTab] = useState("gamesView")
  const [selectedOdds, setSelectedOdds] = useState<Record<string, { choice: string; odds: number }>>({})
  const [betAmount, setBetAmount] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Dados dos jogos - Aumentado para 8 jogos para preencher o grid do tablet
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
  ]

  // Filtrar jogos com base na pesquisa
  const filteredMatches = matches.filter((match) => {
    const query = searchQuery.toLowerCase()
    return (
      match.title.toLowerCase().includes(query) || match.teams.some((team) => team.name.toLowerCase().includes(query))
    )
  })

  // Adicione esta função no componente TabletPreview
  const handleBetSubmit = () => {
    const amount = Number.parseFloat(betAmount)

    if (isNaN(amount) || amount <= 0) {
      alert("Digite um valor válido para a aposta.")
      return
    }

    if (amount > 100) {
      alert("O valor máximo permitido para aposta é R$100,00.")
      return
    }

    // Lógica de aposta aqui
    alert("Aposta realizada com sucesso!")
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <div className="bg-orange-500 text-center py-2 text-sm">🔥Os melhores jogos da Várzea ⚽🥅</div>

      {/* Brand Bar com barra de pesquisa à direita - Versão Tablet */}
      <header className="flex justify-between items-center bg-[#1e1e1e] p-4">
        <div
          className="font-bold text-xl whitespace-nowrap select-none cursor-pointer"
          onClick={() => window.location.reload()}
          style={{ userSelect: "none" }}
        >
          <span className="text-white">Varzea⚽</span>
          <span className="text-orange-500">Bet</span>
        </div>

        <div className="relative max-w-[240px] w-full">
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
        {/* VIEW: JOGOS - Agora com grid 2x2 para mostrar 4 jogos */}
        {activeTab === "gamesView" && (
          <section className="grid grid-cols-2 gap-3 p-3">
            {filteredMatches.map((match) => (
              <div key={match.id} className="bg-[#1c1c1c] p-3 rounded-lg">
                <p className="mb-1 text-sm">
                  <strong>{match.date}</strong>
                </p>
                <h3 className="mb-2 text-sm">{match.title}</h3>
                <div className="flex gap-3 mb-3">
                  {match.teams.map((team) => (
                    <div key={team.choice} className="flex-1 flex flex-col items-center">
                      <label className="mb-1 text-xs text-gray-300">{team.name}</label>
                      <button
                        className={`w-full bg-[#2a2a2a] border-none py-2 px-1 text-white rounded-xl cursor-pointer text-sm ${selectedOdds[match.id]?.choice === team.choice ? "bg-orange-500 text-[#121212]" : ""}`}
                      >
                        {team.choice} – {team.odds}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Controles globais */}
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
                handleBetSubmit()
              }
            }}
          />
          <button
            className="py-3 px-6 border-none rounded-xl bg-orange-500 text-[#121212] cursor-pointer hover:bg-orange-600 font-bold"
            onClick={handleBetSubmit}
          >
            Apostas Selecionadas
          </button>
        </div>
      </div>
    </div>
  )
}
