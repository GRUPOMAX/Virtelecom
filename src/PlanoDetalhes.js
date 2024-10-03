import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Chip, Button, Dialog, DialogContent } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/ArrowUpward'; // Ícone para Upgrade
import ContractIcon from '@mui/icons-material/AssignmentTurnedIn'; // Ícone para Contratar Plano

function PlanoDetalhes() {
  const { id } = useParams(); // Obtém o ID da URL
  const [plano, setPlano] = useState(null);
  const [open, setOpen] = useState(false); // Estado para controlar o modal

  useEffect(() => {
    // URL da API para buscar os detalhes do plano específico
    const url = `https://nocodb.nexusnerds.com.br/api/v2/tables/m2soqh0mqa6azou/records/${id}`;
    const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação

    // Requisição para obter os detalhes do plano
    fetch(url, {
      headers: {
        'xc-token': token, // Token de autenticação
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Detalhes do plano:', data); // Verificar os dados retornados
        setPlano(data); // Define o estado com os detalhes do plano
      })
      .catch((error) => console.error('Erro ao buscar os detalhes do plano:', error));
  }, [id]);

  if (!plano) return <Typography>Carregando...</Typography>; // Mostra um indicador de carregamento

  // Função para abrir o modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {
    setOpen(false);
  };

  // Função para enviar mensagem pelo WhatsApp
// Função para enviar mensagem pelo WhatsApp
const sendWhatsAppMessage = () => {
  const numero = '552730123131'; // Número do WhatsApp no formato internacional (incluindo o código do país, sem símbolos)
  const mensagem = `Olá, gostaria de fazer um upgrade para o plano: '*${plano['name']}*'. Por favor, entre em contato para mais detalhes.`; // Mensagem personalizada

  // Gera a URL correta para o WhatsApp
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  
  // Redireciona para o WhatsApp
  window.open(url, '_blank');
};

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Nome do Plano */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        {plano['name']}
      </Typography>

      {/* Imagem Principal */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <img
          src={
            plano['URL_IMAGEM'] 
              ? plano['URL_IMAGEM'] // Usa URL_IMAGEM se disponível
              : `https://nocodb.nexusnerds.com.br/${plano['image'][0].signedPath}` // Usa o campo image se URL_IMAGEM não estiver disponível
          }
          alt={plano['title and imagem']}
          style={{ maxWidth: '100%', borderRadius: '8px' }}
        />
      </Box>

      {/* Velocidade de Download e Upload */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={6}>
          <Chip
            label={<span><strong style={{ color: '#00AC26', fontSize: '1.2em' }}>{plano['download_speed']}MB</strong> Download</span>}
            sx={{ 
              backgroundColor: '#D9D9D9', 
              width: '100%', 
              padding: '10px', 
              textAlign: 'center',
              borderRadius: '8px'
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Chip
            label={<span><strong style={{ color: '#00AC26', fontSize: '1.2em' }}>{plano['upload_speed']}MB</strong> Upload</span>}
            sx={{ 
              backgroundColor: '#D9D9D9', 
              width: '100%', 
              padding: '10px', 
              textAlign: 'center',
              borderRadius: '8px'
            }}
          />
        </Grid>
      </Grid>

      {/* Descrição Curta */}
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        {plano['short_description']}
      </Typography>

      {/* Descrição Detalhada */}
      <Typography variant="body1" sx={{ marginBottom: '20px' }}>
        {plano['detailed_description']}
      </Typography>

      {/* Ícones e Recursos */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        {plano['URL_ICONS'] && plano['URL_ICONS'].length > 0 ? (
          plano['URL_ICONS'].map((iconUrl, index) => (
            <img 
              key={index}
              src={iconUrl} // Usa URL_ICONS se disponível
              alt="Recurso"
              style={{ width: '40px', height: '40px' }}
            />
          ))
        ) : (
          plano['icons'] && plano['icons'].map((icon, index) => (
            <img 
              key={index}
              src={`https://nocodb.nexusnerds.com.br/${icon.signedPath}`} // Usa o campo icons se URL_ICONS não estiver disponível
              alt="Recurso"
              style={{ width: '40px', height: '40px' }}
            />
          ))
        )}
      </Box>

      
      {/* 
      Botão Contrate Agora 
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          variant="contained"
          onClick={handleClickOpen} // Abre o modal ao clicar
          sx={{
            backgroundColor: '#00AC26',
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px 20px',
            fontSize: '1.2em',
            borderRadius: '8px',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
              '100%': { transform: 'scale(1)' },
            },
            '&:hover': {
              backgroundColor: '#008f20',
            },
          }}
        >
          CONTRATE AGORA!
        </Button>
      </Box>

      Modal 
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ backgroundColor: '#f5f5f5', borderRadius: '16px' }}>
          
          Título e Nome do Plano 
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
            Plano Selecionado
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00AC26', marginBottom: '20px', textAlign: 'center' }}>
            {plano['name']}
          </Typography>

          Texto 
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
            Como deseja prosseguir?
          </Typography>

          Botões 
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Button
              variant="contained"
              onClick={sendWhatsAppMessage} // Envia a mensagem personalizada pelo WhatsApp
              startIcon={<UpgradeIcon />}
              sx={{
                backgroundColor: '#00AC26',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.1em',
                padding: '10px 20px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#008f20',
                },
              }}
            >
              Fazer Upgrade
            </Button>
            <Button
                variant="contained"
                onClick={() => window.open('https://maxfibraltda.com.br/cadastro', '_blank')} // Abre a URL em uma nova guia
                startIcon={<ContractIcon />}
                sx={{
                    backgroundColor: '#00AC26',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.1em',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    '&:hover': {
                    backgroundColor: '#008f20',
                    },
                }}
                >
                Contratar Plano
                </Button>

          </Box>
        </DialogContent>
      </Dialog>
      */}




    </Box>
  );
}

export default PlanoDetalhes;
