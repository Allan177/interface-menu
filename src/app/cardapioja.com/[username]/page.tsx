'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BsCartPlusFill } from 'react-icons/bs';
import { FaClock, FaMapMarkerAlt, FaPhone, FaUser, FaSignOutAlt, FaTrash } from 'react-icons/fa'; // Import FaTrash
import { FiShoppingCart } from 'react-icons/fi';
import { FaArrowUp } from 'react-icons/fa';
import { ChevronDown, ChevronUp, Menu } from "lucide-react";


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

interface Props {
    onOpen: (clientInfo: ClientInfo) => void;
}

interface ProductAdditional {
    additional: Additional;
    createdAt: string;
    updatedAt: string;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    additionalQuantity: number;
    createdAt: string;
    updatedAt: string;
    productAdditionals: ProductAdditional[];
}

interface Category {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    products: Product[];
}

interface OperatingHour {
    id: number;
    dayOfWeek: string;
    openingTime: string;
    closingTime: string;
    createdAt: string;
    updatedAt: string;
}

interface RestaurantData {
    id: number;
    name: string;
    address: {
        street: string;
        neighborhood: string;
        postalCode: string;
        number: string;
        city: string;
        referencePoint: string;
    };
    operatingHours: OperatingHour[];
    phoneNumber: string;
    image: string;
    banner: string;
}

interface Additional {
    id: number;
    name: string;
    description: string | null;
    price: number;
    createdAt: string;
    updatedAt: string;
}

interface CartItem {
    product: Product;
    quantity: number;
    additionals?: Additional[];
}

