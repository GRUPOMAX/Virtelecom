import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, Modal, Box, Typography } from '@mui/material';
import { Home, Description, AttachMoney, HelpOutline, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';

function Footer({ value, onChange, setDados }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#28a745'); // Cor padrão
  const [footerIconColor, setFooterIconColor] = useState('#28a745'); // Cor padrão para os ícones do footer
  const [modules, setModules] = useState({
    SubModuloFooter_Inicio: false,
    SubModuloFooter_Planos: false,
    SubModuloFooter_Financeiro: false,
    SubModuloFooter_Duvidas: false,
    SubModuloFooter_Perfil: false,
  });

// Função para buscar cliente enviando o CPF/CNPJ via POST
const buscarCliente = async (cpfCnpj) => {
  try {
    // Abrir o modal com a mensagem animada
    setLoadingMessage('Aguarde... Carregando Dados Financeiros.');
    setIsModalOpen(true);

    const response = await fetch('https://www.appmax.nexusnerds.com.br/buscar-cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cnpj_cpf: cpfCnpj }),
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Dados do cliente recebidos:', data);

    // Recupera dados existentes no localStorage
    const existingData = JSON.parse(localStorage.getItem('dadosCliente2')) || {};

    // Mescla os dados existentes com os novos dados
    const updatedData = { ...existingData, ...data };

    // Atualiza o estado com os novos dados
    setDados(updatedData);

    // Atualiza o localStorage com os dados mesclados
    localStorage.setItem('dadosCliente2', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Erro ao buscar o cliente:', error.message);
  } finally {
    // Fechar o modal após a conclusão da solicitação
    setIsModalOpen(false);
  }
};






  // Função para buscar as configurações de cores e aplicar
  const fetchAppSettings = async () => {
    const colorsTableId = 'mn37trxp7ai1efw'; // ID da tabela de cores no NocoDB
    const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação

    try {
      const response = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${colorsTableId}/records`, {
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

          // Atualiza as cores com os valores da tabela de cores
          if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
          if (settings.footerIconColor) setFooterIconColor(settings.footerIconColor);
        }
      } else {
        console.error('Erro ao buscar as configurações de cores:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar as configurações de cores:', error);
    }
  };

  // Função para buscar os módulos do footer dinamicamente
  const fetchFooterModules = async () => {
    const footerTableId = 'msafdyz6sew21f1'; // ID da tabela do footer no NocoDB
    const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação

    try {
      const response = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${footerTableId}/records`, {
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
          setModules({
            SubModuloFooter_Inicio: !!settings.SubModuloFooter_Inicio,
            SubModuloFooter_Planos: !!settings.SubModuloFooter_Planos,
            SubModuloFooter_Financeiro: !!settings.SubModuloFooter_Financeiro,
            SubModuloFooter_Duvidas: !!settings.SubModuloFooter_Duvidas,
            SubModuloFooter_Perfil: !!settings.SubModuloFooter_Perfil,
          });
        }
      } else {
        console.error('Erro ao buscar os módulos do footer:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar os módulos do footer:', error);
    }
  };
  useEffect(() => {
    const fetchAppSettings = async () => {
      const colorsTableId = 'mn37trxp7ai1efw';
      const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5';
  
      // Verifique se as configurações de cores já estão no localStorage
      const storedColors = localStorage.getItem('appColors');
      if (storedColors) {
        const parsedColors = JSON.parse(storedColors);
        setPrimaryColor(parsedColors.primaryColor);
        setFooterIconColor(parsedColors.footerIconColor);
        console.log('Cores carregadas do localStorage:', parsedColors);
      } else {
        // Se as cores não estiverem no localStorage, busca da API
        try {
          const response = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${colorsTableId}/records`, {
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
  
              if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
              if (settings.footerIconColor) setFooterIconColor(settings.footerIconColor);
  
              // Salva as configurações de cores no localStorage
              localStorage.setItem('appColors', JSON.stringify({
                primaryColor: settings.primaryColor,
                footerIconColor: settings.footerIconColor,
              }));
              console.log('Cores salvas no localStorage:', settings);
            }
          } else {
            console.error('Erro ao buscar as configurações de cores:', response.statusText);
          }
        } catch (error) {
          console.error('Erro ao buscar as configurações de cores:', error);
        }
      }
    };
  
    // Chama as funções de busca de configurações
    fetchAppSettings();
    fetchFooterModules(); // Certifique-se de chamar a função para buscar os módulos do footer
    
  // Configura um intervalo para chamar essas funções periodicamente (a cada 5 minutos)
  const intervalId = setInterval(() => {
    fetchAppSettings();
    fetchFooterModules();
  }, 50000); // 50000 ms = 5 Segundos

  // Limpa o intervalo quando o componente for desmontado
  return () => clearInterval(intervalId);
}, []);
  



  const handleNavigation = async (newValue) => {
    if (typeof onChange === 'function') {
      onChange(newValue);
    } else {
      console.error('onChange não é uma função');
    }

    const cnpjCpf = localStorage.getItem('cnpj_cpf');

    switch (newValue) {
      case 0:
        navigate('/home');
        break;
      case 1:
        navigate('/planos');
        break;
      case 2:
        if (cnpjCpf) {
          await buscarCliente(cnpjCpf);
        } else {
          console.log('CPF/CNPJ não disponível.');
        }
        navigate('/financeiro');
        break;
      case 3:
        navigate('/duvidas');
        break;
      case 4:
        navigate('/perfil');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  return (
    <>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => handleNavigation(newValue)}
        showLabels
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          backgroundColor: '#e0e0e0',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {modules.SubModuloFooter_Inicio && (
          <BottomNavigationAction
            label={<span className="footer-label">Início</span>}
            icon={<Home className="footer-icon" style={{ color: footerIconColor }} />}
          />
        )}
        {modules.SubModuloFooter_Planos && (
          <BottomNavigationAction
            label={<span className="footer-label">Planos</span>}
            icon={<Description className="footer-icon" style={{ color: footerIconColor }} />}
          />
        )}
        {modules.SubModuloFooter_Financeiro && (
          <BottomNavigationAction
            label={<span className="footer-label">Financeiro</span>}
            icon={<AttachMoney className="footer-icon" style={{ color: footerIconColor }} />}
          />
        )}
        {modules.SubModuloFooter_Duvidas && (
          <BottomNavigationAction
            label={<span className="footer-label">Dúvidas</span>}
            icon={<HelpOutline className="footer-icon" style={{ color: footerIconColor }} />}
          />
        )}
        {modules.SubModuloFooter_Perfil && (
          <BottomNavigationAction
            label={<span className="footer-label">Perfil</span>}
            icon={<Person className="footer-icon" style={{ color: footerIconColor }} />}
          />
        )}
      </BottomNavigation>

      {/* Modal para exibir a mensagem animada */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} aria-labelledby="loading-modal-title">
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
            justifyContent: 'center',
          }}
        >
          <CircleLoader className="loading-modal" color={primaryColor} size={25} />

          <Typography id="loading-modal-title" variant="h6" sx={{ marginTop: 2 }}>
            {loadingMessage}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default Footer;
