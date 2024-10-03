import React, { useEffect, useState } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button, Paper, MenuItem, Select, Modal, Fab, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import WifiIcon from '@mui/icons-material/Wifi';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RoofingIcon from '@mui/icons-material/Roofing';
import RouterIcon from '@mui/icons-material/Router';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AppSettingsAltRoundedIcon from '@mui/icons-material/AppSettingsAltRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SettingsApplicationsRoundedIcon from '@mui/icons-material/SettingsApplicationsRounded';
import SettingsInputAntennaRoundedIcon from '@mui/icons-material/SettingsInputAntennaRounded';
import PermDataSettingRoundedIcon from '@mui/icons-material/PermDataSettingRounded';
import DisplaySettingsRoundedIcon from '@mui/icons-material/DisplaySettingsRounded';

const MeuWiFi = () => {
  const [dadosOnu, setDadosOnu] = useState(null);
  const [equipamentos, setEquipamentos] = useState([]);
  const [loginSelecionado, setLoginSelecionado] = useState('');
  const [hosts, setHosts] = useState([]);
  const [allHosts, setAllHosts] = useState([]); // Todos os hosts para filtrar posteriormente
  const [ssidSelecionado, setSsidSelecionado] = useState('');
  const [ssids2g, setSsids2g] = useState([]);
  const [ssids5g, setSsids5g] = useState([]);
  const [ethernetHosts, setEthernetHosts] = useState([]);
  const [openModal, setOpenModal] = useState(false); 
  const [openRedeModal, setOpenRedeModal] = useState(false); 
  const [selectedRede, setSelectedRede] = useState(''); 
  const [openNomeModal, setOpenNomeModal] = useState(false); 
  const [openSenhaModal, setOpenSenhaModal] = useState(false); 
  const [newWiFiName, setNewWiFiName] = useState('');
  const [newWiFiPassword, setNewWiFiPassword] = useState('');
  const [alteracaoTipo, setAlteracaoTipo] = useState(''); 
  const [alterarAmbasFrequencias, setAlterarAmbasFrequencias] = useState(false); // Nova adição para alterar ambas frequências
  const [successModalOpen, setSuccessModalOpen] = useState(false); // Controle do modal de sucesso
  const [newWiFiPassword2_4, setNewWiFiPassword2_4] = useState('');
  const [newWiFiPassword5_8, setNewWiFiPassword5_8] = useState('');
  const [primaryColor, setPrimaryColor] = useState('green'); // Cor primária
  const [secudaryColor, setSecudaryColor] = useState('green'); // Cor secundária
  const [muiIconColor, setmuiIconColor] = useState('#b7a3ff'); // Cor secundária
  const [textmuilColor, settextmuilColor] = useState('#ccc'); // Cor secundária 
  const [iconConfigUrl, setIconConfigUrl] = useState(''); // URL do ícone de configuração
  const [iconName, setIconName] = useState('SettingsIcon'); // Nome do ícone dinâmico
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [onuMac, setOnuMac] = useState(""); // Defina o estado inicial para onu_mac
  const [redesFiltradas, setRedesFiltradas] = useState({ redes2g: [], redes5g: [] });
  const [id_cliente, setIdCliente] = useState(null); // Inicialize o estado para o ID do cliente
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');






  // Mapeamento dos ícones disponíveis
  const iconsMap = {
    Settings: <SettingsIcon />,
    Wifi: <WifiIcon />,
    Home: <HomeIcon />,
    AccountCircle: <AccountCircleIcon />,
    RoofingIcon: <RoofingIcon />,
    RouterIcon: <RouterIcon />,
    SettingsSuggestIcon: <SettingsSuggestIcon />,
    AppSettingsAltRoundedIcon: <AppSettingsAltRoundedIcon />,
    AutoAwesomeRoundedIcon: <AutoAwesomeRoundedIcon />,
    SettingsApplicationsRoundedIcon: <SettingsApplicationsRoundedIcon />,
    SettingsInputAntennaRoundedIcon: <SettingsInputAntennaRoundedIcon />,
    PermDataSettingRoundedIcon: <PermDataSettingRoundedIcon />,
    DisplaySettingsRoundedIcon: <DisplaySettingsRoundedIcon/>,
  };
  



  useEffect(() => {
    // IDs das tabelas
    const colorsTableId = 'mn37trxp7ai1efw'; // Tabela de cores
    const iconsTableId = 'm27t8z8ht25mplj'; // Tabela de ícones
    const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Substitua pelo token correto
  
    // Função para buscar a cor primária e ícones do NocoDB
    const fetchPrimaryColorAndIcons = async () => {
      try {
        // Buscando as configurações de cores
        const responseColors = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${colorsTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });
  
        if (responseColors.ok) {
          const dataColors = await responseColors.json();
          if (dataColors.list.length > 0) {
            const settingsColors = dataColors.list[0];
  
            // Define a cor primária
            if (settingsColors.primaryColor) {
              setPrimaryColor(settingsColors.primaryColor);
            }
            // Define a cor secundária
            if (settingsColors.secudaryColor) {
              setSecudaryColor(settingsColors.secudaryColor);
            }
            // Define a cor MuiIcon
            if (settingsColors.muiIconColor) {
              setmuiIconColor(settingsColors.muiIconColor);
            }
            // Define a cor do texto MuiIcon
            if (settingsColors.textmuilColor) {
              settextmuilColor(settingsColors.textmuilColor);
            }
          }
        } else {
          console.error('Erro ao buscar as configurações de cores:', responseColors.statusText);
        }
  
        // Buscando as configurações de ícones
        const responseIcons = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${iconsTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });
  
        if (responseIcons.ok) {
          const dataIcons = await responseIcons.json();
          if (dataIcons.list.length > 0) {
            const settingsIcons = dataIcons.list[0];
  
            // Define o ícone dinamicamente com base no nome do ícone retornado pela API
            if (settingsIcons.iconName) {
              setIconName(settingsIcons.iconName); // Define o nome do ícone dinamicamente
            }
  
            // Atualiza o estado com a URL do ícone de configuração
            if (settingsIcons.IconConfig && settingsIcons.IconConfig.length > 0) {
              setIconConfigUrl(`https://nocodb.nexusnerds.com.br/${settingsIcons.IconConfig[0].signedPath}`);
            }
          }
        } else {
          console.error('Erro ao buscar as configurações de ícones:', responseIcons.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar as configurações:', error);
      }
    };
  
    // Executa a função a cada 5000 milissegundos (5 segundos)
    const intervalId = setInterval(fetchPrimaryColorAndIcons, 5000); // 5 segundos
  
    // Executa a função imediatamente quando o componente é montado
    fetchPrimaryColorAndIcons();
  
    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);
   
  


  const navigate = useNavigate();

  // Função para abrir o modal de redes
  const handleSelectRede = (rede) => {
    setSelectedRede(rede);
    setOpenRedeModal(false); 
    if (alteracaoTipo === 'nome') {
      setOpenNomeModal(true); 
    } else if (alteracaoTipo === 'senha') {
      setOpenSenhaModal(true);
    }
  };


  async function enviarConfiguracaoParaAPI(requestBody) {
    try {
      const response = await fetch('https://www.appmax.nexusnerds.com.br/api/v1/devices/setCredentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log('Configuração enviada com sucesso:', responseData);
        return {
          status: 200,
          data: responseData,
        };
      } else {
        console.error('Erro na resposta da API:', responseData);
        return {
          status: response.status,
          error: responseData,
        };
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação para a API:', error);
      return {
        status: 500,
        error: error.message,
      };
    }
  }
  
  
  async function tentarAplicarConfiguracao(requestBody) {
    const maxTentativas = 4;
    let tentativas = 0;
  
    while (tentativas < maxTentativas) {
      tentativas++;
      console.log(`Tentativa ${tentativas} de aplicar configuração...`);
  
      try {
        const response = await enviarConfiguracaoParaAPI(requestBody);
  
        if (response.status === 200) {
          console.log("Configuração enviada com sucesso:", response.data);
          setSuccessModalOpen(true);  // Abrir o modal de sucesso
          return;  // Parar as tentativas, pois foi bem-sucedido.
        } else {
          console.error("Erro ao aplicar SSID:", response.error);
  
          if (response.error.message && response.error.message.includes('Parameter not found')) {
            console.log('Parâmetro não encontrado, tentando configuração alternativa...');
  
            const fallbackWifiSsidList = {
              "InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID": requestBody[Object.keys(requestBody)[0]].wifiSsid["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID"],
            };
  
            const fallbackRequestBody = {
              [Object.keys(requestBody)[0]]: {
                wifiSsid: fallbackWifiSsidList,
              },
            };
  
            console.log('Tentativa de fallback para W4:', JSON.stringify(fallbackRequestBody, null, 2));
  
            const fallbackResponse = await enviarConfiguracaoParaAPI(fallbackRequestBody);
            if (fallbackResponse.status === 200) {
              console.log('Configuração alternativa aplicada com sucesso.');
              setWarningModalOpen(true);  // Abrir o modal de aviso
              return;  // Parar as tentativas
            } else {
              console.error('Erro na tentativa de configuração alternativa:', fallbackResponse.error);
            }
          }
        }
      } catch (error) {
        console.error(`Erro na tentativa ${tentativas}:`, error.message || error);
      }
    }
  
    console.error("Todas as tentativas falharam.");
    setWarningModalOpen(true);  // Abrir o modal de aviso em vez de erro
  }
  
  
  
  
  
  

  const handleSubmitNome = async () => {
    const equipamentoSelecionado = equipamentos.find(equip => equip.pppLogin === loginSelecionado);
    
    // Aqui, utilize o MAC como serial number
    const serialNumber = equipamentoSelecionado.onu_mac; // Mude de serialNumber para onu_mac
  
    console.log('Serial Number do equipamento:', serialNumber);
  
    if (!equipamentoSelecionado) {
      console.error('Nenhum equipamento correspondente ao PPPoE selecionado.');
      return;
    }
  
    if (!serialNumber) {
      console.error('Serial number não encontrado.');
      return;
    }
  
    if (!newWiFiName) {
      console.error('Pelo menos um SSID deve ser fornecido.');
      return;
    }

  const wifiSsidList = {};

// Lógica para cada fabricante e modelo
if (serialNumber.startsWith("TDTC")) {
  // Tenda
  if (alterarAmbasFrequencias || selectedRede === 'ambas') {
    for (let i = 1; i <= 5; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
    for (let i = 6; i <= 10; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
  } else if (selectedRede === "2G") {
    for (let i = 6; i <= 10; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
  } else if (selectedRede === "5G") {
    for (let i = 1; i <= 5; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
  }
} else if (serialNumber.startsWith("ALCL")) {
  // Nokia
  if (alterarAmbasFrequencias || selectedRede === 'ambas') {
    for (let i = 1; i <= 4; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
    for (let i = 5; i <= 8; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
  } else if (selectedRede === "2G") {
    for (let i = 1; i <= 4; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
  } else if (selectedRede === "5G") {
    for (let i = 5; i <= 8; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
  }
} else if (serialNumber.startsWith("223A")) {
  // TP-Link
  if (alterarAmbasFrequencias || selectedRede === 'ambas') {
    wifiSsidList["Device.WiFi.SSID.1.SSID"] = newWiFiName;
    wifiSsidList["Device.WiFi.SSID.3.SSID"] = newWiFiName;
  } else if (selectedRede === "2G") {
    wifiSsidList["Device.WiFi.SSID.1.SSID"] = newWiFiName;
  } else if (selectedRede === "5G") {
    wifiSsidList["Device.WiFi.SSID.3.SSID"] = newWiFiName;
  }
} else if (serialNumber.startsWith("00EB")) {
  // Mercusys
  if (alterarAmbasFrequencias || selectedRede === 'ambas') {
    wifiSsidList["Device.WiFi.SSID.1.SSID"] = newWiFiName;
    wifiSsidList["Device.WiFi.SSID.3.SSID"] = newWiFiName;
  } else if (selectedRede === "2G") {
    wifiSsidList["Device.WiFi.SSID.1.SSID"] = newWiFiName;
  } else if (selectedRede === "5G") {
    wifiSsidList["Device.WiFi.SSID.3.SSID"] = newWiFiName;
  }
} else if (serialNumber.startsWith("443B") || serialNumber.startsWith("4851")) {
  // Intelbras W4-300F e W5-1200f
  if (alterarAmbasFrequencias || selectedRede === 'ambas') {
    // Tenta aplicar para ambas as frequências no W5-1200f (tanto 2G quanto 5G)
    wifiSsidList["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID"] = newWiFiName; // SSID 5G no W5
    wifiSsidList["InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID"] = newWiFiName; // SSID 2G no W5
  } else if (selectedRede === "2G") {
    // Aplica para 2G no W5-1200f ou W4-300F
    wifiSsidList["InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID"] = newWiFiName; // SSID 2G no W5
    wifiSsidList["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID"] = newWiFiName; // SSID 2G no W4
  } else if (selectedRede === "5G") {
    // Aplica para 5G no W5-1200f
    wifiSsidList["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID"] = newWiFiName; // SSID 5G no W5
  }

  // Tentativa de fallback para o W4, que não tem suporte ao 5G
  try {
    const requestBody = {
      [serialNumber]: {
        wifiSsid: wifiSsidList,
      },
    };

    console.log('Tentativa de aplicar SSID:', JSON.stringify(requestBody, null, 2));

    const response = await enviarConfiguracaoParaAPI(requestBody);

    if (response.status === 200) {
      console.log('SSID aplicado com sucesso.');
    } else {
      throw new Error('Erro ao aplicar SSID.');
    }
  } catch (error) {
    console.error('Erro ao aplicar SSID. Tentando alternativa para W4...');

    // Tentativa para W4, que tem apenas 2G
    const fallbackWifiSsidList = {
      "InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID": newWiFiName // SSID 2G no W4
    };

    const fallbackRequestBody = {
      [serialNumber]: {
        wifiSsid: fallbackWifiSsidList,
      },
    };

    console.log('Tentativa alternativa para W4:', JSON.stringify(fallbackRequestBody, null, 2));

    const fallbackResponse = await enviarConfiguracaoParaAPI(fallbackRequestBody);

    if (fallbackResponse.status === 200) {
      console.log('SSID aplicado com sucesso no W4.');
    } else {
      console.error('Falha ao aplicar SSID no W4:', fallbackResponse);
    }
  }
} else if (serialNumber.startsWith("ITBS")) {
  // Intelbras ONT-1200R
  if (alterarAmbasFrequencias || selectedRede === 'ambas') {
    for (let i = 1; i <= 5; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
    for (let i = 6; i <= 10; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
  } else if (selectedRede === "2G") {
    for (let i = 6; i <= 10; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
  } else if (selectedRede === "5G") {
    for (let i = 1; i <= 5; i++) {
      wifiSsidList[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.SSID`] = newWiFiName;
    }
  }
} else if (serialNumber.startsWith("TW0")) {
  // D-Link DIR-615
  if (selectedRede === "2G" || selectedRede === "5G" || selectedRede === "ambas") {
    wifiSsidList["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID"] = newWiFiName;
    console.log('Aplicando SSID para D-Link DIR-615 (2G)');
  } else {
    console.error('Nenhuma rede válida selecionada.');
  }
} else {
  console.error('Fabricante ou modelo desconhecido.');
}

// Verifique se o objeto wifiSsidList não está vazio
if (Object.keys(wifiSsidList).length === 0) {
  console.error('Nenhum SSID selecionado. O corpo da solicitação está vazio.');
  return;
}


  const requestBody = {
    [serialNumber]: {
      wifiSsid: wifiSsidList,
    },
  };

  console.log('Corpo da solicitação para SSID:', JSON.stringify(requestBody, null, 2));

  try {
    await tentarAplicarConfiguracao(requestBody);  // Usando a função de repetição aqui
  } catch (error) {
    console.error('Erro ao aplicar SSID:', error);
  }
};

  


const handleSubmitSenha = async () => {
  const equipamentoSelecionado = equipamentos.find(equip => equip.pppLogin === loginSelecionado);

  if (!equipamentoSelecionado) {
    console.error('Nenhum equipamento correspondente ao PPPoE selecionado.');
    return;
  }

  const serialNumber = equipamentoSelecionado.onu_mac; // Mude de serialNumber para onu_mac

  if (!serialNumber) {
    console.error('Serial number não encontrado.');
    return;
  }

  if (!newWiFiPassword) {
    console.error('Pelo menos uma senha deve ser fornecida.');
    return;
  }

  const wifiPasswordParameters = {};

  // Lógica para Intelbras W4-300F e W5-1200f
  if (serialNumber.startsWith("443B")) {
    // Se for o W5-1200F (que suporta 5G)
    if (alterarAmbasFrequencias || selectedRede === 'ambas') {
      wifiPasswordParameters["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase"] = newWiFiPassword; // 5G
      wifiPasswordParameters["InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.PreSharedKey.1.KeyPassphrase"] = newWiFiPassword; // 2G
    } else if (selectedRede === "2G") {
      wifiPasswordParameters["InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.PreSharedKey.1.KeyPassphrase"] = newWiFiPassword; // 2G
    } else if (selectedRede === "5G") {
      wifiPasswordParameters["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase"] = newWiFiPassword; // 5G
    }

    // Tentativa alternativa se falhar
    try {
      const requestBody = {
        [serialNumber]: {
          wifiPassword: wifiPasswordParameters,
        },
      };

      console.log('Tentativa de aplicar senha:', JSON.stringify(requestBody, null, 2));

      const response = await enviarConfiguracaoParaAPI(requestBody);

      if (response.status === 200) {
        console.log('Senha aplicada com sucesso.');
        setSuccessModalOpen(true); // Abre o modal de sucesso
        return;
      } else {
        throw new Error('Erro ao aplicar senha.');
      }
    } catch (error) {
      console.error('Erro ao aplicar senha. Tentando alternativa para W4...');

      // Tentativa para W4, que tem apenas 2G
      const fallbackWifiPasswordParameters = {
        "InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.KeyPassphrase": newWiFiPassword, // 2G no W4
      };

      const fallbackRequestBody = {
        [serialNumber]: {
          wifiPassword: fallbackWifiPasswordParameters,
        },
      };

      console.log('Tentativa alternativa para W4:', JSON.stringify(fallbackRequestBody, null, 2));

      const fallbackResponse = await enviarConfiguracaoParaAPI(fallbackRequestBody);

      if (fallbackResponse.status === 200) {
        console.log('Senha aplicada com sucesso no W4.');
        setSuccessModalOpen(true); // Abre o modal de sucesso
      } else {
        console.error('Falha ao aplicar senha no W4:', fallbackResponse);
        setWarningModalOpen(true); // Abre o modal de aviso em laranja
      }
    }
  }

  // Lógica para outros fabricantes e modelos (exemplo: Tenda, Nokia, TP-Link, etc.)
  else if (serialNumber.startsWith("TDTC")) {
    // Lógica para Tenda
    if (alterarAmbasFrequencias || selectedRede === 'ambas') {
      for (let i = 1; i <= 5; i++) {
        wifiPasswordParameters[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.PreSharedKey.1.KeyPassphrase`] = newWiFiPassword;
      }
      for (let i = 6; i <= 10; i++) {
        wifiPasswordParameters[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.PreSharedKey.1.KeyPassphrase`] = newWiFiPassword;
      }
    } else if (selectedRede === "2G") {
      for (let i = 6; i <= 10; i++) {
        wifiPasswordParameters[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.PreSharedKey.1.KeyPassphrase`] = newWiFiPassword;
      }
    } else if (selectedRede === "5G") {
      for (let i = 1; i <= 5; i++) {
        wifiPasswordParameters[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.PreSharedKey.1.KeyPassphrase`] = newWiFiPassword;
      }
    }
  } else if (serialNumber.startsWith("ALCL")) {
    // Lógica para Nokia
    if (alterarAmbasFrequencias || selectedRede === 'ambas') {
      for (let i = 1; i <= 4; i++) {
        wifiPasswordParameters[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.PreSharedKey.1.KeyPassphrase`] = newWiFiPassword;
      }
      for (let i = 5; i <= 8; i++) {
        wifiPasswordParameters[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.PreSharedKey.1.KeyPassphrase`] = newWiFiPassword;
      }
    } else if (selectedRede === "2G") {
      for (let i = 1; i <= 4; i++) {
        wifiPasswordParameters[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.PreSharedKey.1.KeyPassphrase`] = newWiFiPassword;
      }
    } else if (selectedRede === "5G") {
      for (let i = 5; i <= 8; i++) {
        wifiPasswordParameters[`InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}.PreSharedKey.1.KeyPassphrase`] = newWiFiPassword;
      }
    }
  } else if (serialNumber.startsWith("223A")) {
    // Lógica para TP-Link
    if (alterarAmbasFrequencias || selectedRede === 'ambas') {
      wifiPasswordParameters["Device.WiFi.AccessPoint.1.Security.KeyPassphrase"] = newWiFiPassword;
      wifiPasswordParameters["Device.WiFi.AccessPoint.3.Security.KeyPassphrase"] = newWiFiPassword;
    } else if (selectedRede === "2G") {
      wifiPasswordParameters["Device.WiFi.AccessPoint.1.Security.KeyPassphrase"] = newWiFiPassword;
    } else if (selectedRede === "5G") {
      wifiPasswordParameters["Device.WiFi.AccessPoint.3.Security.KeyPassphrase"] = newWiFiPassword;
    }
  }

  // Verifique se o objeto wifiPasswordParameters não está vazio
  if (Object.keys(wifiPasswordParameters).length === 0) {
    console.error('Nenhuma senha selecionada. O corpo da solicitação está vazio.');
    return;
  }

  const requestBody = {
    [serialNumber]: {
      wifiPassword: wifiPasswordParameters,
    },
  };

  console.log('Corpo da solicitação para senha:', JSON.stringify(requestBody, null, 2));

  try {
    await tentarAplicarConfiguracao(requestBody, "senha");  // Usar a função de repetição para aplicar a senha
  } catch (error) {
    console.error('Erro ao aplicar senha:', error);
  }
};


  const handleReiniciarEquipamento = () => {
    // Verifique se o login (PPPoE) foi selecionado para obter o serialNumber correto
    const equipamentoSelecionado = equipamentos.find(equip => equip.pppLogin === loginSelecionado);
  
    if (!equipamentoSelecionado) {
      console.error('Nenhum equipamento correspondente ao PPPoE selecionado.');
      alert('Erro: Nenhum equipamento correspondente ao PPPoE selecionado.');
      return;
    }
  
    const serialNumber = equipamentoSelecionado.onu_mac; // Mude de serialNumber para onu_mac
  
    if (!serialNumber) {
      console.error('Serial number não encontrado.');
      alert('Erro: Serial number não encontrado.');
      return;
    }
  
    const url = 'https://www.appmax.nexusnerds.com.br/api/v1/devices/reboot'; // URL do back-end que vai lidar com o reboot
  
    console.log("Enviando requisição de reboot para:", url);
    console.log("Serial number do equipamento:", serialNumber);
  
    // Fazer a requisição para o backend, enviando o serial number capturado
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId: serialNumber }), // Enviar o serial number no corpo
    })
      .then((response) => {
        if (response.ok) {
          console.log('Equipamento reiniciado com sucesso.');
          setSuccessModalOpen(true); // Exibe o modal de sucesso
        } else {
          response.json().then((data) => {
            console.error('Erro ao tentar reiniciar o dispositivo:', data.message);
          });
        }
      })
      .catch((error) => {
        console.error('Erro ao tentar reiniciar o dispositivo:', error);
      });
  };
  
  

  const handleOpenConfigModal = () => {
    setOpenModal(true);
  };

  const handleCloseConfigModal = () => {
    setOpenModal(false);
  };

  const handleAlterarNome = () => {
    setAlteracaoTipo('nome');
    setOpenRedeModal(true);
  };

  const handleAlterarSenha = () => {
    setAlteracaoTipo('senha');
    setOpenRedeModal(true);
  };

  // Fechar modais de nome e senha
  const handleCloseNomeModal = () => setOpenNomeModal(false);
  const handleCloseSenhaModal = () => setOpenSenhaModal(false);

  useEffect(() => {
    const loadClientData = () => {
      const storedData = localStorage.getItem('dadosCliente');
      if (storedData) {
        try {
          const dadosCliente = JSON.parse(storedData);
          console.log('Dados Cliente:', dadosCliente);
  
          // Aqui estamos acessando o id_cliente corretamente
          const idCliente = dadosCliente.id_cliente; 
  
          if (idCliente) {
            fetchOnuData(idCliente); // Chame a função de buscar dados da ONU com o idCliente
          } else {
            console.error('ID do cliente não encontrado.');
          }
        } catch (error) {
          console.error('Erro ao carregar os dados do cliente do localStorage:', error);
        }
      } else {
        console.log('Nenhum dado do cliente encontrado no localStorage.');
      }
    };
  
  
    const fetchOnuData = async (idCliente) => {
      try {
        const response = await fetch(`https://www.db.app.nexusnerds.com.br/onu-data?id_cliente=${idCliente}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Dados da ONU:', data);
  
          // Atualiza o campo ppplogin com o valor do campo login da ONU
          const equipamentosAtualizados = data.map(item => ({
            pppLogin: item.login,  // Aqui está a alteração para preencher o ppplogin com o login
            onu_mac: item.onu_mac, // Caso você ainda precise do onu_mac em outro lugar
            ...item  // Inclui os demais campos que possam vir dos dados da ONU
          }));
          setEquipamentos(equipamentosAtualizados);  // Atualiza o estado com os dados modificados
        } else {
          console.error('Erro ao buscar os dados da ONU:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar os dados da ONU:', error);
      }
    };
  
    loadClientData();
  }, []);  // Aqui está o fechamento correto da função useEffect
  
  

  const fetchOnuData = async (idCliente) => {
    // Verifica se o idCliente é válido
    if (!idCliente) {
      console.error('ID do cliente não fornecido.');
      return;
    }
  
    try {
      const response = await fetch(`https://www.appmax.nexusnerds.com.br/onu-data?id_cliente=${idCliente}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Dados da ONU:', data); // Verifique a estrutura dos dados aqui
  
        // Verifica se os dados estão no formato esperado
        if (Array.isArray(data)) {
          // Atualiza o campo ppplogin com o valor do campo login da ONU
          const equipamentosAtualizados = data.map(item => ({
            pppLogin: item.login,
            onu_mac: item.onu_mac,
            ...item
          }));
          setEquipamentos(equipamentosAtualizados);
        } else {
          console.error('Formato de dados inesperado:', data);
        }
      } else {
        console.error('Erro ao buscar os dados da ONU:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar os dados da ONU:', error);
    }
  };
  
  
  useEffect(() => {
    if (id_cliente) {
      fetchOnuData(id_cliente);
    }
  }, [id_cliente]);
  
  

  

    


// Função para salvar hosts no localStorage
const salvarHostsNoLocalStorage = (hosts) => {
  localStorage.setItem('hosts', JSON.stringify(hosts)); // Armazena os hosts como string JSON
};

// Após buscar os hosts, salve-os
const fetchHosts = async (onuMac) => {
  console.log('Buscando hosts para o MAC da ONU:', onuMac);
  try {
    const response = await fetch('https://www.appmax.nexusnerds.com.br/api/v1/devices/getHosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId: onuMac }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.hosts) {
        console.log('Dados dos hosts:', data.hosts);

        const hostsFiltrados = data.hosts.filter((host) => host.active === true);
        setHosts(hostsFiltrados);
        salvarHostsNoLocalStorage(hostsFiltrados); // Salve os hosts no localStorage
        console.log('Hosts filtrados (ativos):', hostsFiltrados);
      } else {
        console.error('Formato inesperado nos dados retornados:', data);
      }
    } else {
      console.error('Erro ao buscar hosts:', response.statusText);
      setModalMessage('O equipamento não possui a função desejada.');
      setModalOpen(true);
    }
  } catch (error) {
    console.error('Erro ao buscar hosts:', error);
    setModalMessage('O equipamento não possui a função desejada.');
    setModalOpen(true);
  }
};

// Chame a função fetchHosts dentro do useEffect no corpo do componente React
useEffect(() => {
  if (onuMac) {
    fetchHosts(onuMac); // Chama a função para buscar os hosts quando `onuMac` mudar
  }
}, [onuMac]); // Adicione `onuMac` como dependência


  
// Função para verificar se os hosts estão no localStorage
const verificarHostsNoLocalStorage = () => {
  const hostsSalvos = localStorage.getItem('hosts'); // Tenta obter os hosts armazenados
  if (hostsSalvos) {
    const hosts = JSON.parse(hostsSalvos); // Converte de volta para um objeto/array
    console.log('Hosts encontrados no localStorage:', hosts);
    setHosts(hosts); // Atualiza o estado com os hosts encontrados
  } else {
    console.log('Nenhum host encontrado no localStorage.');
  }
};

// Chame essa função ao montar o componente ou em um useEffect, por exemplo:
useEffect(() => {
  verificarHostsNoLocalStorage(); // Verifica e carrega os hosts do localStorage, se existirem
}, []);

  

// Função para buscar interfaces Wi-Fi de um dispositivo (onuMac)
const fetchWiFiInterfaces = async (onuMac) => {
  try {
    const response = await fetch(`https://www.appmax.nexusnerds.com.br/devices/${onuMac}/wifi`);  // Chama a rota criada no back-end
    if (response.ok) {
      const wifiData = await response.json();
      console.log('Interfaces Wi-Fi recebidas:', wifiData);

      // Filtra as redes ativas (enable: true) para 2.4GHz e 5.8GHz
      const redes2gAtivas = (wifiData['2.4'] || []).filter(wifi => wifi.enable === true);
      const redes5gAtivas = (wifiData['5.8'] || []).filter(wifi => wifi.enable === true);

      // Atualiza o estado com os SSIDs das redes ativas
      setSsids2g(redes2gAtivas.map(wifi => wifi.ssid));
      setSsids5g(redes5gAtivas.map(wifi => wifi.ssid));

      console.log('Redes 2G Habilitadas:', redes2gAtivas);
      console.log('Redes 5G Habilitadas:', redes5gAtivas);
    } else {
      console.error('Erro ao buscar as interfaces Wi-Fi:', response.statusText);
      setModalMessage('O equipamento não possui a função desejada.');
      setModalOpen(true);
    }
  } catch (error) {
    console.error('Erro ao buscar as interfaces Wi-Fi:', error);
    setModalMessage('O equipamento não possui a função desejada.');
    setModalOpen(true);
  }
};


  useEffect(() => {
    if (onuMac) {
      fetchWiFiInterfaces(onuMac); // Agora usa onuMac corretamente
    }
  }, [onuMac]); // O useEffect é acionado quando onuMac é atualizado




// Chamando a função após o login ser selecionado
useEffect(() => {
  if (loginSelecionado) {
    const equipamentoSelecionado = equipamentos.find(equip => equip.pppLogin === loginSelecionado);
    if (equipamentoSelecionado) {
      fetchWiFiInterfaces(equipamentoSelecionado.onu_mac);  // Chama a função para buscar interfaces Wi-Fi
    }
  }
}, [loginSelecionado]);



  
  useEffect(() => {
    fetchOnuData();  // Buscar os dados da ONU e hosts ao montar o componente
  }, []);

  const handleLoginChange = (event) => {
    const novoLoginSelecionado = event.target.value;
    setLoginSelecionado(novoLoginSelecionado);
  
    const equipamentoSelecionado = equipamentos.find(equip => equip.login === novoLoginSelecionado);
    if (equipamentoSelecionado) {
      setDadosOnu(equipamentoSelecionado);
      fetchHosts(equipamentoSelecionado.onu_mac);  // Usando o onu_mac corretamente aqui
    }
  };
  
  
  const handleSsidChange = (event) => {
    const selectedSsid = event.target.value;
    setSsidSelecionado(selectedSsid);
    console.log("SSID selecionado:", selectedSsid);
  
    // Verifica se há hosts no localStorage
    const hostsSalvos = localStorage.getItem('hosts');
    if (hostsSalvos) {
      const todosHosts = JSON.parse(hostsSalvos);
  
      // Filtra os hosts com base no SSID selecionado
      const hostsFiltrados = todosHosts.filter((host) => host.ssid === selectedSsid);
      setHosts(hostsFiltrados);
      console.log('Hosts filtrados para o SSID selecionado:', hostsFiltrados);
    } else {
      console.log('Nenhum host encontrado no localStorage.');
    }
  };
  






  
  
  
  

  const handleVerMaisClick = () => {
    navigate('/todos-hosts', { state: { hosts } });
  };
  


  
  
  
  
  

  const handleOpenRedeModal = (tipo) => {
    setAlteracaoTipo(tipo); // Definindo se é para alterar nome ou senha
    setOpenRedeModal(true); // Abrindo o modal de seleção de rede
  };

  // Função para processar as interfaces Wi-Fi e filtrar as habilitadas
const processWiFiInterfaces = (wifiData) => {
  const redes2g = wifiData["2.4"].filter(rede => rede.enable === true);  // Filtrar apenas as redes habilitadas
  const redes5g = wifiData["5.8"].filter(rede => rede.enable === true);  // Filtrar apenas as redes habilitadas
  
  // Agora você pode atualizar os estados ou processar os dados como necessário
  console.log("Redes 2G Habilitadas:", redes2g);
  console.log("Redes 5G Habilitadas:", redes5g);
  
  // Você pode retornar os dados filtrados ou usar os estados conforme necessário
  return { redes2g, redes5g };
};


  
  return (
    <Box sx={{ padding: '20px', height: '100vh', position: 'relative' }}>
    <Typography variant="h6" gutterBottom sx={{ color: primaryColor }}>
        Meu Wi-Fi
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Selecione uma rede
      </Typography>

      <RadioGroup
          value={loginSelecionado}
          onChange={handleLoginChange}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', // Duas colunas
            gap: '10px', // Espaçamento entre os itens
            marginBottom: '20px',
          }}
        >
  {equipamentos.map((equipamento, index) => (
    <FormControlLabel
      key={index}
      value={equipamento.login} // Certifique-se de que está utilizando o campo correto
      control={<Radio />}
      label={`${equipamento.login}`} // Exibe o pppLogin ou login
      sx={{
        '& .MuiTypography-root': { fontSize: '12px', fontWeight: 'bold' },
        '& .MuiRadio-root': { color: primaryColor || '#047B02' },
        '& .MuiFormControlLabel-label': { color: '#000' },
      }}
    />
  ))}
        </RadioGroup>





        <Select
          value={ssidSelecionado}
          onChange={handleSsidChange}
          displayEmpty
          variant="outlined"
          sx={{
            backgroundColor: '#F9F9F9',
            borderRadius: '12px',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
            width: '100%',
            fontWeight: 'bold',
            '.MuiOutlinedInput-notchedOutline': { borderColor: primaryColor || '#047B02' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: secudaryColor ||'#047B02' },
            '.MuiSelect-icon': { color: secudaryColor ||'#4CAF50' },
          }}
        >
          <MenuItem disabled>Redes 2G:</MenuItem>
          {ssids2g.length > 0 ? ssids2g.map((ssid, index) => (
            <MenuItem key={index} value={ssid}>
              {ssid} (2G)
            </MenuItem>
          )) : <MenuItem disabled>Nenhuma rede 2G disponível</MenuItem>}
          
          <MenuItem disabled>Redes 5G:</MenuItem>
          {ssids5g.length > 0 ? ssids5g.map((ssid, index) => (
            <MenuItem key={index} value={ssid}>
              {ssid} (5G)
            </MenuItem>
          )) : <MenuItem disabled>Nenhuma rede 5G disponível</MenuItem>}
        </Select>






      <Box sx={{ marginTop: '20px' }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: secudaryColor ||'#4CAF50',
          }}
        >
          Hosts Conectados <span style={{ fontSize: '14px', color: '#6E6E6E' }}>(Rede {ssidSelecionado})</span>
        </Typography>

        {hosts.length > 0 ? (
          hosts.slice(0, 3).map((host, index) => (
            <Paper
              key={index}
              sx={{
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}
                >
                  {host.hostName || 'Desconhecido'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                  <strong>IP:</strong> {host.ipAddress || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                  <strong>MAC:</strong> {host.macAddress || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '12px',
                    color: textmuilColor ||'#222',
                    padding: '4px 10px',
                    backgroundColor: muiIconColor || '#f9f9f9',
                    borderRadius: '8px',
                  }}
                >
                  {host.interfaceType}
                </Typography>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: '#999' }}>
            Nenhum host conectado.
          </Typography>
        )}

        {hosts.length > 3 && (
          <Box sx={{ textAlign: 'center', marginTop: '15px' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: primaryColor || '#4CAF50',
                '&:hover': { backgroundColor: secudaryColor ||'#388E3C' },
              }}
              onClick={handleVerMaisClick}
            >
              Ver mais
            </Button>
          </Box>
        )}
      </Box>

      <Fab
        sx={{
          position: 'fixed',
          bottom: '76px',
          right: '16px',
          backgroundColor: primaryColor || '#4CAF50',
          color: '#fff',
          '&:hover': { backgroundColor: secudaryColor || '#388E3C' }
        }}
        onClick={() => {
          console.log("Configuração aberta");
          handleOpenConfigModal();
        }}
      >
        {iconsMap[iconName] || <SettingsIcon />} {/* Renderiza o ícone dinamicamente */}
      </Fab>



      {/* Modais de configuração */}
      <Modal open={openModal} onClose={handleCloseConfigModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ padding: '20px', width: '300px', borderRadius: '10px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: '15px', color: secudaryColor || '#4CAF50' }}>
            Configurações do Equipamento
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            sx={{ marginBottom: '10px', color: secudaryColor || '#4CAF50', borderColor: primaryColor || '#4CAF50' }}
            onClick={() => handleOpenRedeModal('nome')}
          >
            Alterar Nome
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ marginBottom: '10px', color: secudaryColor ||'#4CAF50', borderColor: primaryColor ||'#4CAF50' }}
            onClick={() => handleOpenRedeModal('senha')}
          >
            Alterar Senha
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}
            onClick={handleReiniciarEquipamento}
          >
            Reiniciar Equipamento
          </Button>
        </Paper>
      </Modal>



      {/* Modal de redes */}
      <Modal open={openRedeModal} onClose={() => setOpenRedeModal(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ padding: '20px', width: '300px', borderRadius: '10px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: '15px', color: primaryColor ||'#4CAF50' }}>
            Selecione a Rede
          </Typography>
          <Button fullWidth sx={{ marginBottom: '10px', color: secudaryColor ||'#4CAF50'  }} onClick={() => handleSelectRede('2G')}>
            Rede 2G
          </Button>
          <Button fullWidth sx={{ marginBottom: '10px', color: secudaryColor ||'#4CAF50' }} onClick={() => handleSelectRede('5G')}>
            Rede 5G
          </Button>
          <Button fullWidth sx={{ marginBottom: '10px', color: secudaryColor ||'#4CAF50' }} onClick={() => handleSelectRede('ambas')}>
            Ambas
          </Button>
        </Paper>
      </Modal>

      {/* Modal de nome */}
      <Modal open={openNomeModal} onClose={handleCloseNomeModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ padding: '20px', width: '300px', borderRadius: '10px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: '15px', color: secudaryColor ||'#4CAF50' }}>
            Alterar Nome da Rede ({selectedRede})
          </Typography>
          <TextField fullWidth label="Novo Nome Wi-Fi" variant="outlined" value={newWiFiName} onChange={(e) => setNewWiFiName(e.target.value)} sx={{ marginBottom: '15px' }} />
          <Button fullWidth variant="contained" sx={{ backgroundColor: primaryColor ||'#4CAF50', '&:hover': { backgroundColor: secudaryColor ||'#388E3C' } }} onClick={handleSubmitNome}>
            Alterar Nome
          </Button>
        </Paper>
      </Modal>

      {/* Modal de senha */}
      <Modal open={openSenhaModal} onClose={handleCloseSenhaModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ padding: '20px', width: '300px', borderRadius: '10px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: '15px', color: '#4CAF50' }}>
            Alterar Senha da Rede ({selectedRede})
          </Typography>
          <TextField fullWidth label="Nova Senha Wi-Fi" type="password" variant="outlined" value={newWiFiPassword} onChange={(e) => setNewWiFiPassword(e.target.value)} sx={{ marginBottom: '15px' }} />
          <Button fullWidth variant="contained" sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }} onClick={handleSubmitSenha}>
            Alterar Senha
          </Button>
        </Paper>
      </Modal>

      <Modal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Paper sx={{ padding: '20px', width: '300px', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ marginBottom: '15px', color: primaryColor ||'#4CAF50', }}>
              Operação Concluída
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '15px' }}>
              A operação foi realizada com sucesso!
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: primaryColor ||'#4CAF50', '&:hover': { backgroundColor: secudaryColor || '#388E3C' } }}
              onClick={() => setSuccessModalOpen(false)}
            >
              Fechar
            </Button>
          </Paper>
        </Modal>


      {/* Modal de sucesso */}
      <Modal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{ padding: '20px', width: '300px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: '15px', color: primaryColor || '#4CAF50' }}>
            Operação Concluída
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: '15px' }}>
            A operação foi realizada com sucesso!
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: primaryColor || '#4CAF50',
              '&:hover': { backgroundColor: secudaryColor || '#388E3C' },
            }}
            onClick={() => setSuccessModalOpen(false)}
          >
            Fechar
          </Button>
        </Paper>
      </Modal>

      {/* Modal de aviso (Warning) */}
      <Modal
        open={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{ padding: '20px', width: '300px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: '15px', color: '#FFA500' }}>
            Aviso
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: '15px' }}>
            O dispositivo pode não ter total compatibilidade com os parâmetros de alteração. Algumas mudanças podem não ter sido aplicadas corretamente.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#FFA500',
              '&:hover': { backgroundColor: '#FF8C00' },
            }}
            onClick={() => setWarningModalOpen(false)}
          >
            Fechar
          </Button>
        </Paper>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{ padding: '20px', width: '300px', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ marginBottom: '15px', color: '#FF0000' }}> {/* Cor vermelha para erro */}
            Erro
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: '15px' }}>
            {modalMessage} {/* Mensagem de erro */}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#FF0000', // Cor vermelha para o botão
              '&:hover': { backgroundColor: '#B22222' }, // Cor ao passar o mouse
            }}
            onClick={() => setModalOpen(false)}
          >
            Fechar
          </Button>
        </Paper>
      </Modal>




    </Box>
  );
};

export default MeuWiFi;
