import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Modal, CircularProgress } from '@mui/material';
import { Notifications, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';
import useFetchAppSettings from './useFetchAppSettings'; // Custom hook for settings

function Header() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const [logoUrl, setLogoUrl] = useState(''); // State to store the URL or image
  const [primaryColor, setPrimaryColor] = useState('#28a745'); // State for primary color
  const { primaryColor: fetchedPrimaryColor } = useFetchAppSettings(); // Fetch from the custom hook
  const [dadosCliente, setDadosCliente] = useState(null); // Estado para armazenar os dados do cliente

  // Função para formatar o nome do cliente
  const formatarNome = (nomeCompleto) => {
    if (!nomeCompleto) return 'Cliente';
    const primeiroNome = nomeCompleto.split(' ')[0];
    return primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();
  };

  const nomeCliente = formatarNome(dadosCliente?.razao_social_nome || 'Cliente');

  // Função para buscar os dados do cliente do localStorage
  const fetchDadosCliente = () => {
    const dadosArmazenados = localStorage.getItem('dadosCliente');
    if (dadosArmazenados) {
      const dados = JSON.parse(dadosArmazenados);
      setDadosCliente(dados); // Carregar os dados do cliente armazenados
      if (dados?.logoUrl) {
        setLogoUrl(dados.logoUrl); // Carregar a URL da imagem se disponível
        console.log('Logo URL encontrada:', dados.logoUrl);
      } else {
        console.warn('URL da logo não encontrada nos dados do cliente.');
      }
    } else {
      console.warn('Nenhum dado de cliente encontrado no localStorage.');
    }
  };

// Função para buscar logo da API
const fetchLogo = async () => {
  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Substitua pelo token correto
  const logoBackgroundTableId = 'm44x9fhvp92huzq'; // Tabela de logo e background

  try {
    const response = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${logoBackgroundTableId}/records`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Dados recebidos da API:', data); // Log para verificar os dados recebidos da API

      if (data.list.length > 0) {
        let newLogoUrl = null;

        // Atualiza a logo, priorizando o URL do NoCoDB ou um link direto se existir
        newLogoUrl = data.list[0].urlLogo || 
          (data.list[0]['URL  - LOGO EMPRESA'] && data.list[0]['URL  - LOGO EMPRESA'].length > 0 
            ? `https://nocodb.nexusnerds.com.br/${data.list[0]['URL  - LOGO EMPRESA'][0].signedPath}` 
            : null);

        if (newLogoUrl) {
          setLogoUrl(newLogoUrl);
          localStorage.setItem('logoUrl', newLogoUrl); // Salva a URL da logo no localStorage
          console.log('Logo URL salva no localStorage:', newLogoUrl);
        } else {
          console.warn('Nenhuma logo encontrada.');
        }
      }
    } else {
      console.error('Erro ao buscar a logo:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao buscar a logo:', error);
  }
};


  console.log('URL da logo:', logoUrl);

  // Handle logout and clear cache
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.clear();
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate('/'); // Redirect to login screen
        window.location.reload();
      }, 500); 
    } catch (error) {
      console.error('Erro durante o logout:', error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    fetchDadosCliente(); // Chama a função para buscar os dados do cliente do localStorage
    fetchLogo(); // Chama a função para buscar a logo ao montar o componente
  }, []); // [] garante que o useEffect seja chamado apenas uma vez

  return (
    <Box sx={{ background: '#fff', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Logo and greeting */}
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/home')}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            style={{ width: '40px', marginRight: '10px' }} // Ajustar o tamanho da logo conforme necessário
          />
        ) : (
          <Typography variant="h6" sx={{ color: '#ff0000', fontSize: '10px' }}>
            Carregando
          </Typography>
        )}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Olá, {nomeCliente}!
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d' }}>
            Como Podemos te Ajudar?
          </Typography>
        </Box>
      </Box>

      {/* Notification and logout icons */}
      <Box className="icon-container">
        {isLoggingOut ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <>
            <IconButton className="icon-button">
              <Notifications />
            </IconButton>
            <IconButton className="icon-button" onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </>
        )}
      </Box>

      {/* Modal for loading */}
      <Modal
        open={isLoggingOut}
        aria-labelledby="logout-loading-modal"
        aria-describedby="logout-processing-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircleLoader className="loading-modal" color={primaryColor} size={25} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Saindo... Por favor, aguarde.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

export default Header;
