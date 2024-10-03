import React, { useState, useEffect } from 'react';
import { storage } from './firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Novidades() {
  const [novidades, setNovidades] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      const storageRef = ref(storage, 'imagens-Novidades/');
      const result = await listAll(storageRef);

      const urls = await Promise.all(
        result.items.map((itemRef) => getDownloadURL(itemRef))
      );

      setNovidades(urls);
    };

    fetchImages();
  }, []);

  const handleOpen = (url) => {
    setSelectedImage(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <div>
<Typography 
        variant="h6" 
        sx={{ 
            fontWeight: 'bold', 
            marginBottom: '-3vh', 
            fontSize: '14px', 
            color: '#444', 
            marginLeft: '5px',  
            marginTop: '25px',  // Adicionando um espaçamento maior entre o header e o título
            padding: '20px'
        }}
        >
        Novidades
        </Typography>


      <Box  className="acesso-rapido-scroll"
        sx={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '2px 0',
        }}
      >
        {novidades.map((url, index) => (
          <Box
              key={index}
              className="inline-box"
            >
              <img
                src={url}
                alt={`Novidade ${index + 1}`}
                className="rounded-image"
                onClick={() => handleOpen(url)}
              />
            </Box>

        ))}
      </Box>

      {/* Modal para mostrar a imagem ampliada */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            outline: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        <IconButton
        onClick={handleClose}
        sx={{
            position: 'absolute',
            top: '10px', // Ajuste a posição superior
            right: '25px', // Ajuste a posição à direita
            zIndex: 1000, // Garante que o botão esteja acima de outros elementos
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
            color: '#fff', // Cor do "X" branca
            borderRadius: '50%', // Deixa o botão redondo
        }}
        >
        <CloseIcon />
        </IconButton>


          {selectedImage && (
            <img
              src={selectedImage}
              alt="Novidade ampliada"
              style={{
                maxWidth: '90%',
                maxHeight: '90vh',
                borderRadius: '10px',
                boxShadow: 'none',
              }}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default Novidades;
