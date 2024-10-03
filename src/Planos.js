import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate

function Planos() {
  const [planos, setPlanos] = useState([]);
  const navigate = useNavigate(); // Inicializa o hook useNavigate

  useEffect(() => {
    // URL da API para buscar os registros da tabela de planos
    const url = 'https://nocodb.nexusnerds.com.br/api/v2/tables/m2soqh0mqa6azou/records';
    const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação

    // Requisição para obter os dados dos planos
    fetch(url, {
      headers: {
        'xc-token': token, // Token de autenticação
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Dados retornados pela API:', data); // Verificar os dados retornados

        // Extração dos dados dos planos
        const fetchedPlanos = data.list.map((item) => ({
          id: item.Id, // Inclua o ID para a navegação dinâmica
          title: item['title and imagem'], // Ajuste o campo de acordo com a sua tabela
          
          // Prioriza a URL_IMAGEM, se disponível, senão usa o campo image
          image: item.URL_IMAGEM 
            ? item.URL_IMAGEM 
            : item.image && item.image.length > 0 
              ? `https://nocodb.nexusnerds.com.br/${item.image[0].signedPath}`
              : 'URL_DA_IMAGEM_PADRAO', // Substitua por uma URL de imagem padrão caso nenhum dos campos esteja disponível

          description: item.description,
        }));
        setPlanos(fetchedPlanos);
      })
      .catch((error) => console.error('Erro ao buscar os planos:', error));
  }, []);

  const handleCardClick = (id) => {
    // Redireciona para a página de detalhes do plano com o ID específico
    navigate(`/planos/${id}`);
  };

  return (
    <Box sx={{ padding: '20px', minHeight: '112vh', boxSizing: 'border-box', overflowY: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Planos
      </Typography>
      <Grid container spacing={2}>
        {planos.map((plano, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: 3, height: '100%', cursor: 'pointer' }} 
              onClick={() => handleCardClick(plano.id)} // Adiciona o evento de clique
            >
              <CardMedia
                component="img"
                sx={{ height: '200px' }}
                image={plano.image}
                alt={plano.title}
                onError={(e) => { e.target.src = 'URL_DA_IMAGEM_PADRAO'; }} // Substitui por uma imagem padrão caso a imagem falhe ao carregar
              />
              <CardContent sx={{ backgroundColor: '#f0f0f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  {plano.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {plano.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Planos;
