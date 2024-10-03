import React, { useEffect, useState } from 'react';
import AcessoRapido from './AcessoRapido'; 
import Novidades from './Novidades';
import Destaque from './Destaque';
import { Box } from '@mui/material';
import Footer from './Footer';
import Suporte from './Suporte';

function Home({ dadosCliente }) {
  const [modules, setModules] = useState({}); // Estado para armazenar os módulos disponíveis

  // Define the table ID for modules
  const modulesTableId = 'msafdyz6sew21f1'; // Tabela de módulos permitidos
  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação
  const baseUrl = 'https://nocodb.nexusnerds.com.br/api/v2/tables/'; // URL base

  // Função para buscar os módulos disponíveis
  const fetchModules = async () => {
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
        console.log('Dados dos módulos:', data); // Log para verificar os dados recebidos

        // Aqui você pode filtrar os módulos que estão ativos
        if (data.list.length > 0) {
          const availableModules = data.list[0]; // Supondo que você só tenha uma linha com os checkboxes
          setModules(availableModules);
        }
      } else {
        console.error('Erro ao buscar os módulos:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar os módulos:', error);
    }
  };

  useEffect(() => {
    fetchModules(); // Chama a função para buscar os módulos quando o componente é montado

    // Configura o intervalo para verificar os módulos a cada 5 segundos
    const intervalId = setInterval(fetchModules, 5000); // 5000 ms = 5 segundos

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', paddingBottom: '100px' }}>
      <Box sx={{ marginBottom: '20px' }}>
        {/* Renderiza Novidades se o módulo estiver ativo */}
        {modules.Modulo_Novidades && <Novidades />}
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        {/* Renderiza Acesso Rápido se o módulo estiver ativo */}
        {modules.Modulo_AcessoRapido && <AcessoRapido />}
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        {/* Renderiza Destaque se o módulo estiver ativo */}
        {modules.Modulo_Destaques && <Destaque />}
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        {/* Renderiza Suporte se o módulo estiver ativo */}
        {modules.Modulo_PrecisaSuporte && <Suporte />}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default Home;
