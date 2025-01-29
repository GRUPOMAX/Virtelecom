import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HelpCenterRoundedIcon from '@mui/icons-material/HelpCenterRounded';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';
import NotListedLocationRoundedIcon from '@mui/icons-material/NotListedLocationRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import DeviceUnknownRoundedIcon from '@mui/icons-material/DeviceUnknownRounded';
import SosRoundedIcon from '@mui/icons-material/SosRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import WifiPasswordRoundedIcon from '@mui/icons-material/WifiPasswordRounded';
import EnhancedEncryptionRoundedIcon from '@mui/icons-material/EnhancedEncryptionRounded';
import LockClockRoundedIcon from '@mui/icons-material/LockClockRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import PatternRoundedIcon from '@mui/icons-material/PatternRounded';
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';
import SignalWifi4BarLockRoundedIcon from '@mui/icons-material/SignalWifi4BarLockRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import WifiLockRoundedIcon from '@mui/icons-material/WifiLockRounded';
import PinRoundedIcon from '@mui/icons-material/PinRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';
import NoEncryptionRoundedIcon from '@mui/icons-material/NoEncryptionRounded';


// Mapeamento dos ícones disponíveis
const iconsMap = {
  LockIcon: <LockIcon />,
  PasswordRoundedIcon: <PasswordRoundedIcon/>,
  WifiPasswordRoundedIcon: <WifiPasswordRoundedIcon />,
  EnhancedEncryptionRoundedIcon: <EnhancedEncryptionRoundedIcon />,
  LockClockRoundedIcon: <LockClockRoundedIcon/>,
  LockOpenRoundedIcon: <LockOpenRoundedIcon />,
  LockResetRoundedIcon: <LockResetRoundedIcon />,
  PatternRoundedIcon: <PatternRoundedIcon />,
  GppGoodRoundedIcon: <GppGoodRoundedIcon/>,
  SignalWifi4BarLockRoundedIcon: <SignalWifi4BarLockRoundedIcon/>,
  KeyRoundedIcon: <KeyRoundedIcon />,
  WifiLockRoundedIcon: <WifiLockRoundedIcon />,
  PinRoundedIcon: <PinRoundedIcon />,
  VisibilityOffRoundedIcon: <VisibilityOffRoundedIcon />,
  HttpsRoundedIcon: <HttpsRoundedIcon />,
  NoEncryptionRoundedIcon: <NoEncryptionRoundedIcon />,





  






  //ICONES SUPORTTE
  HelpOutlineIcon: <HelpOutlineIcon />,
  HelpCenterRoundedIcon: <HelpCenterRoundedIcon/>,
  ContactSupportRoundedIcon: <ContactSupportRoundedIcon/>,
  NotListedLocationRoundedIcon: <NotListedLocationRoundedIcon />,
  InfoRoundedIcon: <InfoRoundedIcon/>,
  QuestionMarkRoundedIcon: <QuestionMarkRoundedIcon />,
  QuizRoundedIcon: <QuizRoundedIcon />,
  DeviceUnknownRoundedIcon: <DeviceUnknownRoundedIcon/>,
  SosRoundedIcon: <SosRoundedIcon/>,
  HelpOutlineRoundedIcon: <HelpOutlineRoundedIcon/>,



};

