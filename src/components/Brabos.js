'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Brabos = () => {
  const [brabos, setBrabos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrabos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/brabos/');
        setBrabos(response.data); // Define os dados do objeto recebido
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBrabos();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h1>Informações do Estabelecimento</h1>
      <p><strong>Nome:</strong> {brabos.name}</p>
      <p><strong>Email:</strong> {brabos.email}</p>
      <p>
        <strong>Endereço:</strong> {`${brabos.address.street}, ${brabos.address.number}, 
        ${brabos.address.neighborhood}, ${brabos.address.city}, CEP: ${brabos.address.postalCode}`}
      </p>
      <p><strong>CNPJ:</strong> {brabos.cnpj}</p>
      <p><strong>Razão Social:</strong> {brabos.socialReason}</p>
      <p><strong>Usuário:</strong> {brabos.username}</p>

      <h2>Horários de Funcionamento</h2>
      <ul>
        {brabos.operatingHours.map((hour) => (
          <li key={hour.id}>
            <strong>Dia:</strong> {hour.dayOfWeek} <br />
            <strong>Abertura:</strong> {hour.openingTime} <br />
            <strong>Fechamento:</strong> {hour.closingTime}
          </li>
        ))}
      </ul>

      <h2>Logo</h2>
      <img src={`http://localhost:8080/images/${brabos.image}`} alt="Logo do Estabelecimento" style={{ maxWidth: '200px' }} />
    </div>
  );
};

export default Brabos;
