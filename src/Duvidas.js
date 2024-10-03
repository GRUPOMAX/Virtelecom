import React, { useEffect, useState } from 'react';
import { Button, Modal, Box, Typography, Paper, Grid } from '@mui/material';
import ReactPlayer from 'react-player'; // Importando o ReactPlayer
import { Link } from '@mui/icons-material';

function Duvidas() {
  const [duvidas, setDuvidas] = useState([]);
  const [selectedDuvida, setSelectedDuvida] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [categoryColor, setCategoryColor] = useState('#000'); // Cor padrão preta
  const [primaryColor, setPrimaryColor] = useState('green'); // Cor primária

  // Função para buscar as dúvidas no NocoDB
  const fetchDuvidas = async () => {
    const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Substitua pelo seu token NocoDB
    try {
      const response = await fetch('https://nocodb.nexusnerds.com.br/api/v2/tables/mbj8mdqy5sdvtwy/records', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'xc-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDuvidas(data.list); // Atualiza o estado com a lista de dúvidas
      } else {
        console.error('Erro ao buscar as dúvidas:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao fazer requisição:', error);
    }
  };

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

          // Define a cor da categoria
          if (settings.categoryColor) {
            setCategoryColor(settings.categoryColor); // Atualiza o estado com a cor da categoria
          }
        }
      } else {
        console.error('Erro ao buscar as configurações:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  // Converte a URL do vídeo para o formato embed
  const convertToEmbedUrl = (url) => {
    if (url.includes('youtu.be')) {
      const videoId = url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Abrir modal com a dúvida selecionada
  const handleOpenModal = (duvida) => {
    setSelectedDuvida(duvida);
    setOpenModal(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDuvida(null);
  };

  // Carrega as dúvidas e as cores quando o componente for montado e a cada 20 segundos
  useEffect(() => {
    fetchDuvidas(); // Carrega dúvidas inicialmente
    fetchPrimaryColorAndIcons(); // Carrega cores inicialmente

    const intervalId = setInterval(() => {
      fetchDuvidas(); // Verifica a cada 20 segundos
      fetchPrimaryColorAndIcons(); // Atualiza cores a cada 20 segundos
    }, 20000); // 20000 ms = 20 segundos

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px', marginLeft: '10px'}}>
        Dúvidas Frequentes
      </Typography>

      <Grid container spacing={2}>
        {duvidas.length > 0 ? (
          duvidas.map((duvida) => (
            <Grid item xs={12} md={6} lg={4} key={duvida.Id}>
              <Paper
                elevation={3}
                sx={{
                  padding: '20px',
                  borderRadius: '10px',
                  backgroundColor: '#f9f9f9',
                  cursor: 'pointer',
                  margin: '15px',
                  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                  boxShadow: 'var(--Paper-shadow)',
                  backgroundImage: 'var(--Paper-overlay)',
                  '&:hover': { backgroundColor: '#f1f1f1' },
                }}
                onClick={() => handleOpenModal(duvida)}
              >
                <Typography variant="h6" gutterBottom>
                  {duvida.titulo}
                </Typography>
                <Typography variant="body2" style={{ color: categoryColor }}>
                  {duvida.categoria}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Criado em: {new Date(duvida.data_criacao).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography>Nenhuma dúvida disponível no momento.</Typography>
        )}
      </Grid>

      {/* Modal para exibir a dúvida selecionada */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', // Ocupa 80% da largura da tela
            maxWidth: '600px', // Limita a largura máxima
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh', // Define uma altura máxima para o modal
            overflowY: 'auto', // Adiciona barra de rolagem vertical se o conteúdo for muito longo
          }}
        >
          {selectedDuvida && (
            <>
              <Typography variant="h5" gutterBottom>
                {selectedDuvida.titulo}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedDuvida.descricao}
              </Typography>

              {/* Verificando se existe uma imagem */}
              {selectedDuvida.imagem && selectedDuvida.imagem.length > 0 && (
                <Box sx={{ textAlign: 'center', marginBottom: '10px' }}>
                  <img
                    src={`https://nocodb.nexusnerds.com.br/${selectedDuvida.imagem[0].signedPath}`}
                    alt={selectedDuvida.imagem[0].title || 'Imagem relacionada'}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }}
                  />
                </Box>
              )}

              {/* Incorporando vídeo com ReactPlayer */}
              {selectedDuvida.video_url && (
                <Box sx={{ marginBottom: '10px' }}>
                  <Typography variant="body2" color="primary" gutterBottom>
                    Assista ao vídeo explicativo:
                  </Typography>
                  <ReactPlayer
                    url={convertToEmbedUrl(selectedDuvida.video_url)}
                    width="100%"
                    height="auto"
                  />
                </Box>
              )}

              {/* Verificando se existe um link interno */}
              {selectedDuvida.link_interno && (
                <Typography variant="body2" color="primary">
                  <a href={selectedDuvida.link_interno} rel="noopener noreferrer">
                    <Link /> Saiba mais
                  </a>
                </Typography>
              )}

              <Button onClick={handleCloseModal} variant="contained" style={{ background: primaryColor, color: "" }} sx={{ mt: 2 }}>
                Fechar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default Duvidas;
