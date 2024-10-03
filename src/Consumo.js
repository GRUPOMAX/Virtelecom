import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { Wifi, SignalCellularAlt, Room } from '@mui/icons-material'; // Ícones
import { useNavigate } from 'react-router-dom'; // Para navegação



function Consumo({ dadosConsumo }) {
  const navigate = useNavigate(); // Para redirecionar para outra página

  // Verificação de dados de consumo
  const velocidadeDownload = dadosConsumo?.velocidade_download || '0M';
  const velocidadeUpload = dadosConsumo?.velocidade_upload || '0M';

  // Acessando o login e IP de forma correta
  const login = dadosConsumo?.logins?.[0]?.['Login 1']?.['Login 1']?.login || 'N/A';
  const ipLocal = dadosConsumo?.logins?.[0]?.['Login 1']?.['Login 1']?.ip || 'N/A';
  const sinal = dadosConsumo?.onus?.[0]?.['Onu 1']?.sinal_rx || 'N/A';
  const statusOnline = dadosConsumo?.logins?.[0]?.['Login 1']?.['Login 1']?.status_online || 'Offline';
  const statusInternet = dadosConsumo?.status_internet || 'Desconhecido';

  // Função para extrair corretamente o dia do vencimento
  const formatarDataVencimento = (dataString) => {
    if (!dataString) return 'N/A';
    const partesData = dataString.split('-');
    const dia = partesData[2];  // Pegando a terceira parte (o dia)
    return dia;
  };

  const dataVencimento = formatarDataVencimento(dadosConsumo?.data_vencimento);

  // Definir a cor dos ícones com base nas condições
  const getSignalColor = () => {
    if (sinal < -28.0) return 'red';      // Sinal muito fraco
    if (sinal >= -28.0 && sinal < -25.0) return 'yellow';  // Sinal moderado
    return 'green';       // Sinal bom
  };

  const getIpColor = () => {
    return ipLocal.startsWith('172') ? 'red' : 'green';
  };

  const getStatusColor = () => {
    return (statusOnline === 'Online' && statusInternet === 'Ativo') ? 'green' : 'red';
  };

  // Função para redirecionar para a página de detalhes
  const handleVerMais = () => {
    navigate('/detalhes');
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Meu consumo
        </Typography>
        <Button onClick={handleVerMais} sx={{ fontWeight: 'Bold',textTransform: 'none', fontSize: '12px', color: '#058E2B' }}>
          Ver Mais
        </Button>
      </Grid>
      <Paper
        elevation={3}
        sx={{
          borderRadius: '20px',
          padding: '15px', // Reduzir o padding para deixar mais compacto
          backgroundColor: '#c9c9c9', // Background cinza claro
        }}
      >
        {/* Título do plano e vencimento */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom sx={{ marginBottom: '4px', lineHeight: '0.43' }}>
              {dadosConsumo?.contrato || 'N/A'}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ marginTop: '0px' }}>
              seu plano
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ marginBottom: '4px', lineHeight: '0.43' }}>
              Dia {dataVencimento}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ marginTop: '0px' }}>
              Vencimento
            </Typography>
          </Grid>
        </Grid>

        {/* Seção de Download/Upload e outras informações */}
        <Grid container spacing={2} alignItems="center" sx={{ marginTop: '10px' }}>
          {/* Círculo de Download e Upload */}
          <Grid item xs={4} style={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: '110px', // Diminuir o tamanho do círculo
                height: '110px',
                borderRadius: '50%',
                border: '3px solid #00ff00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  Download
                </Typography>
                <Typography variant="h6" style={{ fontWeight: 'bold', lineHeight: '1.2', fontSize: '14px' }}>
                  {velocidadeDownload}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Upload
                </Typography>
                <Typography variant="h6" style={{ fontWeight: 'bold', lineHeight: '1.2', fontSize: '14px' }}>
                  {velocidadeUpload}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Informações de Status, Login, Sinal e IP Local com ícones ao lado */}
          <Grid item xs={8} style={{ textAlign: 'right' }}>
            {/* Status */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Status:</strong> {statusInternet}
              </Typography>
            </Box>

            {/* Login */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' }}>
              <Wifi sx={{ fontSize: '18px', color: getStatusColor(), marginRight: '8px' }} />
              <Typography variant="body2" color="textSecondary">
                <strong>Login:</strong> {login}
              </Typography>
            </Box>

            {/* Sinal */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' }}>
              <SignalCellularAlt sx={{ fontSize: '18px', color: getSignalColor(), marginRight: '8px' }} />
              <Typography variant="body2" color="textSecondary">
                <strong>Sinal:</strong> {sinal} dBm
              </Typography>
            </Box>

            {/* IP Local */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Room sx={{ fontSize: '18px', color: getIpColor(), marginRight: '8px' }} />
              <Typography variant="body2" color="textSecondary">
                <strong>IP Local:</strong> {ipLocal}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

    </Box>
  );
}

export default Consumo;
