import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Snackbar, Alert } from '@mui/material'; // Importando Snackbar e Alert
import { ReceiptLong, ViewHeadline, QrCode2 } from '@mui/icons-material'; // Ícones do Material UI

function MinhaFatura({ dadosFatura }) {
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para controle do popup

  // Função para copiar o código de barras e abrir o popup
  const handleCopyCodigoBarras = () => {
    if (dadosFatura?.linha_digitavel) {
      navigator.clipboard.writeText(dadosFatura.linha_digitavel);
      setOpenSnackbar(true); // Abre o popup
    }
  };

  // Fecha o popup
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false); // Fecha o popup
  };

  // Função para formatar a data manualmente no formato BR (DD/MM/YYYY)
  const formatarDataBR = (data) => {
    if (!data) return 'N/A'; // Retorna N/A se não houver data
    const [ano, mes, dia] = data.split('-'); // Separa a string no formato YYYY-MM-DD
    return `${dia}/${mes}/${ano}`; // Retorna no formato DD/MM/YYYY
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Minha Fatura
      </Typography>
      <Paper
        elevation={3}
        sx={{
          borderRadius: '20px',
          padding: '15px',
          backgroundColor: '#c9c9c9', // Background cinza claro
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h6" color="#073007" gutterBottom>
              Fatura Ativa
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Typography variant="caption" color="textSecondary">
              Vencimento
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formatarDataBR(dadosFatura?.data_vencimento)}
            </Typography>
          </Grid>
        </Grid>

        <Typography
          variant="h4"
          color="textPrimary"
          sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}
        >
          R$ {dadosFatura?.valor || '0,00'}
        </Typography>

        <Grid container spacing={2} alignItems="center" sx={{ marginTop: '15px' }}>
          <Grid item xs={4} style={{ textAlign: 'center' }}>
            <Button
              startIcon={<ReceiptLong />}
              variant="contained"
              sx={{ fontSize: '12px', backgroundColor: '#0382F6', color: 'white' }}
              href={dadosFatura?.gateway_link || '#'}
              target="_blank"
            >
              Boleto
            </Button>
          </Grid>
          <Grid item xs={4} style={{ textAlign: 'center' }}>
            <Button
              startIcon={<ViewHeadline />}
              variant="contained"
              sx={{ fontSize: '6px', backgroundColor: '#28a745', color: 'white' }}
              onClick={handleCopyCodigoBarras} // Função ao clicar para copiar
            >
              Codigo Barras
            </Button>
          </Grid>
          <Grid item xs={4} style={{ textAlign: 'center' }}>
            <Button
              startIcon={<QrCode2 />}
              variant="contained"
              sx={{ fontSize: '7px', backgroundColor: '#04F146', color: 'black' }}
            >
              Codigo Pix
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar para mostrar o popup de confirmação */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // O popup desaparece após 3 segundos
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Código de barras copiado com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MinhaFatura;
