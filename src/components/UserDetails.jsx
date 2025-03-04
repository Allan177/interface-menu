import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserDetails = () => {
  const { username } = useParams(); // Captura o parâmetro da URL
  const [user, setUser] = useState(null); // Armazena os dados do usuário
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Chamada à API para buscar os usuários
    axios
      .get('http://localhost:8080/user/all?admin=false')
      .then((response) => {
        const users = response.data;
        // Filtra o usuário com base no username
        const foundUser = users.find((u) => u.username === username);
        if (foundUser) {
          setUser(foundUser);
        } else {
          setError('Usuário não encontrado.');
        }
      })
      .catch(() => setError('Erro ao buscar os dados.'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Detalhes do Usuário</h1>
      <img src={`http://localhost:8080/images/${user.image}`} alt={user.name} width="200" />
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>CNPJ:</strong> {user.cnpj}</p>
      <p><strong>Endereço:</strong> {`${user.address.street}, ${user.address.number}, ${user.address.city}`}</p>
      <p><strong>Horários de Funcionamento:</strong></p>
      <ul>
        {user.operatingHours.map((hour) => (
          <li key={hour.id}>
            {hour.dayOfWeek}: {hour.openingTime} - {hour.closingTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;
