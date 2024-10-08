import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Snackbar, Alert, Modal } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { format, differenceInCalendarDays, isBefore, isAfter } from 'date-fns';

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


  
  const handleCopyCodigoBarras = () => {
    navigator.clipboard.writeText(linhaDigitavel)
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch(err => {
        console.error('Erro ao copiar o código de barras', err);
      });
  };

  const handleCopyQRCode = () => {
    navigator.clipboard.writeText(qrCodePix)
      .then(() => {
        setCopied(true);
      })
      .catch(err => {
        console.error('Erro ao copiar o QR Code', err);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setCopied(false);
    setOpenSnackbarSuccess(false); // Fecha o popup de sucesso
  };

  const handleOpenModal = async (idBoleto) => {
    try {
      // Certifique-se de que o 'idBoleto' está sendo corretamente recebido
      console.log('ID do boleto enviado para o backend:', idBoleto);

      // Faz a requisição para buscar os dados do Pix
      const response = await fetch('https://www.appmax.nexusnerds.com.br/buscar-pix', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idBoleto }),
      });

    const pixData = await response.json();
    setPixData(pixData); // Atualiza os dados do Pix
    setOpenModal(true);   // Abre o modal de pagamento com PIX
        } catch (error) {
            console.error('Erro ao buscar o PIX:', error.message);
        }
      };


      // Adicione o console.log aqui para verificar o estado do Pix
    useEffect(() => {
      console.log("Estado atual do Pix Data:", pixData);
    }, [pixData]);
  

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

  // Função para enviar o boleto
  const handleSendBoleto = async (method) => {
    const endpoint = method === 'whatsapp' ? '/enviar-fatura' : '/enviar-faturaEmail';
    try {
      const requestBody = {
        boletos: idBoleto,
        juro: "N",
        multa: "N",
        atualiza_boleto: "N",
        tipo_boleto: method === 'whatsapp' ? 'sms' : 'email'  // Define o tipo de boleto
      };

      const response = await fetch(`http://https://www.appmax.nexusnerds.com.br/:4000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar a fatura');
      }

      const result = await response.json();
      console.log('Fatura enviada com sucesso:', result);

      // Exibe o popup de sucesso
      setOpenSnackbarSuccess(true);
    } catch (error) {
      console.error('Erro ao enviar fatura:', error.message);
    } finally {
      setOpenConfirmModal(false); // Fecha o modal de confirmação após o envio
    }
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

      // Verifica o tipo de arquivo no blob
      console.log(blob.type); // Deve ser application/pdf

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boleto_${boletoId}.pdf`; // Utilizando o boletoId no nome do arquivo
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

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






















  

  return (
    <div>
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Minhas Faturas
        </Typography>

        {proximasFaturas.map((fatura, index) => (
        <Paper
          key={index}
          elevation={3}
          sx={{
            borderRadius: '20px',
            padding: '15px',
            backgroundColor: '#F1F1F1',
            marginBottom: '20px',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h6" color="#09DB05" gutterBottom>
                Fatura Ativa
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <Typography variant="caption" color="textSecondary">
                Vencimento
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatarDataBR(fatura.data_vencimento)}
              </Typography>
            </Grid>
          </Grid>

          <Typography
            variant="h4"
            color="textPrimary"
            sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}
          >
            R$ {fatura.valor_aberto}
          </Typography>

          <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ marginTop: '15px' }}>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <Button
                variant="text"
                sx={{ color: 'black', fontSize: '10px', display: 'flex', flexDirection: 'column' }}
                onClick={() => {
                  setBoletoSelecionado(fatura); // Define a fatura selecionada
                  setOpenConfirmModal(true); // Abre o modal de confirmação
                }}
              >
                <img src="https://i.ibb.co/4W2FynC/seta-para-cima.png" alt="icone-enviar" style={{ width: '24px' }} />
                <Typography variant="caption" sx={{ marginTop: '4px' }}>ENVIAR 2ª VIA</Typography>
              </Button>
            </Grid>

            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <Button
                variant="text"
                sx={{ color: 'black', fontSize: '10px', display: 'flex', flexDirection: 'column' }}
                onClick={() => {
                  setBoletoSelecionado(fatura); // Define a fatura selecionada
                  setOpenBoletoModal(true); // Abre o modal para o código de barras
                }}
              >
                <img src="https://i.ibb.co/MPcb9jn/codigo-de-barras.png" alt="icone-barras" style={{ width: '24px' }} />
                <Typography variant="caption" sx={{ marginTop: '4px' }}>CODIGO BARRAS</Typography>
              </Button>
            </Grid>

            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <Button
                variant="text"
                sx={{ color: 'black', fontSize: '10px', display: 'flex', flexDirection: 'column' }}
                onClick={() => {
                  setBoletoSelecionado(fatura); // Define a fatura selecionada
                  handleOpenModal(fatura.id); // Passa o ID da fatura/boleto em vez de 'true'
                }}
              >
                <img src="https://i.ibb.co/xLxNTgn/codigo-qr.png" alt="icone-pix" style={{ width: '24px' }} />
                <Typography variant="caption" sx={{ marginTop: '4px' }}>PAGAR COM PIX</Typography>
              </Button>
            </Grid>

          </Grid>
        </Paper>
            ))}





            

          {/* Modal com as opções de copiar código de barras ou baixar boleto */}
            <Modal
              open={openBoletoModal}
              onClose={handleCloseModalBoleto}  // Isso já deve fechar o modal ao clicar fora
            >
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: 300, 
              bgcolor: 'background.paper', 
              boxShadow: 24, 
              p: 4, 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <img src="https://i.ibb.co/ZzJ6CjN/Download.png" alt="Download" style={{ width: '120px' }} />
              
              <Typography variant="h6" gutterBottom sx={{ marginTop: '15px' }}>
                Deseja baixar sua fatura ou copiar o código de barras?
              </Typography>

              <Grid container spacing={2} justifyContent="center" sx={{ marginTop: '20px' }}>
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{ 
                      fontSize: '12px', 
                      backgroundColor: '#198924', 
                      color: 'white', 
                      display: 'flex', 
                      flexDirection: 'column',
                      width: '100%', // Define o mesmo tamanho para os botões
                      justifyContent: 'center'
                    }}
                    onClick={() => {
                      handleBaixarBoleto(boletoSelecionado?.id); // Usa o ID do boleto selecionado
                      handleCloseModal(); // Fecha o modal após clicar
                    }}
                  >
                    <img src="https://i.ibb.co/HVFqgbQ/botao-circular-de-download.png" alt="Baixar 2ª Via" style={{ width: '19px', marginBottom: '5px' }} />
                    <Typography variant="caption" sx={{ marginTop: '4px', fontSize: '10px' }}>Baixar 2ª Via</Typography>
                  </Button>
                </Grid>

                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{ 
                      fontSize: '12px', 
                      backgroundColor: '#198924', 
                      color: 'white', 
                      display: 'flex', 
                      flexDirection: 'column',
                      width: '100%', // Define o mesmo tamanho para os botões
                      justifyContent: 'center'
                    }}
                    onClick={() => {
                      handleCopyCodigoBarras();
                      handleCloseModal(); // Fecha o modal após clicar
                    }}
                  >
                    <img src="https://i.ibb.co/j4zp4zC/copiar.png" alt="Copiar Código de Barras" style={{ width: '19px', marginBottom: '5px' }} />
                    <Typography variant="caption" sx={{ marginTop: '4px', fontSize: '9px' }}>Copiar Cód de Barras</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>






            {/* Modal de Confirmação para WhatsApp ou Email */}
            <Modal open={openConfirmModal} onClose={handleCloseConfirmModal}>
              <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: 300, 
                bgcolor: 'background.paper', 
                boxShadow: 24, 
                p: 4, 
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <img src="https://i.ibb.co/Jv6691w/enviar-correio.png" alt="Enviar Fatura" style={{ width: '120px', marginBottom: '10px' }} />
                <Typography variant="h6" gutterBottom>
                Deseja receber sua fatura, por qual meio?
                
                </Typography>
                <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: '#198924', color: 'white' }}
                  onClick={() => handleSendBoleto('whatsapp')}
                  startIcon={<img src="https://i.ibb.co/0s2yNDr/whatsapp.png" alt="WhatsApp" style={{ width: '20px', marginRight: '5px' }} />} 
                >
                  WhatsApp
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: '#198924', color: 'white' }}
                  onClick={() => handleSendBoleto('email')}
                  startIcon={<img src="https://i.ibb.co/hmt9446/e-mail.png" alt="E-Mail" style={{ width: '20px', marginRight: '5px' }} />} 
                >
                  E-mail
                </Button>
              </Grid>
            </Grid>

              </Box>
            </Modal>


            {/* Modal de Pagamento PIX */}
            <Modal open={openModal} onClose={handleCloseModal}>
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
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  QR Code para Pagamento via PIX
                </Typography>

                {/* Renderizar QR Code se disponível */}
                {pixData?.pix?.qrCode?.qrcode ? (
                  <>
                    <QRCodeCanvas value={pixData.pix.qrCode.qrcode} size={200} />
                    <Typography sx={{ marginTop: '15px' }}>
                      Chave Copia e Cola:
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '250px',
                        margin: '0 auto'
                      }}
                    >
                      {pixData.pix.qrCode.qrcode}
                    </Typography>
                  </>
                ) : (
                  <Typography color="error">Erro: Chave Pix não disponível.</Typography>
                )}

                <Button
                  variant="contained"
                  sx={{ marginTop: '10px', backgroundColor: '#04F146', color: 'black' }}
                  onClick={handleCopyQRCode}
                >
                  Copiar Chave PIX
                </Button>
              </Box>
            </Modal>





              <Snackbar
                open={openSnackbar || copied}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
              >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                  {copied ? 'Chave Pix copiada com sucesso!' : 'Código de barras copiado com sucesso!'}
                </Alert>
              </Snackbar>

              {/* Snackbar para sucesso no envio da fatura */}
              <Snackbar
                open={openSnackbarSuccess}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
              >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                  Fatura enviada com sucesso!
                </Alert>
              </Snackbar>
            </Box>
    </div>
  );
}

export default Financeiro;
