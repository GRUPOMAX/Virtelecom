import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { Typography, Box } from '@mui/material';

function Destaque() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          'https://nocodb.nexusnerds.com.br/api/v2/tables/mc2h4xlryeb32yx/records',
          {
            headers: {
              'xc-token': 'rrRtn86Fi6dmzwKfOiNhzDsi4JGTxOAQSZ-xkMYN',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();

        // Filtrar e validar as imagens com dimensão 1920x1080
        const filteredUrls = [];
        for (const item of data.list) {
          const url = item['DESTAQUES - URL'];
          if (url) {
            const img = new Image();
            img.src = url;

            // Validar dimensões ao carregar a imagem
            await new Promise((resolve) => {
              img.onload = () => {
                if (img.width === 1920 && img.height === 1080) {
                  filteredUrls.push(url);
                }
                resolve();
              };
            });
          }
        }

        setImages(filteredUrls);
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
      }
    };

    // Atualização em tempo real a cada 30 segundos
    const interval = setInterval(fetchImages, 30000);
    fetchImages();

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      <Typography
        variant="h6"
        sx={{
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '10px',
          textAlign: 'left',
          color: '#5b5b5b',
        }}
      >
        Destaque
      </Typography>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3500 }}
        loop={true}
        spaceBetween={10}
        slidesPerView={1}
        style={{ width: '95%', padding: '10px', marginBottom: '50px' }}
      >
        {images.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              src={url}
              alt={`Slide ${index}`}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                aspectRatio: '16/9',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default Destaque;
