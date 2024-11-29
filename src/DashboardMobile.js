import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Consumo from './Consumo';
import Footer from './Footer';

function DashboardMobile({ dados }) {
  const navigate = useNavigate();

  const handleMinhasFaturasClick = () => {
    const cpfCnpj = localStorage.getItem('cnpj_cpf');
    if (cpfCnpj) {
      navigate(`/financeiro?cpfCnpj=${cpfCnpj}`);
    } else {
      console.error('CPF/CNPJ não encontrado no localStorage.');
    }
  };

  return (
    <div className="app-container">
      <Header dadosCliente={dados} />
      <div className="dashboard-content">
        <Consumo dadosConsumo={dados} />
        <button onClick={handleMinhasFaturasClick}>Minhas Faturas</button>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardMobile;
