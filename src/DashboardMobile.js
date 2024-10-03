import React from 'react';
import Header from './Header';
import Consumo from './Consumo'; 
import MinhaFatura from './MinhaFatura';
import Footer from './Footer';

function DashboardMobile({ dados }) {
  return (
    <div className="app-container">
      {/* Header não fixo */}
      <Header dadosCliente={dados} />

      {/* Conteúdo do dashboard com rolagem */}
      <div className="dashboard-content">
        <Consumo dadosConsumo={dados} />
        <MinhaFatura dadosFatura={dados} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default DashboardMobile;
