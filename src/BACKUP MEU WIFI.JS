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
    // Função para buscar a cor primária e ícones do NocoDB
    const fetchPrimaryColorAndIcons = async () => {
      const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Substitua pelo token correto
      try {
        const response = await fetch('https://nocodb.nexusnerds.com.br/api/v2/tables/mw1lsgk4ka13uhs/records', {
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
            // Define a cor secundária
            if (settings.secudaryColor) {
              setSecudaryColor(settings.secudaryColor);
            }
            // Define a cor MuiIcon
            if (settings.muiIconColor) {
              setmuiIconColor(settings.muiIconColor);
            }
            // Define a cor do texto MuiIcon
            if (settings.textmuilColor) {
              settextmuilColor(settings.textmuilColor);
            }
            // Define o ícone dinamicamente com base no nome do ícone retornado pela API
            if (settings.iconName) {
              setIconName(settings.iconName); // Define o nome do ícone dinamicamente
            }
  
            // Atualiza o estado com a URL do ícone de configuração
            if (settings.IconConfig && settings.IconConfig.length > 0) {
              setIconConfigUrl(`https://nocodb.nexusnerds.com.br/${settings.IconConfig[0].signedPath}`);
            }
          }
        } else {
          console.error('Erro ao buscar as configurações:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar as configurações:', error);
      }
    };
  
    // Executa a função a cada X segundos (por exemplo, 30 segundos)
    const intervalId = setInterval(fetchPrimaryColorAndIcons, 3000); // 30 segundos
  
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
  const serialNumber = equipamentoSelecionado.serialNumber;

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

  const serialNumber = equipamentoSelecionado.serialNumber;

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
  
    const serialNumber = equipamentoSelecionado.serialNumber;
  
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

  // Função para buscar os hosts de um dispositivo
  const buscarHosts = async (serialNumber) => {
    try {
      const response = await fetch('https://www.appmax.nexusnerds.com.br/api/v1/devices/getHosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deviceId: serialNumber }) 
      });

      if (response.ok) {
        const data = await response.json();

        // Filtrar apenas hosts ativos
        const hostsFiltrados = data.hosts.filter((host) => host.active === true);

        // Separar hosts por tipo de rede
        const hosts2g = hostsFiltrados.filter((host) => host.interfaceType === '802.11'); 
        const hosts5g = hostsFiltrados.filter((host) => host.interfaceType === '802.11ac'); 
        const ethernetHosts = hostsFiltrados.filter((host) => host.interfaceType === 'Ethernet'); 

        // Capturar SSIDs únicos
        const ssids2gUnicos = [...new Set(hosts2g.map((host) => host.ssid))]; 
        const ssids5gUnicos = [...new Set(hosts5g.map((host) => host.ssid))]; 

        setSsids2g(ssids2gUnicos); 
        setSsids5g(ssids5gUnicos); 
        setEthernetHosts(ethernetHosts); 

        setSsidSelecionado(ssids2gUnicos[0] || ssids5gUnicos[0] || ''); 
        setAllHosts(hostsFiltrados);
        setHosts(hostsFiltrados);
      } else {
        console.error('Erro ao buscar hosts:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar hosts:', error);
    }
  };

  useEffect(() => {
    const dadosClienteRaw = localStorage.getItem('dadosCliente');
    if (!dadosClienteRaw) {
      console.error('Nenhum dado encontrado no localStorage.');
      return;
    }

    const dadosCliente = JSON.parse(dadosClienteRaw);
    if (dadosCliente.dadosCliente && dadosCliente.dadosCliente.Onu && dadosCliente.dadosCliente.Onu['ACS.json'] && dadosCliente.dadosCliente.Onu['ACS.json'].Equipamento) {
      const dispositivos = dadosCliente.dadosCliente.Onu['ACS.json'].Equipamento;
      setEquipamentos(dispositivos);

      if (dispositivos.length > 0) {
        setLoginSelecionado(dispositivos[0].pppLogin);
        setDadosOnu(dispositivos[0]);
        buscarHosts(dispositivos[0].serialNumber); 
      }
    } else {
      console.error('Estrutura de dados inesperada: ', dadosCliente);
    }
  }, []);

  const handleLoginChange = (event) => {
    const novoLoginSelecionado = event.target.value;
    setLoginSelecionado(novoLoginSelecionado);

    const equipamentoSelecionado = equipamentos.find(equip => equip.pppLogin === novoLoginSelecionado);
    if (equipamentoSelecionado) {
      setDadosOnu(equipamentoSelecionado);
      buscarHosts(equipamentoSelecionado.serialNumber); 
    }
  };

  const handleSsidChange = (event) => {
    const selectedSsid = event.target.value;
    setSsidSelecionado(selectedSsid);

    // Filtra os hosts conectados para o SSID selecionado
    const filteredHosts = allHosts.filter((host) => host.ssid === selectedSsid);
    setHosts(filteredHosts);
  };

  const handleVerMaisClick = () => {
    navigate('/todos-hosts', { state: { hosts } });
  };
  


  
  
  
  
  

  const handleOpenRedeModal = (tipo) => {
    setAlteracaoTipo(tipo); // Definindo se é para alterar nome ou senha
    setOpenRedeModal(true); // Abrindo o modal de seleção de rede
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
        row
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        {equipamentos.map((equipamento, index) => (
          <FormControlLabel
            key={index}
            value={equipamento.pppLogin}
            control={<Radio />}
            label={`${equipamento.pppLogin}`}
            sx={{
              '& .MuiTypography-root': { fontSize: '12px', fontWeight: 'bold' },
              '& .MuiRadio-root': { color: primaryColor ||'#047B02' },
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
        MenuProps={{
          PaperProps: {
            style: {
              backgroundColor: '#F9F9F9',
              borderRadius: '12px',
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
            },
          },
        }}
      >
        <MenuItem disabled>Redes 2G:</MenuItem>
        {ssids2g.map((ssid, index) => (
          <MenuItem key={index} value={ssid}>
            {ssid} (2G)
          </MenuItem>
        ))}
        <MenuItem disabled>Redes 5G:</MenuItem>
        {ssids5g.map((ssid, index) => (
          <MenuItem key={index} value={ssid}>
            {ssid} (5G)
          </MenuItem>
        ))}
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


    </Box>
  );
};

export default MeuWiFi;
