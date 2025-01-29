import React, { useState, useEffect } from 'react';
import { Tooltip ,Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Paper, Grid, Button, Snackbar, Alert, Modal, Collapse } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { format, differenceInCalendarDays, isBefore, isAfter } from 'date-fns';
import axios from 'axios';
import BroadcastOnHomeIcon from '@mui/icons-material/BroadcastOnHome';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';




/*TEXTOS*/
const textFaturaEmDia = 'Fatura Vencendo Hoje';
const textFaturAtrasa = 'Fatura Atrasada';
const textFaturAVencer = 'Fatura a Vencer';
const textProximFatura = 'Próxima Fatura';
const textDesbloqueio  = 'Desbloqueio Disponivel';





const verificarStatusFatura = (dataVencimento) => {
  const hoje = new Date();
  const vencimento = new Date(dataVencimento);
  const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);

  hoje.setHours(0, 0, 0, 0);
  vencimento.setHours(0, 0, 0, 0);

  if (vencimento.getTime() === hoje.getTime()) return textFaturaEmDia;
  if (vencimento < hoje) return textFaturAtrasa;
  if (vencimento >= proximoMes) return textFaturAVencer;
  return textProximFatura;
};


function Financeiro({ dados }) {
  const [openSnackbarSuccess, setOpenSnackbarSuccess] = useState(false);
  const [openBoletoModal, setOpenBoletoModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false); // Modal para confirmação
  const [sendingMethod, setSendingMethod] = useState(null); // Método de envio (WhatsApp ou Email)
  const [boletoSelecionado, setBoletoSelecionado] = useState(null); // Estado para armazenar o idBoleto
  const [pixData, setPixData] = useState(null); // Define o estado para armazenar as informações do Pix
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [boletos, setBoletos] = useState([]); // Estado para armazenar a lista de boletos
  const [boletoData, setBoletoData] = useState(null); // Variável que armazena o número do boleto
  const [boletoLink, setBoletoLink] = useState(null); // Link do boleto
  











  // Verifica se existe pelo menos um boleto
  const primeiroBoleto = dados?.boletos?.[0] || {};

  const valor = primeiroBoleto?.valor_aberto || '0,00';
  const dataVencimento = primeiroBoleto?.data_vencimento || 'Data não disponível';
  const gatewayLink = primeiroBoleto?.gateway_link || '#';
  const linhaDigitavel = primeiroBoleto?.linha_digitavel || 'Linha digitável não disponível';
  const qrCodePix = dados?.PixData?.qr_code || 'Chave Pix não disponível';
  const nomePagadorPix = dados?.PixData?.nome || 'Nome não disponível';
  const valorOriginalPix = dados?.PixData?.valor_original || 'Valor não disponível';
  const expiracaoPix = dados?.PixData?.expiracao || 'Expiração não disponível';
  const solicitacaoPagadorPix = dados?.PixData?.solicitacao_pagador || 'Solicitação não disponível';
  const idBoleto = primeiroBoleto?.id || ''; // Pegando o id do primeiro boleto



  // Defina os estados para armazenar as cores
  const [primaryColor, setPrimaryColor] = useState('#000'); // Cor padrão inicial
  const [secudaryColor, setsecudaryColor] = useState('#000'); // Cor padrão inicial
  const [highlightColor, setHighlightColor] = useState('#09DB05'); // Cor padrão inicial
  const [buttonColor, setButtonColor] = useState('#000'); // Cor padrão inicial
  const [cardBackgroundColor, setCardBackgroundColor] = useState('#F1F1F1'); // Cor padrão inicial
  const [iconePixUrl, setIconePixUrl] = useState('');
  const [iconeBarrasUrl, setIconeBarrasUrl] = useState('');
  const [iconeEnviarUrl, setIconeEnviarUrl] = useState('');
  const [textFinButton, settextFinButton] = useState('');
  // Estados para os ícones personalizados
  const [iconBoletoUrl, setIconBoletoUrl] = useState('');
  const [iconCorreioUrl, setIconCorreioUrl] = useState('');
  const [iconWhatsAppUrl, setIconWhatsAppUrl] = useState('');
  const [iconEmailUrl, setIconEmailUrl] = useState('');
  const [iconCopiarUrl, setIconCopiarUrl] = useState('');
  const [iconDownloadUrl, setIconDownloadUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState(''); // State to store the URL or image
  const [backgroundUrl, setBackgroundUrl] = useState(''); // Estado para armazenar o URL do background

  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [showProximasFaturas, setShowProximasFaturas] = useState(false);
  const [showProximaFatura, setShowProximaFatura] = useState(false);
  const [idContrato, setIdContrato] = useState(null);
  

  const [exibirBotaoDesbloqueio, setExibirBotaoDesbloqueio] = useState(false);
  const [iconOpenDesConfiança, setIconOpenDesConfiança] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const [faturasAtrasadas, setFaturasAtrasadas] = useState([]);
  const [proximaFatura, setProximaFatura] = useState(null);
  const [outrasFaturas, setOutrasFaturas] = useState([]);
  







  // Mapeamento dos ícones disponíveis
  const iconsMap = {
      BroadcastOnHomeIcon: <BroadcastOnHomeIcon />,
      HandshakeIcon:  <HandshakeIcon />,
      LockOpenIcon: < LockOpenIcon/>,
      CheckCircleOutlineIcon: < CheckCircleOutlineIcon/>,
      CheckCircleIcon: <CheckCircleIcon />,
      DoneOutlineIcon: <DoneOutlineIcon />,
      DoneAllIcon: <DoneAllIcon />,
      DoneIcon: <DoneIcon />,
      BroadcastOnPersonalIcon: <BroadcastOnPersonalIcon/>

    };



  useEffect(() => {
    // IDs das tabelas
    const colorsTableId = 'mi4m06fy7w1u5h2'; // Tabela de cores
    const iconsTableId = 'mio2lr97vak735b'; // Tabela de ícones
    const backgroundTableId = 'mvs9ovu9gjjgtiq'; // Tabela de backgrounds
  
    const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Substitua pelo token correto
  
    // Função para buscar as configurações de cores
    const fetchColorSettings = async () => {
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
          console.log('Configurações de cores:', data);
          if (data.list.length > 0) {
            const settings = data.list[0];
  
            // Atualizar os estados com as cores
            if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
            if (settings.secudaryColor) setsecudaryColor(settings.secudaryColor);
            if (settings.highlightColor) setHighlightColor(settings.highlightColor);
            if (settings.buttonColor) setButtonColor(settings.buttonColor);
            if (settings.cardBackgroundColor) setCardBackgroundColor(settings.cardBackgroundColor);
            if (settings.textFinButton) settextFinButton(settings.textFinButton);
          }
        } else {
          console.error('Erro ao buscar as configurações de cores:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar as configurações de cores:', error);
      }
    };
  
    // Função para buscar o background da tela em branco
    const fetchBackgroundSettings = async () => {
      try {
        const response = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${backgroundTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Configurações de background:', data);
          if (data.list.length > 0) {
            const settings = data.list[0];
  
            // Se o campo SetBG-TelaEmBranco estiver preenchido, define como background
            if (settings['SetBG-TelaEmBranco_Minhas Faturas']) {
              console.log('URL do background encontrada:', settings['SetBG-TelaEmBranco_Minhas Faturas']);
              setBackgroundUrl(settings['SetBG-TelaEmBranco_Minhas Faturas']);
            }
          }
        } else {
          console.error('Erro ao buscar as configurações de background:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar as configurações de background:', error);
      }
    };
  
    // Função para buscar as configurações de ícones
    const fetchIconSettings = async () => {
      try {
        const response = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${iconsTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Configurações de ícones:', data);
          if (data.list.length > 0) {
            const settings = data.list[0];
  
            // Atualizar os URLs dos ícones personalizados
            if (settings.iconePix) setIconePixUrl(settings.iconePix);
            if (settings.iconeBarras) setIconeBarrasUrl(settings.iconeBarras);
            if (settings.iconeEnviar) setIconeEnviarUrl(settings.iconeEnviar);
  
            // Ícones adicionais
            if (settings.PersonalizarIconBoleto) setIconBoletoUrl(settings.PersonalizarIconBoleto);
            if (settings.PersonalizarIconCorreio) setIconCorreioUrl(settings.PersonalizarIconCorreio);
            if (settings.PersonalizarIconWhatsApp) setIconWhatsAppUrl(settings.PersonalizarIconWhatsApp);
            if (settings.PersonalizarIconEmail) setIconEmailUrl(settings.PersonalizarIconEmail);
            if (settings.PersonalizarIconCopiar) setIconCopiarUrl(settings.PersonalizarIconCopiar);
            if (settings.PersonalizarIconDownload) setIconDownloadUrl(settings.PersonalizarIconDownload);
          }
        } else {
          console.error('Erro ao buscar as configurações de ícones:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar as configurações de ícones:', error);
      }
    };
  
    // Chama as funções para buscar configurações pela primeira vez
    fetchColorSettings();
    fetchIconSettings();
    fetchBackgroundSettings();
  
    // Configura a verificação periódica
    const intervalId = setInterval(() => {
      fetchColorSettings();
      fetchIconSettings();
      fetchBackgroundSettings();
    }, 5000); // Verifica a cada 5 segundos
  
    // Limpeza do intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);
  

  // Função para buscar o ícone diretamente da API
  useEffect(() => {
    const iconsTableId = 'mio2lr97vak735b'; // ID da tabela de ícones
    const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5';

    const fetchIcon = async () => {
      try {
        const responseIcons = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${iconsTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });

        if (responseIcons.ok) {
          const dataIcons = await responseIcons.json();
          const iconName = dataIcons.list[0]?.IconOpenDesConfiança;

          // Atualiza o estado iconOpenDesConfiança com o nome do ícone retornado pela API
          if (iconName) {
            setIconOpenDesConfiança(iconName);
          } else {
            console.warn('Ícone não encontrado na resposta da API:', iconName);
          }
        } else {
          console.error('Erro ao buscar ícones:', responseIcons.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar ícones:', error);
      }
    };

    fetchIcon();
  }, []);
  


  










  
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setCopied(false);
    setOpenSnackbarSuccess(false); // Fecha o popup de sucesso
  };




  
  const loadClientData = async () => {
    try {
      const response = await fetch('api.virtelecom.nexusnerds.com.br/buscarClienteNoArquivo/');
      const data = await response.json();
  
      if (data.cliente) {
        const hoje = new Date();
  
        // Filtra faturas atrasadas
        const faturasAtrasadas = data.cliente.boletos.filter(fatura => {
          const vencimento = new Date(fatura.vencimento);
          return vencimento < hoje && fatura.situacao !== 'P'; // Considerando faturas vencidas
        });
  
        // Filtra a próxima fatura (mais próxima no futuro)
        const proximaFatura = data.cliente.boletos
          .filter(fatura => new Date(fatura.vencimento) > hoje)
          .sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento))[0];
  
        // Outras faturas: as que não são nem atrasadas nem a próxima
        const outrasFaturas = data.cliente.boletos.filter(fatura => {
          const vencimento = new Date(fatura.vencimento);
          return vencimento >= hoje && fatura !== proximaFatura;
        });
  
        console.log("Faturas Atrasadas:", faturasAtrasadas);
        console.log("Próxima Fatura:", proximaFatura);
        console.log("Outras Faturas:", outrasFaturas);
  
        setFaturasAtrasadas(faturasAtrasadas);
        setProximaFatura(proximaFatura);
        setOutrasFaturas(outrasFaturas);
      }
    } catch (error) {
      console.error('Erro ao carregar os dados do cliente:', error);
    }
  };
  
  useEffect(() => {
    loadClientData();
  }, []);


      
      
      
      
      
      




  








const formatarDataBR = (data) => {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};



  // Função para abrir o modal e buscar a linha digitável
  useEffect(() => {
    if (boletoLink) {
      fetchBoletoData(boletoLink); // Chama a função quando o link do boleto é passado
    }
  }, [boletoLink]);






  useEffect(() => {
    const toggleTooltip = () => setShowTooltip(prev => !prev);
    const interval = setInterval(toggleTooltip, Math.floor(Math.random() * 5000) + 5000);

    return () => clearInterval(interval);
  }, []);


  const handleOpenModal = async (pixLink) => {
    try {
      const encodedLink = encodeURIComponent(pixLink);  // Codifica a URL
      const response = await fetch(`api.virtelecom.nexusnerds.com.br/get-pix-code?link=${encodedLink}`);
      const data = await response.json();
  
      if (data.pixCode) {
        setPixData(data.pixCode); // Atualiza o estado com o código Pix
        setOpenModal(true); // Abre o modal
      } else {
        throw new Error('Código Pix não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar código Pix:', error);
      setPixData(null); // Limpa o estado em caso de erro
    }
  };

// Função para copiar o código Pix para a área de transferência
const copyToClipboard = () => {
  if (pixData) {
    navigator.clipboard.writeText(pixData) // Copia o código Pix
      .then(() => {
        setCopied(true); // Atualiza o estado para indicar que o código foi copiado
        setOpenSnackbar(true); // Abre o snackbar para mostrar a mensagem de sucesso
      })
      .catch((err) => {
        console.error('Erro ao copiar para a área de transferência: ', err);
        setCopied(false); // Se houve erro, garante que a flag de "copiado" seja falsa
      });
  } else {
    console.error('Código Pix não disponível para copiar');
  }
};




 // Função para buscar a linha digitável do boleto
  const fetchBoletoData = async (boletoLink) => {
    try {
      const encodedLink = encodeURIComponent(boletoLink);  // Codifica a URL
      const response = await fetch(`api.virtelecom.nexusnerds.com.br/get-boleto-code?link=${encodedLink}`);
      const data = await response.json();

      if (data && data.boletoCode) {
        setBoletoData(data.boletoCode); // Atualiza o estado com a linha digitável
        setOpenBoletoModal(true); // Abre o modal
      } else {
        throw new Error('Linha digitável do boleto não encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar código do boleto:', error);
      setBoletoData(null); // Limpa o estado em caso de erro
    }
  };

// Função para copiar a linha digitável do boleto para a área de transferência
const copiarLinhaDigitavel = () => {
  if (boletoData) {
    navigator.clipboard.writeText(boletoData) // Copia a linha digitável
      .then(() => {
        setCopied(true); // Atualiza o estado para indicar que o código foi copiado
        setOpenSnackbar(true); // Abre o Snackbar de sucesso
      })
      .catch((err) => {
        console.error('Erro ao copiar para a área de transferência: ', err);
        setCopied(false); // Marca como não copiado
        setOpenSnackbar(true); // Abre o Snackbar de erro
      });
  } else {
    console.error('Linha digitável do boleto não disponível para copiar');
    setCopied(false); // Marca como não copiado
    setOpenSnackbar(true); // Abre o Snackbar de erro
  }
};

  
    // Função para abrir o modal e buscar a linha digitável
  const handleOpenBoletoModal = (boletoLink) => {
      console.log('Chamando a função handleOpenBoletoModal com o link:', boletoLink);
      setBoletoLink(boletoLink);
      fetchBoletoData(boletoLink); // Chama a função quando o link do boleto é passado
    };
  
  


  // Função para fechar o modal
  const handleCloseModal = () => {
    setOpenBoletoModal(false);
  };



// Função para filtrar as faturas
const hoje = new Date();

// Ordena todas as faturas por data de vencimento
const faturasOrdenadas = dados?.boletos
  ?.map((fatura) => ({
    ...fatura,
    valor_aberto: parseFloat(fatura.valor_aberto), // Converte valor_aberto para número
  }))
  .sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento)) || [];

console.log("Faturas Ordenadas:", faturasOrdenadas);
console.log("Faturas Atrasadas:", faturasAtrasadas);
console.log("Próxima Fatura:", proximaFatura);
console.log("Outras Faturas:", outrasFaturas);

  




const renderButton = ({ icon, label, onClick }) => (
        <Grid item xs={4} style={{ textAlign: 'center' }}>
          <Button
            variant="text"
            sx={{
              fontSize: '10px',
              display: 'flex',
              flexDirection: 'column',
              color: highlightColor || '#09DB05',
            }}
            onClick={onClick}
          >
            <img src={icon} alt={label} style={{ width: '24px' }} />
            <Typography
              variant="caption"
              sx={{ marginTop: '4px' }}
            >
              {label}
            </Typography>
          </Button>
        </Grid>
      );
    

useEffect(() => {
        console.log('Faturas Atrasadas:', faturasAtrasadas);
        console.log('Próxima Fatura:', proximaFatura);
      }, [faturasAtrasadas, proximaFatura]);
      

      const isValidURL = (url) => {
        try {
          new URL(url);
          return true;
        } catch (error) {
          return false;
        }
      };
      
  

      return (
        <div>
          <Box sx={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Minhas Faturas
            </Typography>
      
            {/* Renderizar as duas primeiras faturas de faturasOrdenadas */}
            {faturasOrdenadas && faturasOrdenadas.length > 0 && faturasOrdenadas.slice(0, 2).map((fatura) => {
              const dataVencimento = new Date(fatura.vencimento);
              const dataAtual = new Date();
              const estaAtrasada = dataVencimento < dataAtual;
      
              console.log('Renderizando fatura', fatura); // Verifique os dados de cada fatura
      
              return (
                <Paper
                  key={fatura.id_boleto}
                  elevation={3}
                  sx={{
                    borderRadius: '20px',
                    padding: '15px',
                    backgroundColor: estaAtrasada ? '#FFEEEE' : '#F1F1F1', // Destacar faturas atrasadas
                    marginBottom: '20px',
                  }}
                >
                  <Typography variant="h6" color={highlightColor || '#09DB05'} gutterBottom>
                    {estaAtrasada ? 'Atrasada' : 'Próxima Fatura'}
                  </Typography>
                  <Typography variant="caption" color={highlightColor || '#09DB05'}>
                    Vencimento
                  </Typography>
                  <Typography variant="body2" color={highlightColor || '#09DB05'}>
                    {formatarDataBR(fatura.vencimento)}
                  </Typography>
                  <Typography variant="h4" color={highlightColor || '#09DB05'} sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>
                    R$ {parseFloat(fatura.valor).toFixed(2).replace('.', ',')}
                  </Typography>
      
                  {/* Adicionar botões de ação */}
                  <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ marginTop: '15px' }}>
                 {/* PEGAR ª VIA 
                  {renderButton({
                    icon: iconeEnviarUrl || 'https://i.ibb.co/4W2FynC/seta-para-cima.png',
                    label: '2ª VIA',
                    onClick: () => {
                      setBoletoSelecionado(fatura);
                      setOpenConfirmModal(true);
                    },
                  })}
                 */}
                  {renderButton({
                    icon: iconeBarrasUrl || 'https://i.ibb.co/MPcb9jn/codigo-de-barras.png',
                    label: 'Baixar Boleto',
                    onClick: () => {
                      const boletoLink = fatura.linhadigitavel; // Acessando a propriedade correta
                      console.log('Link do boleto:', boletoLink); // Logando o link para garantir que está correto
                      if (boletoLink && isValidURL(boletoLink)) {
                        handleOpenBoletoModal(boletoLink);  // Chama a função com a URL correta
                        setOpenBoletoModal(true);  // Abre o modal
                      } else {
                        console.error('Link inválido:', boletoLink); // Log de erro se o link for inválido
                      }
                    },
                  })}


                  {renderButton({
                    icon: iconePixUrl || 'https://i.ibb.co/xLxNTgn/codigo-qr.png',
                    label: 'PAGAR COM PIX',
                    onClick: () => {
                      setBoletoSelecionado(fatura);
                      handleOpenModal(fatura.pix); // Passa diretamente o link do PIX
                    },
                  })}
                  </Grid>

                </Paper>
              );
            })}
      
            {/* Renderizar a próxima fatura */}
            {proximaFatura && (
              <Paper
                key={proximaFatura.id}
                elevation={3}
                sx={{
                  borderRadius: '20px',
                  padding: '15px',
                  backgroundColor: cardBackgroundColor || '#F1F1F1',
                  marginBottom: '20px',
                }}
              >
                {console.log('Renderizando próxima fatura', proximaFatura)} {/* Verifique os dados da próxima fatura */}
                <Typography variant="h6" color={highlightColor || '#09DB05'} gutterBottom>
                  {verificarStatusFatura(proximaFatura.data_vencimento)}
                </Typography>
                <Typography variant="caption" color={highlightColor || '#09DB05'}>
                  Vencimento
                </Typography>
                <Typography variant="body2" color={highlightColor || '#09DB05'}>
                  {formatarDataBR(proximaFatura.data_vencimento)}
                </Typography>
                <Typography
                  variant="h4"
                  color={highlightColor || '#09DB05'}
                  sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}
                >
                  R$ {proximaFatura.valor_aberto.toFixed(2).replace('.', ',')}
                </Typography>
              </Paper>
            )}
      
            {/* Outros componentes conforme necessário */}

            {/* Modal de Pagamento PIX */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '10px', textAlign: 'center',
              }}>
                <Typography variant="h6" gutterBottom>Chave de Pagamento via PIX</Typography>

                {pixData ? (
                  <>
                    {/* Gerar QR Code com o QRCodeCanvas */}
                    <QRCodeCanvas value={pixData} size={200} />

                    <Typography sx={{ marginTop: '15px' }}>Chave Copia e Cola:</Typography>
                    <Typography sx={{
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      maxWidth: '250px',
                      margin: '0 auto',
                    }}>
                      {pixData}
                    </Typography>

                    {/* Botão para copiar a chave PIX */}
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: '10px',
                        backgroundColor: buttonColor || '#198924',
                        color: textFinButton || 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                      }}
                      onClick={copyToClipboard} // Copia o código Pix
                    >
                      Copiar Chave PIX
                    </Button>
                  </>
                ) : (
                  <Typography color="error">Erro: Link Pix não disponível ou erro ao obter o código Pix.</Typography>
                )}
              </Box>
            </Modal>

            <Snackbar open={openSnackbar || copied} autoHideDuration={3000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              {copied ? 'Chave Pix copiada com sucesso!' : 'Erro ao copiar código de barras!'}
            </Alert>
          </Snackbar>

          {/* Modal para o Boleto */}
          <Modal open={openBoletoModal} onClose={() => setOpenBoletoModal(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 300,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <img
                src={iconBoletoUrl}
                alt="Download"
                style={{ width: '120px' }}
              />
              <Typography variant="h6" gutterBottom sx={{ marginTop: '15px' }}>
                Clique no botão para copiar o código de barras
              </Typography>

              <Grid container spacing={2} justifyContent="center" sx={{ marginTop: '20px' }}>
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{
                      fontSize: '12px',
                      backgroundColor: '#198924', // Você pode personalizar essa cor
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                    onClick={copiarLinhaDigitavel} // Copia a linha digitável
                  >
                    <img
                      src={iconCopiarUrl}
                      alt="Copiar Código de Barras"
                      style={{ width: '19px', marginBottom: '5px' }}
                    />
                    <Typography variant="caption" sx={{ marginTop: '4px', fontSize: '9px' }}>
                      Copiar Código de Barras
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={copied ? 'success' : 'error'} sx={{ width: '100%' }}>
          {copied ? 'Linha digitável copiada com sucesso!' : 'Erro ao copiar linha digitável!'}
        </Alert>
      </Snackbar>





          </Box>
        </div>
      );
      
      
      
}

export default Financeiro;
