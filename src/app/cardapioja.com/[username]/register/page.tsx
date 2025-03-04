"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        street: "",
        number: "",
        neighborhood: "",
        referencePoint: "",
        postalCode: "",
        city: "",
    });
    const [buttonText, setButtonText] = useState("Registrar-se");
    const [isSending, setIsSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [restaurantData, setRestaurantData] = useState({ id: null, username: null, email: null });
    const params = useParams();
    const username = params.username as string; // Obtém o username da rota
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedRestaurantId = localStorage.getItem('IDUser');
                const storedRestaurantUsername = localStorage.getItem('NameUser');

                if (storedRestaurantId && storedRestaurantUsername) {
                    setRestaurantData({
                        id: Number(storedRestaurantId),
                        username: storedRestaurantUsername,
                        email: "",
                    });
                } else {
                    console.log("Dados do restaurante não encontrados no localStorage.");
                    setErrorMessage("Dados do restaurante não encontrados. Verifique se você está na página correta do restaurante.");
                    // Redirecionar para a página inicial do restaurante
                    router.push(`/cardapioja.com/${username}/`); // Use o username da rota aqui
                }
            } catch (error) {
                console.error("Erro ao recuperar dados do localStorage:", error);
                setErrorMessage("Erro ao carregar dados do restaurante.");
                // Redirecionar para a página inicial do restaurante em caso de erro
                router.push(`/cardapioja.com/${username}/`); // Use o username da rota aqui
            }
        };

        fetchData();
    }, [username, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrorMessage("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setButtonText("Registrando...");
        setErrorMessage("");

        try {
            if (!formData.email.includes("@")) {
                throw new Error("Email inválido.");
            }

            // Structure the payload according to the format specified
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                address: {
                    street: formData.street,
                    number: formData.number,
                    neighborhood: formData.neighborhood,
                    referencePoint: formData.referencePoint,
                    postalCode: formData.postalCode,
                    city: formData.city,
                },
                user: {
                    id: restaurantData.id,
                },
            };

            const response = await fetch('http://localhost:8080/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Falha no registro: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
            }

            const data = await response.json();
            console.log('Registro bem-sucedido:', data);

            setFormData({
                name: "",
                email: "",
                password: "",
                street: "",
                number: "",
                neighborhood: "",
                referencePoint: "",
                postalCode: "",
                city: "",
            });
            alert("Registrado com Sucesso!");
            router.push(`/cardapioja.com/${username}/login`); // Redireciona após o registro
        } catch (err: any) {
            console.error("Erro durante o registro:", err);
            setErrorMessage(`Erro durante o registro, verifique suas informações: ${err.message}`);
        } finally {
            setIsSending(false);
            setButtonText("Registrar-se");
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 overflow-hidden p-6">
            <div className="w-full max-w-4xl bg-gray-800 p-12 rounded-3xl shadow-2xl z-10 space-y-8">
                <h2 className="text-5xl font-extrabold text-gray-200 text-center mb-6">
                    Crie sua conta
                </h2>
                {errorMessage && (
                    <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                <form className="space-y-6" onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { id: "name", label: "Nome" },
                            { id: "email", label: "Email", type: "email" },
                            { id: "password", label: "Senha", type: "password" },
                            { id: "street", label: "Rua" },
                            { id: "number", label: "Número" },
                            { id: "neighborhood", label: "Bairro" },
                            { id: "referencePoint", label: "Ponto de Referência" },
                            { id: "postalCode", label: "CEP" },
                            { id: "city", label: "Cidade" }
                        ].map(({ id, label, type = "text" }) => (
                            <div key={id} className="relative">
                                <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
                                    {label}
                                </label>
                                <input
                                    id={id}
                                    type={type}
                                    value={formData[id]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-4 focus:ring-purple-500 focus:outline-none"
                                    placeholder={`Digite seu ${label.toLowerCase()}`}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-md hover:from-purple-700 hover:to-pink-600 focus:ring-4 focus:ring-purple-400 transition ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSending}
                    >
                        {isSending ? <span className="animate-spin">🔄</span> : buttonText}
                    </button>
                </form>
               
  

            </div>
        </div>
    );
};

export default RegisterPage;