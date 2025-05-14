import ResponsivePreview from "@/components/responsive-preview"

export default function ResponsiveDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        <span>Varzea⚽</span>
        <span className="text-orange-500">Bet</span> - Visualização Responsiva
      </h1>
      <p className="text-center mb-8">Veja como o site se adapta a diferentes tamanhos de tela</p>

      <ResponsivePreview />
    </div>
  )
}
