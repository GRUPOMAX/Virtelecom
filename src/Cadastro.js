// src/Cadastro.js
import React from 'react';
import { Container, Typography, Grid, Paper, AppBar, Toolbar, BottomNavigation, BottomNavigationAction, TextField } from '@mui/material';
import { AccountCircle, Home, ReceiptLong, Store, SupportAgent } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Cadastro({ dados }) {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0); // Estado para o footer


    // Função para formatar datas no formato brasileiro
    const formatarDataBrasileira = (data) => {
      if (!data) return '';
      const partes = data.split('-');
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        return `${dia}/${mes}/${ano}`;
      }
      return data;
    };

  if (!dados) {
    return (
      <Container maxWidth="sm" style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          Dados do Cadastro
        </Typography>
        <Typography variant="body2" color="error">
          Nenhum dado encontrado.
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      {/* Header */}
      <AppBar position="static" style={{ backgroundColor: '#08c42e' }}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" style={{ color: 'white' }}>
              Max Fibra
            </Typography>
            <AccountCircle style={{ color: 'white', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} /> {/* Voltar ao dashboard */}
          </Grid>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" style={{ padding: '20px' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
          Dados do Cadastro
        </Typography>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                value={dados.razao}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Telefone Celular"
                variant="outlined"
                fullWidth
                value={dados.telefone_celular || 'Não informado'}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="WhatsApp"
                variant="outlined"
                fullWidth
                value={dados.whatsapp || 'Não informado'}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={dados.email || 'Não informado'}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Endereço"
                variant="outlined"
                fullWidth
                value={`${dados.endereco}, ${dados.numero}, ${dados.bairro}`}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="CEP"
                variant="outlined"
                fullWidth
                value={dados.cep || 'Não informado'}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Data de Nascimento"
                variant="outlined"
                fullWidth
                value={formatarDataBrasileira(dados.data_nascimento) || 'Não informado'}
                disabled
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Footer */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          showLabels
          style={{ backgroundColor: '#08c42e' }}
        >
          <BottomNavigationAction label="Início" icon={<Home />} onClick={() => navigate('/dashboard')} />
          <BottomNavigationAction label="Faturas" icon={<ReceiptLong />} />
          <BottomNavigationAction label="Realizar" icon={<Store />} />
          <BottomNavigationAction label="Suporte" icon={<SupportAgent />} />
        </BottomNavigation>
      </Paper>
    </div>
  );
}

export default Cadastro;
