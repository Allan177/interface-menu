'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface ClientInfo {
    id: number;
    name: string;
    email: string;
    address: {
        street: string;
        neighborhood: string;
        postalCode: string;
        number: string;
        city: string;
        referencePoint: string;
    };
}

interface OrderItemAdditional {
    id: number;
    additional: Additional;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    image: string;
    additionalQuantity: number;
    createdAt: string;
    updatedAt: string;
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    discount: number;
    total: number;
    product: Product;
    orderItemAdditional: OrderItemAdditional[];
}

interface Order {
    id: number;
    client: ClientInfo;
    total: number;
    status: string;
    observations: string;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
}

interface Additional {
    id: number;
    name: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

const HistoricalPage = () => {
    const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
    const [orders, setOrders] = useState<Order[] | null>(null);
    const params = useParams();
    const username = params.username as string;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchClientInfo = async () => {
            setLoading(true);
            setError(null);
            try {
                const storedClientInfo = localStorage.getItem('clientInfo');
                if (storedClientInfo) {
                    const parsedClientInfo: ClientInfo = JSON.parse(storedClientInfo);
                    setClientInfo(parsedClientInfo);

                    // Buscar o histórico de pedidos aqui, usando o ID do cliente
                    const clientId = parsedClientInfo.id;
                    console.log("Client ID:", clientId); // Verifique o ID do cliente

                    const ordersResponse = await fetch(`http://localhost:8080/client/${clientId}/orders`);

                    if (!ordersResponse.ok) {
                        throw new Error(`Erro ao buscar o histórico de pedidos: ${ordersResponse.status}`);
                    }

                    const responseText = await ordersResponse.text();
                    console.log("Response Text:", responseText); // Verifique a resposta da API

                    if (responseText && responseText.trim() !== "") {
                        try {
                            const ordersData: Order[] = JSON.parse(responseText);
                            setOrders(ordersData);
                        } catch (jsonError) {
                            console.error("Erro ao fazer o parse do JSON:", jsonError);
                            setError("Erro ao processar os dados do histórico de pedidos.");
                            setOrders(null);
                        }
                    } else {
                        console.log("Resposta da API vazia.");
                        setOrders([]); // Define a lista de pedidos como vazia
                    }
                } else {
                    console.log("ClientInfo não encontrado no localStorage.");
                    router.push(`/cardapioja.com/${username}/login`);
                    setError("ClientInfo não encontrado. Redirecionando para login.");
                }
            } catch (err: any) {
                console.error("Erro ao buscar informações do cliente ou histórico de pedidos:", err);
                setError(`Erro ao carregar dados: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchClientInfo();
    }, [username, router]);

    if (loading) {
        return (
           
                       <div className="flex items-center justify-center h-screen bg-black">
                           <div className="relative flex space-x-4 ">
                               <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce"></div>
                               <div className="w-5 h-5 bg-green-500 rounded-full animate-bounce delay-150"></div>
                               <div className="w-5 h-5 bg-red-500 rounded-full animate-bounce delay-300"></div>
                           </div>
                       </div>

        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500">
                <p>Erro: {error}</p>
            </div>
        );
    }


    if (!clientInfo) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p>ClientInfo não encontrado. Redirecionando...</p>
            </div>
        );
    }



    return (
        <div className="bg-gray-950 min-h-screen text-gray-100">
            <header className="bg-gray-900 py-4">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href={`/cardapioja.com/${username}`} className="flex items-center text-gray-300 hover:text-white">
                        <FaArrowLeft className="mr-2" />
                        Voltar ao Cardápio
                    </Link>
                    <h1 className="text-2xl font-semibold text-center">Histórico de Compras</h1>
                    <div></div> {/* Espaço reservado para alinhar os elementos */}
                </div>
            </header>

            <div className="container mx-auto mt-8 p-4">
                <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Informações do Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p><strong>Nome:</strong> {clientInfo.name}</p>
                            <p><strong>Email:</strong> {clientInfo.email}</p>
                        </div>
                        <div>
                            <p><strong>Endereço:</strong> {clientInfo.address.street}, {clientInfo.address.number}</p>
                            <p><strong>Bairro:</strong> {clientInfo.address.neighborhood}</p>
                            <p><strong>Cidade:</strong> {clientInfo.address.city}</p>
                            <p><strong>CEP:</strong> {clientInfo.address.postalCode}</p>
                            <p><strong>Ponto de Referência:</strong> {clientInfo.address.referencePoint}</p>
                        </div>
                    </div>
                </div>

                {/* Exibição do Histórico de Compras */}
                {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-2">Histórico de Pedidos</h3>
                        {orders.map(order => (
                            <div key={order.id} className="bg-gray-800 rounded-lg shadow-md p-4">
                                <p><strong>Pedido ID:</strong> {order.id}</p>
                                <p><strong>Data do Pedido:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Observações:</strong> {order.observations || 'Nenhuma'}</p>

                                <h4 className="font-semibold mt-2">Itens do Pedido:</h4>
                                <ul className="list-disc pl-5">
                                    {order.orderItems.map(item => (
                                        <li key={item.id}>
                                            {item.product.name} x {item.quantity} - R$ {item.price.toFixed(2)}
                                            {item.orderItemAdditional && item.orderItemAdditional.length > 0 && (
                                                <ul className="list-inside list-disc pl-5">
                                                    {item.orderItemAdditional.map(additionalItem => (
                                                        <li key={additionalItem.id}>
                                                            Adicional: {additionalItem.additional.name} - R$ {additionalItem.price.toFixed(2)}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg shadow-md p-4">
                        <p className="text-gray-400">Nenhum pedido encontrado para este cliente.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoricalPage;