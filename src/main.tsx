import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import './index.css'

// Supabase konfigūracija (naudoja tavo įvestus kintamuosius iš Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const App = () => {
  const [view, setView] = useState("subjects")
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    // Čia bus tavo duomenų krovimas iš Supabase
    console.log("Svetainė užsikrovė!")
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-blue-900">VBE Pasiruošimas</h1>
        <p className="text-gray-600">Sveiki sugrįžę!</p>
      </header>
      
      <main className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView("subjects")}
            className={`px-4 py-2 rounded ${view === 'subjects' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Dalykai
          </button>
          <button 
            onClick={() => setView("solve")}
            className={`px-4 py-2 rounded ${view === 'solve' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Spręsti
          </button>
        </div>

        {view === "subjects" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
              <h3 className="font-bold">Matematika</h3>
              <p className="text-sm text-gray-500">Pasiruošk valstybiniam egzaminui</p>
            </div>
            <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
              <h3 className="font-bold">Informacinės technologijos</h3>
              <p className="text-sm text-gray-500">Programavimo užduotys ir teorija</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Užduočių modulis ruošiamas...</p>
          </div>
        )}
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
