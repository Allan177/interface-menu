'use client';
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from "axios";

export default function LoginForm() {
    const router = useRouter();
    const params = useParams();
    const username = params.username as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [restaurant, setRestaurant] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [categoriesResponse, restaurantResponse] = await Promise.all([
                    fetch(`http://localhost:8080/${username}/categories`),
                    fetch(`http://localhost:8080/${username}/categories`),
                ]);

                if (!categoriesResponse.ok) {
                    const errorText = await categoriesResponse.text();
                    throw new Error(`Erro ao buscar categorias: ${categoriesResponse.status} - ${errorText}`);
                }
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

                if (!restaurantResponse.ok) {
                    const errorText = await restaurantResponse.text();
                    throw new Error(`Erro ao buscar restaurante: ${restaurantResponse.status} - ${errorText}`);
                }
                const restaurantData = await restaurantResponse.json();
                setRestaurant(restaurantData);

            } catch (err: any) {
                console.error('Erro ao buscar dados', err);
                setError(`Ocorreu um erro ao obter os dados: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        console.log("Tentando login com:", { email, password, username });

        try {
            const response = await axios.post(`http://localhost:8080/${username}/client/login`, {
                email,
                password,
            });

            console.log("Resposta da API:", response);

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Falha na autenticação.');
            }

            if (response.status === 200) {
                const client = response.data;
                console.log("CLIENT:", client);
                try {
                    localStorage.setItem('clientInfo', JSON.stringify(client));
                    console.log("Dados do cliente salvos no localStorage");
                } catch (localStorageError) {
                    console.error("Erro ao salvar no localStorage:", localStorageError);
                    setError("Erro ao salvar os dados do cliente.");
                }
                router.push(`/cardapioja.com/${username}/`);
            }

        } catch (error: any) {
            console.error('Erro durante o login:', error);
            if (axios.isAxiosError(error)) {
                console.error("Detalhes do erro Axios:", error.response?.data, error.response?.status);
                if (error.response) {
                    setError(error.response.data.message || `Erro ${error.response.status}`);
                } else if (error.request) {
                    setError("Sem resposta do servidor.");
                } else {
                    setError(`Erro ao fazer login: ${error.message}`);
                }
            } else {
                setError(`Erro ao fazer login: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 overflow-hidden p-6">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-gray-800 p-10 rounded-3xl shadow-2xl text-center space-y-6"
            >
                <h2 className="text-4xl font-extrabold text-gray-200">Bem-vindo</h2>

                {error && (
                    <div className="bg-red-600/30 text-red-400 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-gray-300 animate-pulse">Autenticando...</div>
                )}

                <form onSubmit={login} className="space-y-5">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-4 focus:ring-purple-500 focus:outline-none"
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-4 focus:ring-purple-500 focus:outline-none"
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className={`w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-md hover:from-purple-700 hover:to-pink-600 focus:ring-4 focus:ring-purple-400 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? <span className="animate-spin">🔄</span> : "Entrar"}
                    </button>
                </form>

                <p className="text-gray-300">
                    Não tem uma conta?{' '}
                    <Link href={`/cardapioja.com/${username}/register`} className="hover:text-gray-400 transition-all font-semibold">
                        Criar Conta
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
