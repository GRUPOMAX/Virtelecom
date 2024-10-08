import React, { useEffect, useState } from 'react';
import AcessoRapido from './AcessoRapido';
import Novidades from './Novidades';
import Destaque from './Destaque';
import Footer from './Footer';
import Suporte from './Suporte';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import axios from 'axios';

function Home({ dadosCliente }) {
  const [modules, setModules] = useState({});
  const [showSignaturePopup, setShowSignaturePopup] = useState(false);
  const [idContrato, setIdContrato] = useState(null);
  const [isActivated, setIsActivated] = useState(false); // Novo estado para armazenar o status de ativação
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [primaryColor, setPrimaryColor] = useState('#FFFFFF'); // Cor padrão
  const [secudaryColor, setsecudaryColor] = useState('#FFFFFF'); // Cor padrão
  const [muiIconColor, setMuiIconColor] = useState('#FFFFFF'); // Cor padrão
  const [textMuiColor, setTextMuiColor] = useState('#FFFFFF'); // Cor padrão



  const colorsTableId = 'mn37trxp7ai1efw'; // Tabela de cores

  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5';

  const modulesTableId = 'msafdyz6sew21f1';
  const baseUrl = 'https://nocodb.nexusnerds.com.br/api/v2/tables/';

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
        if (data.list.length > 0) {
          const modulesData = data.list[0];
          setModules(modulesData);
  
          // Verifique se o Modulo_AtivacaoContrato está ativo e, se sim, chame a verificação do contrato
          if (modulesData.Modulo_AtivacaoContrato) {
            checkContractSignature(); // Só chama essa função se o módulo estiver ativo
          } else {
            setShowSignaturePopup(false); // Se o módulo estiver desativado, não mostra o popup
          }
        }
      } else {
        console.error('Erro ao buscar os módulos:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar os módulos:', error);
    }
  };
    
// Função para verificar a assinatura de todos os contratos do cliente
const checkContractSignature = async () => {
  try {
    if (dadosCliente?.id_cliente) {
      console.log('Chamando o endpoint /contratos com id_cliente:', dadosCliente.id_cliente);

      const response = await axios.get(`https://www.db.app.nexusnerds.com.br/contratos?id_cliente=${dadosCliente.id_cliente}`);
      console.log('Resposta completa dos contratos:', response.data);

      if (response.data && Array.isArray(response.data)) {
        const contratos = response.data;

        // Verifica se existe algum contrato que não está ativado
        const algumContratoInativo = contratos.some(contrato => !contrato.is_activated);

        if (algumContratoInativo) {
          setShowSignaturePopup(true);
          console.log('Um ou mais contratos necessitam de assinatura.');
        } else {
          setShowSignaturePopup(false);
          console.log('Todos os contratos estão ativados. Modal ocultado.');
        }
      }
    } else {
      console.warn('ID do cliente não definido.');
    }
  } catch (error) {
    console.error('Erro ao verificar assinatura dos contratos:', error);
  }
};


  useEffect(() => {
    // Verifica a assinatura do contrato se o módulo estiver habilitado e o id_cliente do cliente estiver definido
    if (modules.Modulo_AtivacaoContrato && dadosCliente?.id_cliente) {
      checkContractSignature();
    } else {
      console.warn('Módulo de ativação desativado ou ID do cliente não definido.');
    }
  }, [modules.Modulo_AtivacaoContrato, dadosCliente?.id_cliente]); // Dispara somente quando essas condições mudarem
  

     // Função para buscar as configurações de cores do NocoDB
  const fetchPrimaryColor = async () => {
    try {
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
            setsecudaryColor(settingsColors.secudaryColor);
          }
          // Define a cor do ícone Mui
          if (settingsColors.muiIconColor) {
            setMuiIconColor(settingsColors.muiIconColor);
          }
          // Define a cor do texto Mui
          if (settingsColors.textMuiColor) {
            setTextMuiColor(settingsColors.textMuiColor);
          }
        }
      } else {
        console.error('Erro ao buscar as configurações de cores:', responseColors.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  useEffect(() => {
    // Executa a função para buscar as cores assim que o componente é montado
    fetchPrimaryColor();

    // Intervalo para atualizar as cores a cada 5 segundos
    const intervalId = setInterval(fetchPrimaryColor, 5000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);



  // Função para ativar o contrato
  const activateContract = async () => {
    try {
      console.log('ID do contrato enviado para ativação:', idContrato);
      if (idContrato) {
        const response = await axios.get(`https://www.appmax.nexusnerds.com.br/ativar-contrato-cliente?id_contrato=${idContrato}`);
        if (response.data.success) {
          setShowSignaturePopup(false); // Esconde o popup de assinatura
          setShowSuccessModal(true); // Mostra o modal de sucesso
          setIsActivated(true); // Atualiza o estado de ativação para true

          // Atualiza o banco de dados para marcar o contrato como ativado
          await axios.post('https://www.db.app.nexusnerds.com.br/atualizar-contrato', {
            id_contrato: idContrato,
            is_activated: true,
          });
          console.log('Contrato atualizado com sucesso no banco de dados.');
        } else {
          alert('Erro ao ativar o contrato.');
        }
      } else {
        console.warn('ID do contrato está indefinido. Verifique o processo de obtenção do contrato.');
      }
    } catch (error) {
      console.error('Erro ao ativar o contrato:', error);
      alert('Erro ao ativar o contrato.');
    }
  };


  useEffect(() => {
    if (dadosCliente) {
      checkContractSignature();
    }
  }, [dadosCliente]);

  useEffect(() => {
    fetchModules();
    const intervalId = setInterval(fetchModules, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', paddingBottom: '100px' }}>
      <Box sx={{ marginBottom: '20px' }}>
        {modules.Modulo_Novidades && <Novidades />}
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        {modules.Modulo_AcessoRapido && <AcessoRapido />}
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        {modules.Modulo_Destaques && <Destaque />}
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        {modules.Modulo_PrecisaSuporte && <Suporte />}
      </Box>

      {/* Popup de Assinatura */}
      <Dialog open={showSignaturePopup} onClose={() => setShowSignaturePopup(false)}>
        <DialogTitle>Assinatura de Contrato</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você precisa assinar o contrato para ativar o serviço.
          </DialogContentText>
          <DialogContentText>
            Para ativar o contrato, basta apenas clicar em "Ativar".
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button 
            onClick={() => setShowSignaturePopup(false)} 
            style={{ backgroundColor: secudaryColor, color: "#FFFFFF" }} // Cor de fundo e texto para "Fechar"
          >
            Fechar
          </Button>

          <Button 
            onClick={activateContract} 
            style={{ backgroundColor: primaryColor, color: "#FFFFFF" }} // Cor de fundo e texto para "Ativar"
            variant="contained"
          >
            Assinar
          </Button>

        </DialogActions>
      </Dialog>

            {/* Modal de Sucesso */}
            <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
              <DialogTitle>Sucesso</DialogTitle>
              <DialogContent>
                <DialogContentText>Contrato ativado com sucesso!</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowSuccessModal(false)} color="primary">OK</Button>
              </DialogActions>
            </Dialog>

      <Footer />
    </Box>
  );
}

export default Home;
