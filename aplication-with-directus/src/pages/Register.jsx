"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import registerService from "../services/authService"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = await registerService({
        nombre: name,
        email: email,
        fecha_registro: new Date().toISOString(),
      })

      if (data) {
        console.log("Registro exitoso:", data)
      }

      // Redirigir al lobby
      navigate("/lobby")
    } catch (err) {
      console.error("Registration error:", err)
      setError("Error al registrar. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Tarjeta principal */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cabecera de bingo */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
            <div className="flex justify-center mb-4">
              {["B", "I", "N", "G", "O"].map((letter, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-1 shadow-md"
                >
                  <span className="text-red-600 font-bold text-lg">{letter}</span>
                </div>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Registro para el Bingo</h1>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors font-medium mt-2 disabled:bg-red-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registrando...
                  </div>
                ) : (
                  "Registrarme"
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">¿Ya tienes una cuenta?</p>
                <a href="/login" className="text-sm font-medium text-red-600 hover:text-red-500">
                  Iniciar sesión
                </a>
              </div>
            </div>
          </div>

          {/* Decoración de bingo en el pie */}
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
            <div className="flex space-x-1">
              {[12, 24, 36, 48, 60].map((num, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-xs font-medium">{num}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">¡La diversión está por comenzar!</p>
          </div>
        </div>
      </div>
    </div>
  )
}




/*import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import registerService from '../services/authService'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {

      const data = await registerService({
        nombre: name,
        email: email,
        fecha_registro: new Date().toISOString()
      })
      
      if (data) {
        console.log('Registro exitoso:', data)
      }

      // Redirigir al lobby
      navigate('/lobby')
    } catch (err) {
      console.error('Registration error:', err)
      setError('Error al registrar. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Registro para el Bingo</h1>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>
    </div>
  )
}*/