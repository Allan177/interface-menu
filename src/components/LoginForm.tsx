'use client';
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from 'next/navigation';

export default function LoginForm() {
    const router = useRouter();
    const params = useParams();
    const username = params.username as string;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const restaurantResponse = await fetch(`http://localhost:8080/${username}/`);

                if (!restaurantResponse.ok) {
                    const errorText = await restaurantResponse.text();
                    throw new Error(`Erro ao buscar informações do restaurante: Status ${restaurantResponse.status}, Mensagem: ${errorText}`);
                }

                // Você pode processar os dados do restaurante aqui, se necessário
                const restaurantData = await restaurantResponse.json();
                console.log("Dados do restaurante:", restaurantData);


            } catch (err: any) {
                console.error('Erro ao buscar dados do restaurante:', err);
                setError(`Erro ao buscar dados do restaurante: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string
        };

        // Use o username da rota para construir a callbackUrl
        const callbackUrl = `/cardapioja.com/${username}/`;

        signIn("credentials", {
            ...data,
            callbackUrl: callbackUrl,
            redirect: false, // Impede o redirecionamento automático
        }).then((result) => {
            if (result?.error) {
                setError("Credenciais inválidas. Por favor, tente novamente.");
            } else {
                // Redirecionamento manual após o login bem-sucedido
                router.push(callbackUrl);
            }
        });
    }

    return (
        <form onSubmit={login} className="h-screen flex justify-center items-center bg-gradient-to-br from-stone-300 to-stone-900 px-5">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center"
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bem-vindo de volta</h2>

                {error && (
                    <div className="text-red-500 mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
                        Entrar
                    </button>
                </div>
            </motion.div>
        </form>
    );
}