export default function CardapioPage() {
    const params = useParams();
    const username = params.username as string;
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [additionals, setAdditionals] = useState<Additional[]>([]);
    const [loadingAdditionals, setLoadingAdditionals] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedAdditionals, setSelectedAdditionals] = useState<Additional[]>([]);
    const cartRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [userButtonOpen, setUserButtonOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [categoriesResponse, restaurantResponse] = await Promise.all([
                    fetch(`http://localhost:8080/${username}/categories`),
                    fetch(`http://localhost:8080/${username}/`),
                ]);

                if (!categoriesResponse.ok) {
                    const errorText = await categoriesResponse.text();
                    throw new Error(`Erro ao buscar categorias: Status ${categoriesResponse.status}, Mensagem: ${errorText}`);
                }

                if (!restaurantResponse.ok) {
                    const errorText = await restaurantResponse.text();
                    throw new Error(`Erro ao buscar informações do restaurante: Status ${restaurantResponse.status}, Mensagem: ${errorText}`);
                }

                const categoriesData: Category[] = await categoriesResponse.json();
                const restaurantData: RestaurantData = await restaurantResponse.json();

                const categoriesWithUniqueProducts = categoriesData.map(category => ({
                    ...category,
                    products: Array.from(new Map(category.products.map(product => [product.id, product])).values())
                }));

                setCategories(categoriesWithUniqueProducts);
                setRestaurantData(restaurantData);

                 // Save name and id to localStorage
                 localStorage.setItem('NameUser', restaurantData.name);
                 localStorage.setItem('IDUser', String(restaurantData.id));
                 localStorage.setItem('Username', username); //save username



            } catch (err: any) {
                console.error('Erro ao buscar dados', err);
                setError(`Ocorreu um erro ao obter os dados: ${err.message}`);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    useEffect(() => {
        const storedClientInfo = localStorage.getItem('clientInfo');
        console.log("Valor lido do localStorage:", storedClientInfo);

        if (storedClientInfo) {
            try {
                const parsedClientInfo = JSON.parse(storedClientInfo);
                console.log("Valor parseado:", parsedClientInfo);
                setClientInfo(parsedClientInfo);
            } catch (error) {
                console.error("Erro ao fazer o parsing do clientInfo do localStorage:", error);
                localStorage.removeItem('clientInfo');
                setClientInfo(null);
            }
        }
    }, []);

      useEffect(() => {
        // Simulação de dados vindos da rota (substitua por seus dados reais)
        const userDataFromRoute = {
            username: username, // Use o username da rota
            id: 123 // Substitua pelo ID real do usuário
        };

        // Salva os dados no localStorage
        localStorage.setItem('userData', JSON.stringify(userDataFromRoute));

        // Opcional: Recupera e verifica os dados do localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            console.log('Dados do usuário salvos no localStorage:', parsedUserData);
        }
    }, [username]); // Executa este efeito apenas quando o username muda

    useEffect(() => {
        if (restaurantData) {
            const now = new Date();
            const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
            const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

            const todayHours = restaurantData.operatingHours.find(hour => hour.dayOfWeek === currentDay);

            if (todayHours) {

                const [openHour, openMinute] = todayHours.openingTime.slice(0, 5).split(':').map(Number);
                const [closeHour, closeMinute] = todayHours.closingTime.slice(0, 5).split(':').map(Number);
                const [currentHour, currentMinute] = currentTime.split(':').map(Number);

                const isOpenNow = (
                    currentHour > openHour ||
                    (currentHour === openHour && currentMinute >= openMinute)
                ) && (
                    currentHour < closeHour ||
                    (currentHour === closeHour && currentMinute <= closeMinute)
                );

                setIsOpen(isOpenNow)
            } else {
                setIsOpen(false);
            }
        }
    }, [restaurantData]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, cartRef]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <p className="text-red-400 text-lg font-semibold">Erro: {error}</p>
            </div>
        );
    }

   const handleOpenModal = async (product: Product) => {
        setSelectedProduct(product);
        setAdditionals(product.productAdditionals.map(item => item.additional));
        setLoadingAdditionals(false);
        setSelectedAdditionals([]); // Reset selected additionals when opening the modal
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAdditionals([]);
        setError(null);
        setLoadingAdditionals(false);
        setSelectedAdditionals([]);
    };

    const getDayName = (day: string) => {
        const days = {
            MONDAY: 'Seg',
            TUESDAY: 'Ter',
            WEDNESDAY: 'Qua',
            THURSDAY: 'Qui',
            FRIDAY: 'Sex',
            SATURDAY: 'Sáb',
            SUNDAY: 'Dom'
        };
        return days[day as keyof typeof days] || day;
    }

  const handleAddToCart = (product: Product) => {
    console.log("handleAddToCart - Produto:", product);
    console.log("handleAddToCart - Adicionais Selecionados:", selectedAdditionals);

    setCartItems(prevItems => {
        const itemIndex = prevItems.findIndex(item => item.product.id === product.id);
        if (itemIndex > -1) {
            const newCartItems = [...prevItems];
            newCartItems[itemIndex] = {
                ...newCartItems[itemIndex],
                quantity: newCartItems[itemIndex].quantity + 1,
                additionals: selectedAdditionals.length > 0 ? selectedAdditionals : newCartItems[itemIndex].additionals
            };
            console.log("handleAddToCart - Carrinho atualizado:", newCartItems);
            return newCartItems;
        } else {
            console.log("handleAddToCart - Novo item adicionado ao carrinho:", { product, quantity: 1, additionals: selectedAdditionals.length > 0 ? selectedAdditionals : undefined });
            return [...prevItems, { product, quantity: 1, additionals: selectedAdditionals.length > 0 ? selectedAdditionals : undefined }];
        }
    });
    handleCloseModal();
    setSelectedAdditionals([]);
};


    const handleCheckboxChange = (additional: Additional) => {
        if (selectedAdditionals.some(item => item.id === additional.id)) {
            setSelectedAdditionals(prev => prev.filter(item => item.id !== additional.id))
        } else {
            setSelectedAdditionals(prev => [...prev, additional]);
        }
    }

   const isAdditionalLimitReached = () => {
        if (!selectedProduct) return false;
        return selectedAdditionals.length >= selectedProduct.additionalQuantity;
    };

  const calculateTotalPrice = (items: CartItem[]) => {
    let total = 0;
    items.forEach(item => {
        total += item.product.price * item.quantity;
        if (item.additionals) {
            item.additionals.forEach(add => {
                total += add.price; // Adiciona o preço de cada adicional
            });
        }
    });
    console.log("calculateTotalPrice - Total calculado:", total);
    return total;
};

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const getRestaurantImageUrl = () => {
        if (restaurantData && restaurantData.image && restaurantData.id) {
            return `http://localhost:8080/uploads/user/${restaurantData.id}/${restaurantData.image}`
        }
        else {
            if (!restaurantData) {
                console.log("restaurantData is null");
            }
            return '/assets/logo.png'
        }
    }

    const getRestaurantBannerUrl = () => {
        if (restaurantData && restaurantData.banner && restaurantData.id) {
            return `http://localhost:8080/uploads/user/${restaurantData.id}/${restaurantData.banner}`;
        }
        return '/assets/bg.png';
    };
    const getProductImageUrl = (product: Product) => {
        if (product?.image && product.id) {
            return `http://localhost:8080/uploads/product/${product.id}/${product.image}`;
        }
        return '/assets/placeholder.png';
    }

    const handleLogout = () => {
        localStorage.removeItem('clientInfo');
        setClientInfo(null);
        router.push(`/cardapioja.com/${username}/`);
            
    };

    const handleFinalizarCompra = async () => {
        console.log("handleFinalizarCompra - clientInfo:", clientInfo);
        if (!clientInfo) {
            alert('Você precisa estar logado para finalizar a compra.');
            router.push(`/cardapioja.com/${username}/login`);
            return;
        }
    
    
    
        try {
            const orderItems = cartItems.map(item => ({
                product: {
                    id: item.product.id
                },
                quantity: item.quantity,
                price: item.product.price,
                orderItemAdditional: item.additionals ? item.additionals.map(add => ({
                    additional: { id: add.id },
                    quantity: 1 // Adicionando a quantidade
                })) : []
            }));
    
             // Retrieve IDUser from localStorage
             const IDUser = localStorage.getItem('IDUser');
    
            const orderData = {
                user: {
                    id: IDUser ? parseInt(IDUser, 10) : null // Use the restaurant ID as the user ID
                },
                observations: "Teste",
                orderItems: orderItems,
                client: {
                    id: clientInfo.id.toString()
                },
                status: "PENDING"
            };

        console.log("handleFinalizarCompra - Dados do pedido:", orderData);
    
            const response = await fetch('http://localhost:8080/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao finalizar o pedido: Status ${response.status}, Mensagem: ${errorText}`);
            }
    
            const responseData = await response.json();
            console.log('Pedido finalizado com sucesso:', responseData);
    
            // Limpar o carrinho após o pedido ser feito com sucesso
            setCartItems([]);
            alert('Pedido finalizado com sucesso!');
            // Redirecionar para uma página de confirmação ou detalhes do pedido
            // router.push('/pedido-confirmado');
            router.push(`/cardapioja.com/${username}/`);
    
        } catch (error: any) {
            console.error('Erro ao finalizar o pedido:', error);
            alert(`Ocorreu um erro ao finalizar o pedido: ${error.message}`);
        }
    };

    const handleRemoveFromCart = (itemToRemove: CartItem) => {
        setCartItems(prevItems =>
            prevItems.filter(item => item.product.id !== itemToRemove.product.id)
        );
        };

    console.log("Valor de clientInfo no render:", clientInfo);
    const teste = localStorage.getItem("username")
    console.log(teste)

    return (
        <div className="bg-gray-950 min-h-screen text-gray-100">
      {/* Navbar */}
      <nav className="w-full h-16 bg-gray-950 backdrop-blur-lg flex justify-between items-center px-6">
        <div className="flex items-center gap-4 sm:gap-6"> {/* Ajuste o espaçamento */}
        <button>
            <p className="font-bold text-xl sm:text-2xl hover:text-gray-300 transition duration-300"> {/* Ajuste o tamanho da fonte */}
              {username}
            </p>
          </button>
         

          {/* Menu Categorias (Dropdown) */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative text-white font-semibold px-3 py-2 hover:bg-gray-700 transition" // Reduzi o padding horizontal
            >
              Categorias
            </button>
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute left-0 mt-2 w-48 bg-gray-800 text-white shadow-lg z-50 overflow-hidden" // Ajustei a margem superior
              >
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`#${category.name}`}
                    className="block px-4 py-2 hover:bg-gray-700 transition"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Info / Login */}
        <div className="text-white flex items-center gap-2 sm:gap-3">  {/* Ajuste o espaçamento */}
         

          {/* Botão de Perfil */}
          <button
            ref={buttonRef}
            onClick={() => setUserButtonOpen(!userButtonOpen)}
            className="p-2 rounded-full hover:bg-gray-700 transition focus:outline-none"
          >
            <FaUser size={24} />
          </button>

          {/* Menu dropdown do usuário */}
          {userButtonOpen && clientInfo && (
  <div className="absolute right-0 top-20 w-72 bg-gray-900 rounded-lg shadow-xl text-white z-50 border border-gray-800">
    {/* Header do dropdown com informações básicas */}
    <div className="px-5 py-4 border-b border-gray-700">
      <p className="text-sm font-semibold truncate">Olá, {clientInfo.name} 👋</p>
      <p className="text-xs text-gray-300 truncate">{clientInfo.email}</p>
    </div>

    {/* Seção de informações adicionais (opcional) */}
    <div className="px-5 py-3 text-xs text-gray-300">
      <p>{clientInfo.address.street}, {clientInfo.address.number} - {clientInfo.address.city}</p>
    </div>

    {/* Link para o histórico de compras */}
    <div className="px-5 py-3 border-t border-gray-700">
      <Link 
        href={`/cardapioja.com/${username}/historical`} 
        className="block text-sm font-semibold text-gray-200 hover:text-gray-400 transition-all"
      >
        📜 Histórico de Compras
      </Link>
    </div>

    {/* Ações do usuário */}
    <div className="py-2 border-t border-gray-700">
      <button
        onClick={handleLogout}
        className="flex items-center px-5 py-2 text-sm w-full text-left hover:bg-gray-800 transition-all"
      >
        <FaSignOutAlt className="mr-2 text-gray-300" />
        <span className="align-middle">Sair</span>
      </button>
    </div>
  </div>
)}

        </div>
      </nav>

      {/* Header (Banner) */}
      <div className="mx-auto px-4">
        <header className="w-full h-64 sm:h-screen bg-cover bg-center"> {/* Ajuste a altura */}
          <div
            className="w-full h-full flex flex-col justify-center items-center"
            style={{
              backgroundImage: `url(${getRestaurantBannerUrl()})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {restaurantData ? (
              <img
                src={getRestaurantImageUrl()}
                className="w-24 sm:w-32 rounded-full shadow-white hover:scale-125 duration-200" // Ajuste o tamanho da imagem
                alt="logo do restaurante"
              />
            ) : null}
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-100 mb-2 sm:mb-4 text-center">  {/* Ajuste o tamanho da fonte e margem */}
              Cardápio de <span className="text-indigo-500">{username}</span>
            </h1>
            <div className="text-center flex flex-col items-center gap-1 sm:gap-2"> {/* Ajuste o espaçamento */}
              {restaurantData ? (
                <>
                  <div className="text-white flex items-center gap-1" id="date-span"> {/* Reduzi o espaçamento */}
                    <FaMapMarkerAlt className="text-gray-300" />
                    <span className="font-medium text-sm sm:text-base"> {/* Ajuste o tamanho da fonte */}
                      {restaurantData.address.street}, {restaurantData.address.number} - {restaurantData.address.neighborhood}
                    </span>
                  </div>

                  <div className={`text-white flex items-center gap-1 px-1 py-1 rounded ${isOpen ? 'bg-green-500' : 'bg-gray-900'}`}> {/* Reduzi o espaçamento */}
                    <FaClock className="text-gray-300" />
                    {restaurantData.operatingHours && (
                      <span className="font-medium text-sm sm:text-base">  {/* Ajuste o tamanho da fonte */}
                        {(() => {
                          const now = new Date();
                          const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
                          const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
                          const todayHours = restaurantData.operatingHours.find(hour => hour.dayOfWeek === currentDay);

                          if (todayHours) {
                            return `${getDayName(todayHours.dayOfWeek)} ${currentTime}`
                          } else {
                            return 'Fechado'
                          }
                        })()}
                      </span>
                    )}
                  </div>
                  <div className="text-white flex items-center gap-1" id="date-span"> {/* Reduzi o espaçamento */}
                    <FaPhone className="text-gray-300" />
                    <span className="font-medium text-sm sm:text-base"> {restaurantData.phoneNumber}</span> {/* Ajuste o tamanho da fonte */}
                  </div>
                </>
              ) : (
                <p className="text-white">Carregando informações do restaurante...</p>
              )}
            </div>
          </div>
        </header>

        {/* Menu Categories */}
        <div className="gap-6 sm:gap-12 mt-4 sm:mt-8">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="mb-8 sm:mb-12" id={category.name}>
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-2 sm:mb-4 border-b pb-1 sm:pb-2"> {/* Ajuste o tamanho da fonte e espaçamento */}
                    {category.name}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"> {/* Ajuste o número de colunas */}
                    {category.products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-gray-400/20 rounded-lg transform hover:translate-y-2 hover:shadow-xl transition duration-300 relative group"
                      >
                        <div
                          onClick={() => handleOpenModal(product)}
                          className="block cursor-pointer"
                        >
                          <div className="p-2 flex flex-col justify-between h-full">
                            <figure className="mb-1">
                              <div className="relative w-full h-80 sm:h-80"> {/* Ajuste a altura */}
                                {product.image ? (
                                  <img
                                    src={getProductImageUrl(product)}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-md ml-auto mr-auto"
                                    style={{ objectFit: 'contain' }} // Garante que a imagem caiba no espaço
                                  />
                                ) : (
                                  <img
                                    src="/assets/placeholder.png"
                                    alt="Placeholder"
                                    className="w-full h-full object-cover rounded-md ml-auto mr-auto"
                                  />
                                )}
                              </div>
                            </figure>
                            <div className="rounded-lg p-2 bg-white/ flex flex-col">
                              <div>
                                <h5 className="text-white text-lg sm:text-xl font-bold leading-none"> {/* Ajuste o tamanho da fonte */}
                                  {product.name}
                                </h5>
                                <span className="text-xs text-white leading-none">
                                  {product.description || 'Sem Descrição'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-lg text-white font-light">
                                  R$ {product.price.toFixed(2)}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <BsCartPlusFill className="text-gray-300 text-2xl cursor-pointer hover:text-gray-100" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">
              Nenhuma categoria encontrada.
            </p>
          )}

          {/* Modal de adicionais */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-gray-800 rounded-lg p-4 sm:p-8 max-w-md w-full"> {/* Ajuste o padding */}
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-2 sm:mb-4"> {/* Ajuste o tamanho da fonte e espaçamento */}
                  Adicionais para {selectedProduct?.name}
                </h2>
                {/* Removida a mensagem da quantidade de adicionais */}
                {loadingAdditionals ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 sm:w-8 sm:h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"  // Ajuste o tamanho do spinner
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {additionals.map((additional) => (
                      <label key={additional.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedAdditionals.some(add => add.id === additional.id)}
                          onChange={() => handleCheckboxChange(additional)}
                          disabled={isAdditionalLimitReached() && !selectedAdditionals.some(add => add.id === additional.id)}
                        />
                        <span className="text-gray-300 text-sm"> {/* Ajuste o tamanho da fonte */}
                          {additional.name} - R$ {additional.price.toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <div className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-4"> {/* Ajuste o espaçamento */}
                  <button
                    onClick={handleCloseModal}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleAddToCart(selectedProduct!)}
                    className={`bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors
                                        ${selectedAdditionals.length < 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Carrinho Flutuante */}
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full shadow-xl z-50 cursor-pointer transition-all duration-300
            ${isOpen ? 'opacity-100' : 'opacity-80 hover:opacity-100'}
            ${cartItems.length > 0 ? 'bg-black' : 'bg-white border border-gray-300'}`}
          onClick={() => setIsOpen(!isOpen)}
          ref={cartRef}
        >
          <div className="relative p-3">
            <FiShoppingCart className={`text-2xl sm:text-3xl ${cartItems.length > 0 ? 'text-white' : 'text-black'}`} />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
              </span>
            )}
          </div>

          {isOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-xl z-50 w-[300px] sm:w-[400px] overflow-hidden border border-gray-300"> {/* Ajuste a largura */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-black mb-3">Seu Carrinho</h3>
                {cartItems.length === 0 ? (
                  <p className="text-gray-600 text-center">Carrinho Vazio</p>
                ) : (
                  <div>
                    {cartItems.map((item, index) => (
                      <div key={index} className="border-b border-gray-300 py-2">
                        <div className="flex justify-between items-center">
                          <div className="text-black font-semibold">
                            {item.product.name} x {item.quantity}
                          </div>
                          <div className="text-black font-medium">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </div>
                          <button onClick={() => handleRemoveFromCart(item)} className="text-red-500 hover:text-red-700">
                            <FaTrash />
                          </button>
                        </div>
                        {item.additionals && item.additionals.length > 0 && (
                          <div className="ml-4 text-xs text-gray-600">
                            <ul>
                              {item.additionals.map((add, addIndex) => (
                                <li key={addIndex}>{add.name} - R$ {add.price.toFixed(2)}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-3 text-lg font-bold">
                      Total:
                      <span className="text-black">R$ {calculateTotalPrice(cartItems).toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <button onClick={handleFinalizarCompra} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 bg-gray-800 text-white rounded-full p-3 shadow-xl z-40 hover:bg-gray-900 transition-all"
          >
            <FaArrowUp className="text-xl sm:text-2xl" />
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-4 sm:py-6 text-center mt-8 sm:mt-10"> {/* Ajuste o padding */}
        <p className="text-sm">© 2025 CardapioJa. Todos os direitos reservados.</p>
        <div className="flex justify-center gap-2 sm:gap-4 mt-2">
          <Link href={`/cardapioja.com/${username}/register`} className="hover:text-gray-400 transition-all">Criar Conta</Link>
          <Link href={`/cardapioja.com/${username}/login`} className="hover:text-gray-400 transition-all">Entrar</Link>
          <a href="#" className="hover:text-gray-400 transition-all">Associa-se ao Cardapio Ja</a>
        </div>
      </footer>
    </div>
  );
}