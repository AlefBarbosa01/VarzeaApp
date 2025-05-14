"use client"
import { useState } from "react"
import { Smartphone, Tablet, Laptop, MonitorSmartphone } from "lucide-react"

export default function ResponsivePreview() {
  const [device, setDevice] = useState<"mobile" | "tablet" | "laptop" | "all">("all")

  return (
    <div className="w-full flex flex-col items-center gap-6 py-8 bg-gray-900 rounded-lg">
      <div className="flex gap-4">
        <button
          onClick={() => setDevice("mobile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${device === "mobile" ? "bg-orange-500 text-black" : "bg-gray-800 text-white"}`}
        >
          <Smartphone size={18} /> Celular
        </button>
        <button
          onClick={() => setDevice("tablet")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${device === "tablet" ? "bg-orange-500 text-black" : "bg-gray-800 text-white"}`}
        >
          <Tablet size={18} /> Tablet
        </button>
        <button
          onClick={() => setDevice("laptop")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${device === "laptop" ? "bg-orange-500 text-black" : "bg-gray-800 text-white"}`}
        >
          <Laptop size={18} /> Notebook
        </button>
        <button
          onClick={() => setDevice("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${device === "all" ? "bg-orange-500 text-black" : "bg-gray-800 text-white"}`}
        >
          <MonitorSmartphone size={18} /> Todos
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {(device === "mobile" || device === "all") && (
          <div className="flex flex-col items-center">
            <h3 className="text-white mb-2">Celular (320-480px)</h3>
            <div className="border-8 border-gray-700 rounded-3xl overflow-hidden w-[320px] h-[568px] bg-black">
              <div className="w-full h-6 bg-gray-800 flex justify-center items-center">
                <div className="w-24 h-1 bg-gray-600 rounded-full"></div>
              </div>
              <iframe src="/mobile-preview" className="w-full h-[calc(100%-24px)]" title="Mobile Preview" />
            </div>
          </div>
        )}

        {(device === "tablet" || device === "all") && (
          <div className="flex flex-col items-center">
            <h3 className="text-white mb-2">Tablet (768px)</h3>
            <div className="border-8 border-gray-700 rounded-3xl overflow-hidden w-[768px] h-[568px] bg-black">
              <div className="w-full h-6 bg-gray-800 flex justify-center items-center">
                <div className="w-24 h-1 bg-gray-600 rounded-full"></div>
              </div>
              <iframe src="/tablet-preview" className="w-full h-[calc(100%-24px)]" title="Tablet Preview" />
            </div>
          </div>
        )}

        {(device === "laptop" || device === "all") && (
          <div className="flex flex-col items-center">
            <h3 className="text-white mb-2">Notebook (1024px+)</h3>
            <div className="border-8 border-gray-700 rounded-xl overflow-hidden w-[1024px] h-[568px] bg-black">
              <div className="w-full h-6 bg-gray-800 flex justify-center items-center">
                <div className="w-24 h-1 bg-gray-600 rounded-full"></div>
              </div>
              <iframe src="/desktop-preview" className="w-full h-[calc(100%-24px)]" title="Desktop Preview" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
