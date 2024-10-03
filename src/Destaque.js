import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';  // Importação do CSS principal
import 'swiper/css/autoplay';  // Importa o CSS necessário para o autoplay
import { Autoplay } from 'swiper/modules'; // Atualização para a nova estrutura de módulos do swiper
import { Typography, Box } from '@mui/material';

import { storage } from './firebaseConfig'; 
import { ref, listAll, getDownloadURL } from 'firebase/storage';

function Destaque() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const storageRef = ref(storage, 'Imagens-Destaques/'); // Certifique-se do caminho correto no Firebase
      const result = await listAll(storageRef);
      const urls = await Promise.all(result.items.map(item => getDownloadURL(item)));
      setImages(urls);
    };
    fetchImages();
  }, []);

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      {/* Título "Destaques" */}
      <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'left' , color: '#5b5b5b' }}>
        Destaque
      </Typography>

      {/* Swiper com as imagens */}
      <Swiper
        modules={[Autoplay]} // Registro do módulo Autoplay
        autoplay={{ delay: 2500 }} // Define o tempo de delay para troca de slides
        loop={true}
        spaceBetween={10}
        slidesPerView={1}
        style={{ width: '95%', padding: '10px', marginBottom: '50px', zIndex: '0' }} // Remover o z-index aqui
      >
        {images.map((url, index) => (
          <SwiperSlide key={index}>
            <img src={url} alt={`Slide ${index}`} style={{ width: '100%', borderRadius: '10px' }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default Destaque;
