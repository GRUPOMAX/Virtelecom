import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardMobile from './DashboardMobile';
import Login from './Login';
import Cadastro from './Cadastro';
import CriarTicket  from './CriarTicket';
import Planos from './Planos';
import PlanoDetalhes from './PlanoDetalhes';
import Financeiro from './Financeiro';
import Duvidas from './Duvidas';
import Perfil from './Perfil';
import Footer from './Footer';
import Home from './Home';
import Header from './Header'; // Importa o Header
import MeuWifi from './MeuWiFi';
import TodosOsDispositivos from './TodosOsDispositivos'; // Certifique-se de que o caminho está correto
import TodosHosts from './TodosHosts'; // Importe o componente que exibirá todos os hosts


import './App.css';

function App() {
  const [dadosCliente, setDadosCliente] = useState(null);
  const [footerValue, setFooterValue] = useState(0);
  const [primaryColor, setPrimaryColor] = useState('#28a745');
  const [headerIconColor, setHeaderIconColor] = useState('#28a745');
  const [footerIconColor, setFooterIconColor] = useState('#28a745');
  const [modulosPermitidos, setModulosPermitidos] = useState([]); // Estado para armazenar os módulos permitidos

  // Define the table IDs for modules
  const modulesTableId = 'msafdyz6sew21f1'; // Tabela de módulos
  const colorsTableId = 'mn37trxp7ai1efw'; // Nova tabela de cores
  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação
  const baseUrl = 'https://nocodb.nexusnerds.com.br/api/v2/tables/'; // URL base

  useEffect(() => {
    // Função para buscar configurações do NocoDB
    const fetchAppSettings = async () => {
      try {
        // Fetch de cores
        const response = await fetch(`${baseUrl}${colorsTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Configurações de cores:', data);
          if (data.list.length > 0) {
            const settingsData = data.list[0];
            setPrimaryColor(settingsData.primaryColor || '#28a745');
            setHeaderIconColor(settingsData.headerIconColor || '#28a745');
            setFooterIconColor(settingsData.footerIconColor || '#28a745');

            // Atualiza as variáveis CSS dinamicamente
            document.documentElement.style.setProperty('--primary-color', settingsData.primaryColor || '#28a745');
            document.documentElement.style.setProperty('--header-icon-color', settingsData.headerIconColor || '#28a745');
            document.documentElement.style.setProperty('--footer-icon-color', settingsData.footerIconColor || '#28a745');
          }
        } else {
          console.error('Erro ao buscar as configurações do app:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar as configurações do app:', error);
      }
    };

    // Função para buscar módulos permitidos
    const fetchModulosPermitidos = async () => {
      try {
        const response = await fetch(`${baseUrl}${modulesTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.list.length > 0) {
            const modulos = data.list[0];
            // Extrai os módulos permitidos
            const novosModulosPermitidos = [];
            if (modulos.Modulo_Novidades) novosModulosPermitidos.push('Modulo_Novidades');
            if (modulos.Modulo_AcessoRapido) novosModulosPermitidos.push('Modulo_AcessoRapido');
            if (modulos.Modulo_Destaques) novosModulosPermitidos.push('Modulo_Destaques');
            if (modulos.Modulo_PrecisaSuporte) novosModulosPermitidos.push('Modulo_PrecisaSuporte');
            setModulosPermitidos(novosModulosPermitidos);
          }
        } else {
          console.error('Erro ao buscar os módulos permitidos:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar os módulos permitidos:', error);
      }
    };

    // Chama as funções para buscar configurações e módulos
    fetchAppSettings();
    fetchModulosPermitidos();

    // Carrega os dados do cliente do localStorage, se existirem
    const savedDadosCliente = localStorage.getItem('dadosCliente');
    if (savedDadosCliente) {
      setDadosCliente(JSON.parse(savedDadosCliente));
    }
  }, []); // Executa apenas na montagem do componente

  const handleFooterChange = (newValue) => {
    setFooterValue(newValue);
  };

  return (
    <Router>
      <div className="app-container">
        {dadosCliente && <Header dadosCliente={dadosCliente} />}
        <Routes>
          <Route path="/" element={<Login onLogin={setDadosCliente} />} />
          <Route path="/home" element={<Home dadosCliente={dadosCliente} />} />
          <Route path="/dashboard" element={<DashboardMobile dados={dadosCliente} />} />
          <Route path="/cadastro" element={<Cadastro dados={dadosCliente} />} />
          <Route path="/detalhes" element={<CriarTicket dadosCliente={dadosCliente} />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/planos/:id" element={<PlanoDetalhes />} />
          <Route path="/financeiro" element={<Financeiro dados={dadosCliente} />} />
          <Route path="/wifi" element={<MeuWifi dados={dadosCliente} />} />
          <Route path="/duvidas" element={<Duvidas />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/dispositivos/:frequencia" element={<TodosOsDispositivos />} />
          <Route path="/dispositivos/ethernet" element={<TodosOsDispositivos frequencia="ethernet" />} />
          <Route path="/todos-hosts" element={<TodosHosts />} />
        </Routes>
        {dadosCliente && (
          <Footer
            value={footerValue}
            onChange={handleFooterChange}
            setDados={setDadosCliente}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
