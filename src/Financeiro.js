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


  const faturasOrdenadas = dados?.boletos?.sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento)) || [];
  const proximasFaturas = faturasOrdenadas.slice(0, 2); // Pegando as duas primeiras faturas mais próximas

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







    // Filtra a "Próxima Fatura" (aquela que está no próximo mês) das outras faturas
  const proximaFatura = proximasFaturas.find((fatura) => verificarStatusFatura(fatura.data_vencimento) === "Próxima Fatura");
  const outrasFaturas = proximasFaturas.filter((fatura) => verificarStatusFatura(fatura.data_vencimento) !== "Próxima Fatura");




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

  const toggleProximaFatura = () => {
    setShowProximaFatura(!showProximaFatura);
  };


  useEffect(() => {
    // IDs das tabelas
    const colorsTableId = 'mn37trxp7ai1efw'; // Tabela de cores
    const iconsTableId = 'm27t8z8ht25mplj'; // Tabela de ícones
    const backgroundTableId = 'mxdf4nqxh5m7ewx'; // Tabela de backgrounds
  
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
    const iconsTableId = 'm27t8z8ht25mplj'; // ID da tabela de ícones
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
  


  // Carregar os dados do cliente do localStorage
  const loadClientData = async () => {
    const storedData = localStorage.getItem('dadosCliente');
    if (storedData) {
      try {
        const dadosCliente = JSON.parse(storedData);
        console.log('Dados Cliente:', dadosCliente);
  
        // Verificar o id_contrato no nível principal ou no array de contratos
        let contratoValido = dadosCliente.id_contrato;
        if (!contratoValido && dadosCliente.contratos && dadosCliente.contratos.length > 0) {
          contratoValido = dadosCliente.contratos[0].id_contrato; // Usa o primeiro contrato do array
          console.log('Contrato encontrado no array de contratos:', contratoValido);
        }
  
        // Define o idContrato ou busca na API se necessário
        if (contratoValido) {
          setIdContrato(contratoValido);
        } else {
          console.warn('Nenhum ID de contrato encontrado, tentando buscar na API...');
  
          // Fazer requisição para obter o id_contrato pelo id_cliente
          if (dadosCliente?.id_cliente) {
            try {
              const response = await axios.get('https://www.db.app.nexusnerds.com.br/contratos', {
                params: { id_cliente: dadosCliente.id_cliente },
              });
  
              if (response.data && response.data.length > 0) {
                const primeiroContrato = response.data[0].id_contrato; // Assume o primeiro contrato
                setIdContrato(primeiroContrato);
                console.log('ID do contrato encontrado na API:', primeiroContrato);
              } else {
                console.warn('Nenhum contrato encontrado na API para o cliente informado.');
              }
            } catch (error) {
              console.error('Erro ao buscar o contrato pelo ID do cliente:', error);
            }
          } else {
            console.warn('ID do cliente não encontrado para buscar contratos.');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do cliente do localStorage:', error);
      }
    } else {
      console.warn('Nenhum dado do cliente encontrado no localStorage.');
    }
  };
  

  // Função para verificar se a fatura está atrasada há mais de 10 dias
  const verificarBloqueio = (dataVencimento) => {
    if (dataVencimento) {
      const hoje = new Date();
      const vencimento = new Date(dataVencimento);
      const diasEmAtraso = (hoje - vencimento) / (1000 * 60 * 60 * 24);

      if (diasEmAtraso > 10) {
        setExibirBotaoDesbloqueio(true);
      } else {
        setExibirBotaoDesbloqueio(false);
      }
    }
  };

const desbloqueioConfianca = async (idContrato) => {
  console.log('Dados do localStorage:', localStorage.getItem('dadosCliente'));
  try {
    const response = await axios.post('https://www.appmax.nexusnerds.com.br/desbloqueio-confianca', { idContrato });
    console.log('Desbloqueio solicitado com sucesso:', response.data);

    if (response.data.success) {
      setModalMessage(response.data.data.message); // Define a mensagem do modal com o sucesso
      setModalOpen(true); // Abre o modal com a mensagem de sucesso
    }
  } catch (error) {
    console.error('Erro ao solicitar desbloqueio:', error);
    alert('Erro ao solicitar desbloqueio.');
  }
};


const handleClose = () => {
  setModalOpen(false);
};



useEffect(() => {
  loadClientData();
}, []);


  
  const handleCopyCodigoBarras = () => {
    navigator.clipboard.writeText(linhaDigitavel)
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch(err => {
        console.error('Erro ao copiar o código de barras', err);
      });
  };




  
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setCopied(false);
    setOpenSnackbarSuccess(false); // Fecha o popup de sucesso
  };

  // Função para abrir o modal e buscar dados do Pix com o ID do boleto
  const handleOpenModal = async (idBoleto) => {
    setBoletoSelecionado(idBoleto); // Salva o id do boleto selecionado

    try {
      const response = await fetch('https://www.appmax.nexusnerds.com.br/buscar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idBoleto }),
      });
      
      const result = await response.json();
      
      if (result && result.pixData) {
        setPixData(result.pixData); // Atualiza o estado do Pix
        setOpenModal(true); // Abre o modal
      } else {
        console.warn('Dados do Pix não disponíveis');
      }
    } catch (error) {
      console.error('Erro ao buscar o PIX:', error.message);
    }
  };



      
      
      
      
      
      
  

  const handleCloseModal = () => {
    setOpenModal(false); // Fecha o modal
  };

  const handleCloseModalBoleto = () => {
    setOpenBoletoModal(false);  // Certifique-se de que o estado está sendo atualizado corretamente
  };

  // Abre o modal de confirmação para escolher WhatsApp ou Email
  const handleOpenConfirmModal = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  const handleSendBoleto = async (method) => {
    const endpoint = method === 'whatsapp' ? '/enviar-fatura' : '/enviar-faturaEmail';
    try {
      const requestBody = {
        boletos: boletoSelecionado?.id,
        juro: "N",
        multa: "N",
        atualiza_boleto: "N",
        tipo_boleto: method === 'whatsapp' ? 'sms' : 'email'
      };

      const response = await fetch(`https://www.appmax.nexusnerds.com.br${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar a fatura');
      }

      setOpenSnackbarSuccess(true);
    } catch (error) {
      console.error('Erro ao enviar fatura:', error.message);
    } finally {
      setOpenConfirmModal(false);
    }
  };


  const toggleProximasFaturas = () => {
    setShowProximasFaturas(!showProximasFaturas);
  };


  




  // Função para baixar o boleto
  const handleBaixarBoleto = async (boletoId) => {
    try {
      const requestBody = {
        boletos: boletoId, // Agora utilizando o boletoId passado como argumento
        juro: "N",
        multa: "N",
        atualiza_boleto: "S",
        tipo_boleto: "arquivo"
      };

      const response = await fetch('https://www.appmax.nexusnerds.com.br/baixar-fatura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Erro ao baixar a fatura');
      }

      const blob = await response.blob();

      // Verifica se o navegador suporta o método `window.navigator.msSaveOrOpenBlob`
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, `boleto_${boletoId}.pdf`);
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boleto_${boletoId}.pdf`; // Utilizando o boletoId no nome do arquivo
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }

      console.log('Fatura baixada com sucesso');
    } catch (error) {
      console.error('Erro ao baixar fatura:', error.message);
    }
};



  const formatarDataBR = (data) => {
    if (!data) return 'Data não disponível';
    const [ano, mes, dia] = data.split('-'); // Separa a string da data
    return `${dia}/${mes}/${ano}`; // Retorna a data no formato DD/MM/AAAA
  };





  const copyToClipboard = () => {
    if (pixData && pixData.pix && pixData.pix.qrCode && pixData.pix.qrCode.qrcode) {
      navigator.clipboard.writeText(pixData.pix.qrCode.qrcode)
        .then(() => {
          setCopied(true); // Exibe o Snackbar de sucesso
        })
        .catch(err => {
          console.error('Erro ao copiar a chave Pix:', err);
          setSnackbarMessage('Erro ao copiar a chave Pix.'); // Mensagem de erro no Snackbar
          setSnackbarSeverity('error'); // Define a severidade do Snackbar como erro
          setOpenSnackbar(true); // Exibe o Snackbar
        });
    } else {
      setSnackbarMessage('Chave Pix não disponível.'); // Mensagem de chave não disponível
      setSnackbarSeverity('error'); // Define a severidade do Snackbar como erro
      setOpenSnackbar(true); // Exibe o Snackbar
    }
  };



  const verificarSeBloqueado = (dataVencimento) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diasAtraso = (hoje - vencimento) / (1000 * 60 * 60 * 24);
    return diasAtraso > 10;
  };
  



  useEffect(() => {
    const toggleTooltip = () => setShowTooltip(prev => !prev);
    const interval = setInterval(toggleTooltip, Math.floor(Math.random() * 5000) + 5000);

    return () => clearInterval(interval);
  }, []);











  

  return (
    <div>
      <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Minhas Faturas
      </Typography>

        {/* Outras Faturas (exceto a próxima) */}
        {outrasFaturas.length > 0 ? (
          outrasFaturas.map((fatura, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                borderRadius: '20px',
                padding: '15px',
                backgroundColor: cardBackgroundColor || '#F1F1F1',
                marginBottom: '20px',
              }}
            >
              {/* Conteúdo da fatura */}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    color={highlightColor || '#09DB05'}
                    gutterBottom
                  >
                    {verificarStatusFatura(fatura.data_vencimento)}
                  </Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <Typography variant="caption" color={highlightColor || '#09DB05'}>
                    Vencimento
                  </Typography>
                  <Typography variant="body2" color={highlightColor || '#09DB05'}>
                    {formatarDataBR(fatura.data_vencimento)}
                  </Typography>
                </Grid>
              </Grid>

              <Typography
                variant="h4"
                color={highlightColor || '#09DB05'}
                sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}
              >
                R$ {fatura.valor_aberto}
              </Typography>

              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ marginTop: '15px' }}
              >
                {/* Botões e funcionalidades da fatura */}
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                  <Button
                    variant="text"
                    color={highlightColor || '#09DB05'}
                    sx={{ fontSize: '10px', display: 'flex', flexDirection: 'column' }}
                    onClick={() => {
                      setBoletoSelecionado(fatura);
                      setOpenConfirmModal(true);
                    }}
                  >
                    <img
                      src={iconeEnviarUrl || 'https://i.ibb.co/4W2FynC/seta-para-cima.png'}
                      alt="Ícone Enviar"
                      style={{ width: '24px' }}
                    />
                    <Typography
                      variant="caption"
                      color={highlightColor || '#09DB05'}
                      sx={{ marginTop: '4px' }}
                    >
                      2ª VIA
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={4} style={{ textAlign: 'center' }}>
                  <Button
                    variant="text"
                    sx={{ color: 'black', fontSize: '10px', display: 'flex', flexDirection: 'column' }}
                    onClick={() => {
                      setBoletoSelecionado(fatura);
                      setOpenBoletoModal(true);
                    }}
                  >
                    <img
                      src={iconeBarrasUrl || 'https://i.ibb.co/MPcb9jn/codigo-de-barras.png'}
                      alt="icone-barras"
                      style={{ width: '24px' }}
                    />
                    <Typography
                      variant="caption"
                      color={highlightColor || '#09DB05'}
                      sx={{ marginTop: '4px' }}
                    >
                      Baixar Boleto
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={4} style={{ textAlign: 'center' }}>
                  <Button
                    variant="text"
                    sx={{ color: 'black', fontSize: '10px', display: 'flex', flexDirection: 'column' }}
                    onClick={() => {
                      setBoletoSelecionado(fatura);
                      handleOpenModal(fatura.id);
                    }}
                  >
                    <img
                      src={iconePixUrl || 'https://i.ibb.co/xLxNTgn/codigo-qr.png'}
                      alt="icone-pix"
                      style={{ width: '24px' }}
                    />
                    <Typography
                      variant="caption"
                      color={highlightColor || '#09DB05'}
                      sx={{ marginTop: '4px' }}
                    >
                      PAGAR COM PIX
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : null}

        {/* Próxima Fatura dentro do Collapse */}
        {proximaFatura ? (
          <>
            <Button
              variant="outlined"
              onClick={toggleProximaFatura}
              sx={{ marginBottom: '20px', color: highlightColor || '#09DB05', borderColor: primaryColor || 'black' }}
            >
              {showProximaFatura ? "Esconder Próxima Fatura" : "Mostrar Próxima Fatura"}
            </Button>

            <Collapse in={showProximaFatura}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: '20px',
                  padding: '15px',
                  backgroundColor: cardBackgroundColor || '#F1F1F1',
                  marginBottom: '20px',
                }}
              >
                {/* Conteúdo da próxima fatura */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography
                      variant="h6"
                      color={highlightColor || '#09DB05'}
                      gutterBottom
                    >
                      {verificarStatusFatura(proximaFatura.data_vencimento)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: 'right' }}>
                    <Typography variant="caption" color={highlightColor || '#09DB05'}>
                      Vencimento
                    </Typography>
                    <Typography variant="body2" color={highlightColor || '#09DB05'}>
                      {formatarDataBR(proximaFatura.data_vencimento)}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography
                  variant="h4"
                  color={highlightColor || '#09DB05'}
                  sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}
                >
                  R$ {proximaFatura.valor_aberto}
                </Typography>

                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ marginTop: '15px' }}
                >
                  {/* Botões e funcionalidades da próxima fatura */}
                  <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <Button
                      variant="text"
                      color={highlightColor || '#09DB05'}
                      sx={{ fontSize: '10px', display: 'flex', flexDirection: 'column' }}
                      onClick={() => {
                        setBoletoSelecionado(proximaFatura);
                        setOpenConfirmModal(true);
                      }}
                    >
                      <img
                        src={iconeEnviarUrl || 'https://i.ibb.co/4W2FynC/seta-para-cima.png'}
                        alt="Ícone Enviar"
                        style={{ width: '24px' }}
                      />
                      <Typography
                        variant="caption"
                        color={highlightColor || '#09DB05'}
                        sx={{ marginTop: '4px' }}
                      >
                        2ª VIA
                      </Typography>
                    </Button>
                  </Grid>

                  <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <Button
                      variant="text"
                      sx={{ color: 'black', fontSize: '10px', display: 'flex', flexDirection: 'column' }}
                      onClick={() => {
                        setBoletoSelecionado(proximaFatura);
                        setOpenBoletoModal(true);
                      }}
                    >
                      <img
                        src={iconeBarrasUrl || 'https://i.ibb.co/MPcb9jn/codigo-de-barras.png'}
                        alt="icone-barras"
                        style={{ width: '24px' }}
                      />
                      <Typography
                        variant="caption"
                        color={highlightColor || '#09DB05'}
                        sx={{ marginTop: '4px' }}
                      >
                        Baixar Boleto
                      </Typography>
                    </Button>
                  </Grid>

                  <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <Button
                      variant="text"
                      sx={{ color: 'black', fontSize: '10px', display: 'flex', flexDirection: 'column' }}
                      onClick={() => {
                        setBoletoSelecionado(proximaFatura);
                        handleOpenModal(proximaFatura.id);
                      }}
                    >
                      <img
                        src={iconePixUrl || 'https://i.ibb.co/xLxNTgn/codigo-qr.png'}
                        alt="icone-pix"
                        style={{ width: '24px' }}
                      />
                      <Typography
                        variant="caption"
                        color={highlightColor || '#09DB05'}
                        sx={{ marginTop: '4px' }}
                      >
                        PAGAR COM PIX
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Collapse>
          </>
        ) : null}

        {outrasFaturas.length === 0 && !proximaFatura && (
          <img
            src={backgroundUrl}
            alt="Nenhum Atendimento"
            style={{ width: '100%', height: 'auto', maxWidth: '400px' }}
          />
        )}

        {outrasFaturas.length > 0 && verificarSeBloqueado(outrasFaturas[0].data_vencimento) && (
              <Tooltip
                title={textDesbloqueio}
                open={showTooltip}
                disableHoverListener
                arrow
                placement="top"
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => desbloqueioConfianca(idContrato)}
                  sx={{
                    position: 'fixed',
                    bottom: 80,
                    right: 20,
                    backgroundColor: primaryColor || '#09DB05',
                    color: highlightColor || '#FFF',
                    borderRadius: '50%',
                    minWidth: '50px',
                    minHeight: '50px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {iconsMap[iconOpenDesConfiança] || (
                    <img src="URL_DO_ICONE_PADRAO" alt="Ícone de Desbloqueio de Confiança" />
                  )}
                </Button>
              </Tooltip>
            )}



        {/* Modal com as opções de copiar código de barras ou baixar boleto */}
        <Modal open={openBoletoModal} onClose={handleCloseModalBoleto}>
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
              src={iconBoletoUrl || 'https://i.ibb.co/ZzJ6CjN/Download.png'}
              alt="Download"
              style={{ width: '120px' }}
            />
            <Typography variant="h6" gutterBottom sx={{ marginTop: '15px' }}>
              Deseja baixar sua fatura ou copiar o código de barras?
            </Typography>

            <Grid container spacing={2} justifyContent="center" sx={{ marginTop: '20px' }}>
              <Grid item xs={6} style={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  sx={{
                    fontSize: '12px',
                    backgroundColor: buttonColor || '#198924',
                    color: textFinButton || 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onClick={() => {
                    handleCopyCodigoBarras();
                    handleCloseModal();
                  }}
                >
                  <img
                    src={iconCopiarUrl || 'https://i.ibb.co/j4zp4zC/copiar.png'}
                    alt="Copiar Código de Barras"
                    style={{ width: '19px', marginBottom: '5px' }}
                  />
                  <Typography variant="caption" sx={{ marginTop: '4px', fontSize: '9px' }}>
                    Copiar Cód de Barras
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>

        

        {/* Modal de Confirmação para WhatsApp ou Email */}
        <Modal open={openConfirmModal} onClose={handleCloseConfirmModal}>
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
              src={iconCorreioUrl || 'https://i.ibb.co/Jv6691w/enviar-correio.png'}
              alt="Enviar Fatura"
              style={{ width: '120px', marginBottom: '10px' }}
            />
            <Typography variant="h6" gutterBottom>
              Deseja receber sua fatura, por qual meio?
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: buttonColor || '#198924', color: textFinButton || 'white' }}
                  onClick={() => handleSendBoleto('whatsapp')}
                  startIcon={
                    <img
                      src={iconWhatsAppUrl || 'https://i.ibb.co/0s2yNDr/whatsapp.png'}
                      alt="WhatsApp"
                      style={{ width: '20px', marginRight: '5px' }}
                    />
                  }
                >
                  WhatsApp
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: buttonColor || '#198924', color: textFinButton || 'white' }}
                  onClick={() => handleSendBoleto('email')}
                  startIcon={
                    <img
                      src={iconEmailUrl || 'https://i.ibb.co/hmt9446/e-mail.png'}
                      alt="E-Mail"
                      style={{ width: '20px', marginRight: '5px' }}
                    />
                  }
                >
                  E-mail
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>

        {/* Modal de Pagamento PIX */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '10px', textAlign: 'center',
          }}>
            <Typography variant="h6" gutterBottom>QR Code para Pagamento via PIX</Typography>

            {pixData && pixData.pix && pixData.pix.qrCode && pixData.pix.qrCode.qrcode ? (
              <>
                <QRCodeCanvas value={pixData.pix.qrCode.qrcode} size={200} />
                <Typography sx={{ marginTop: '15px' }}>Chave Copia e Cola:</Typography>
                <Typography sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '250px', margin: '0 auto' }}>
                  {pixData.pix.qrCode.qrcode}
                </Typography>
              </>
            ) : (
              <Typography color="error">Erro: Chave Pix não disponível.</Typography>
            )}

            
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
                onClick={copyToClipboard}
            >
                Copiar Chave PIX
            </Button>

          </Box>
        </Modal>

        <Snackbar open={openSnackbar || copied} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              {copied ? 'Chave Pix copiada com sucesso!' : 'Código de barras copiado com sucesso!'}
          </Alert>
      </Snackbar>


        <Snackbar open={openSnackbarSuccess} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Fatura enviada com sucesso!
          </Alert>
        </Snackbar>



          {/* Modal para exibir a mensagem de erro */}
          <Dialog open={modalOpen} onClose={handleClose}>
            <DialogTitle>Desbloqueio de Confiança</DialogTitle>
            <DialogContent>
              <Typography>{modalMessage}</Typography>
            </DialogContent>
            <DialogActions>
            <Button
                onClick={handleClose} // Função para fechar o modal
                sx={{
                  color: primaryColor || 'black', // Altere para a cor desejada
                  fontWeight: 'bold', // Opcional: torna o texto em negrito
                  textTransform: 'uppercase', // Opcional: mantém o texto em maiúsculas
                }}
              >
                FECHAR
              </Button>

            </DialogActions>
          </Dialog>


      </Box>
    </div>

  );
}

export default Financeiro;