function Suporte() {
  const navigate = useNavigate(); // Para navegação entre páginas

  // Estados para cores e ícones dinâmicos
  const [primaryColor, setPrimaryColor] = useState('#28a745'); // Cor padrão
  const [secudaryColor, setSecudaryColor] = useState('#5b5b5b');
  const [muiIconColor, setmuiIconColor] = useState('#5b5b5b'); // Cor padrão dos ícones
  const [IconColorSupAndPass, setIconColorSupAndPass] = useState('#5b5b5b'); // Cor padrão dos ícones
  const [textmuilColor, settextmuilColor] = useState('#888');
  const [iconNameSupport, setIconNameSupport] = useState('HelpOutlineIcon'); // Ícone padrão
  const [iconNamePassword, setIconNamePassword] = useState('LockIcon'); // Ícone padrão
  const [iconConfigUrl, setIconConfigUrl] = useState(''); // URL do ícone carregado


// Função para buscar a cor primária e ícones do NocoDB
useEffect(() => {
  const colorsTableId = 'mi4m06fy7w1u5h2'; // Nova tabela de cores
  const iconsTableId = 'mio2lr97vak735b'; // Nova tabela de ícones
  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Substitua pelo token correto

  const fetchPrimaryColorAndIcons = async () => {
    // Fetch para a tabela de cores
    const fetchColors = async () => {
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
          
          // Define a cor primária
          if (settings.primaryColor) {
            setPrimaryColor(settings.primaryColor);
          }
          // Define a cor MuiIcon
          if (settings.IconColorSupAndPass) {
            setIconColorSupAndPass(settings.IconColorSupAndPass);
          }
          // Define a cor do texto MuiIcon
          if (settings.textmuilColor) {
            settextmuilColor(settings.textmuilColor);
          }
          // Define a cor secundária
          if (settings.secudaryColor) {
            setSecudaryColor(settings.secudaryColor);
          }
        } else {
          console.error('Nenhuma configuração de cores encontrada.');
        }
      } else {
        console.error('Erro ao buscar configurações de cores:', response.statusText);
      }
    };

    // Fetch para a tabela de ícones
    const fetchIcons = async () => {
      const response = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${iconsTableId}/records`, {
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

          // Define os ícones dinamicamente com base nos campos do NocoDB
          if (settings.iconNameSupport) {
            setIconNameSupport(settings.iconNameSupport); // Define o ícone de suporte dinamicamente
          }
          if (settings.iconNamePassword) {
            setIconNamePassword(settings.iconNamePassword); // Define o ícone da senha dinamicamente
          }

          // Atualiza o estado com a URL do ícone de configuração
          if (settings.IconConfig && settings.IconConfig.length > 0) {
            setIconConfigUrl(`https://nocodb.nexusnerds.com.br/${settings.IconConfig[0].signedPath}`);
          }
        } else {
          console.error('Nenhuma configuração de ícones encontrada.');
        }
      } else {
        console.error('Erro ao buscar configurações de ícones:', response.statusText);
      }
    };

    // Chama as funções de fetch
    await fetchColors();
    await fetchIcons();
  };

  // Executa a função a cada X segundos (por exemplo, 30 segundos)
  const intervalId = setInterval(fetchPrimaryColorAndIcons, 5000); // 30 segundos

  // Executa a função imediatamente quando o componente é montado
  fetchPrimaryColorAndIcons();

  // Limpa o intervalo quando o componente for desmontado
  return () => clearInterval(intervalId);
}, []);


  // Redireciona para a página Wi-Fi
  const handleWiFiClick = () => {
    navigate('/wifi');
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '552730123131'; // Código do país + número
    const message = 'Olá, preciso de suporte!'; // Mensagem inicial
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <Box sx={{ padding: '10px', marginTop: '-20px' }}>
      <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: secudaryColor }}>
        Precisa de Suporte?
      </Typography>

      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f5f5f5',
          padding: '10px 20px',
          borderRadius: '10px',
          marginBottom: '10px',
        }}
        onClick={handleWhatsAppClick} // Adiciona a ação de clique
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {iconNameSupport && iconsMap[iconNameSupport] &&
            React.cloneElement(iconsMap[iconNameSupport], { sx: { color: IconColorSupAndPass } })} {/* Aplica a cor dinâmica */}
          <Box sx={{ marginLeft: '15px' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: textmuilColor }}>Abra um Atendimento</Typography>
            <Typography sx={{ fontSize: '14px', color: '#888' }}>Tire suas dúvidas</Typography>
          </Box>
        </Box>



        <IconButton>
          <ArrowForwardIosIcon sx={{ fontSize: 20, color: '#888' }} />
        </IconButton>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f5f5f5',
          padding: '10px 20px',
          borderRadius: '10px',
        }}
        onClick={handleWiFiClick} // Navega para a página de Wi-Fi ao clicar
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {iconNamePassword && 
            React.cloneElement(iconsMap[iconNamePassword], { sx: { color: IconColorSupAndPass } })} {/* Aplica a cor dinâmica ao ícone */}
          <Box sx={{ marginLeft: '15px' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: textmuilColor }}>Alterar senha</Typography>
            <Typography sx={{ fontSize: '14px', color: '#888' }}>Alterar senha do Wi-Fi</Typography>
          </Box>
        </Box>
        <IconButton>
          <ArrowForwardIosIcon sx={{ fontSize: 20, color: '#888' }} />
        </IconButton>
      </Paper>
    </Box>
  );
}

export default Suporte;
