import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Modal } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';

function AcessoRapido() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#28a745'); // Cor padrão para o CircleLoader
  const [iconColor, setIconColor] = useState('#5b5b5b'); // Cor padrão dos ícones
  const [modules, setModules] = useState({}); // Estado para armazenar os módulos disponíveis

  // Define the table ID for modules
  const modulesTableId = 'm214oke6rh5dca0'; // Tabela de módulos permitidos
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
      console.log('Dados dos módulos recebidos:', data); // Log para verificar os dados recebidos

      if (data.list.length > 0) {
        const availableModules = data.list[0]; // Supondo que você só tenha uma linha com os checkboxes
        console.log('Módulos atualizados:', availableModules); // Verificar os módulos antes de setar
        setModules(availableModules); // Atualiza o estado com os módulos
      }
    } else {
      console.error('Erro ao buscar os módulos:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao buscar os módulos:', error);
  }
};

useEffect(() => {
  // Função que chama os módulos e as configurações
  const fetchData = () => {
    fetchModules();     // Busca os módulos disponíveis
    fetchAppSettings(); // Busca as configurações do app
  };

  // Chama a função imediatamente quando o componente é montado
  fetchData();

  // Configura o intervalo para chamar a função a cada 5 segundos
  const intervalId = setInterval(() => {
    fetchData();
  }, 5000); // 5000 ms = 5 segundos

  // Limpa o intervalo quando o componente for desmontado
  return () => clearInterval(intervalId);
}, []);


  // Função para buscar as configurações do app
  const fetchAppSettings = async () => {
    const colorsTableId = 'mi4m06fy7w1u5h2'; // Tabela de cores

    try {
      const response = await fetch(`${baseUrl}${colorsTableId}/records`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'xc-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.list.length > 0) {
          const settings = data.list[0];

          // Atualiza a cor primária (CircleLoader) com o valor recebido do NocoDB
          if (settings.primaryColor) {
            setPrimaryColor(settings.primaryColor);
          }

          // Atualiza a cor dos ícones com o valor recebido do NocoDB
          if (settings.iconColor) {
            setIconColor(settings.iconColor);
          }
        }
      } else {
        console.error('Erro ao buscar as configurações do app:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar as configurações do app:', error);
    }
  };

  const handleMinhasFaturasClick = () => {
    navigate('/financeiro');
  };
  
  

  useEffect(() => {
    fetchModules(); // Busca os módulos disponíveis
    fetchAppSettings(); // Busca as configurações do app
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', color: '#5b5b5b' }}>
        Acesso rápido
      </Typography>
      <Box className="acesso-rapido-scroll" sx={{ display: 'flex', overflowX: 'auto', gap: '15px' }}>
        {modules.SubModulo_MWiFi && (
          <Paper
            elevation={0}
            sx={{
              minWidth: '120px',
              textAlign: 'center',
              borderRadius: '10px',
              backgroundColor: '#f5f5f5',
              margin: '0',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/wifi')}
          >
            <WifiIcon sx={{ fontSize: 30, color: iconColor, padding: '20px' }} />
            <Typography sx={{ marginTop: '10px', fontSize: '14px', color: iconColor }}>Meu Wi-Fi</Typography>
          </Paper>
        )}
        
        {modules.SubModulo_MFaturas && (
          <Paper
            elevation={0}
            sx={{
              minWidth: '120px',
              textAlign: 'center',
              borderRadius: '10px',
              backgroundColor: '#f5f5f5',
              margin: '0',
              cursor: 'pointer'
            }}
            onClick={handleMinhasFaturasClick}
          >
            <ReceiptIcon sx={{ fontSize: 30, color: iconColor, padding: '20px' }} />
            <Typography sx={{ marginTop: '10px', fontSize: '14px', color: iconColor }}>Minhas Faturas</Typography>
          </Paper>
        )}

        {modules.SubModulo_MAtendimentos && (
          <Paper
            elevation={0}
            sx={{
              minWidth: '120px',
              textAlign: 'center',
              borderRadius: '10px',
              backgroundColor: '#f5f5f5',
              margin: '0',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/detalhes')}
          >
            <PersonIcon sx={{ fontSize: 30, color: iconColor, padding: '20px' }} />
            <Typography sx={{ marginTop: '10px', fontSize: '14px', color: iconColor }}>Atendimentos</Typography>
          </Paper>
        )}
      </Box>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="loading-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '300px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: '12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircleLoader className="loading-modal" color={primaryColor} size={25} />
          <Typography id="loading-modal-title" variant="h6" sx={{ marginTop: 2 }}>
            {loadingMessage}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

export default AcessoRapido;
