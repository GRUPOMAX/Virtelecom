import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Novidades() {
  const [novidades, setNovidades] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [buttonColor, setButtonColor] = useState('#28a745'); // Cor padrão do botão
  const [buttonTextColor, setButtonTextColor] = useState('#fff'); // Cor padrão do texto do botão
  const [buttonBorderColor, setButtonBorderColor] = useState('#28a745'); // Cor padrão da borda do botão
  const [open, setOpen] = useState(false);

  const tableId = 'm2hcpzb84rtp0ou'; // ID da tabela de Novidades no NocoDB
  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação
  const baseUrl = 'https://nocodb.nexusnerds.com.br/api/v2/tables/'; // URL base do NocoDB

  useEffect(() => {
    // Função para buscar as imagens e os links do NocoDB
    const fetchNovidades = async () => {
      try {
        const response = await fetch(`${baseUrl}${tableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const novidadesData = data.list
            .filter(item => item.Novidades_url_img) // Filtrar apenas as entradas com imagem
            .map(item => ({
              url: item.Novidades_url_img,
              link: item.Novidades_link_opcional || null, // Captura o campo do link
              title: item.Novidades_title_opcional || null, // Supondo que você tenha um campo opcional para título
              buttonColor: item.Color_Novidades_Button || '#28a745', // Cor do botão
              buttonTextColor: item.Color_Novidades_ButtonText || '#fff', // Cor do texto do botão
              buttonBorderColor: item.Color_Novidades_ButtonBorder || '#28a745', // Cor da borda do botão
            }));
          setNovidades(novidadesData);
        } else {
          console.error('Erro ao buscar novidades:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar novidades:', error);
      }
    };

    // Executa fetchNovidades inicialmente
    fetchNovidades();

    // Define o intervalo para executar fetchNovidades a cada 5 segundos
    const intervalId = setInterval(() => {
      fetchNovidades();
    }, 5000); // 5000 ms = 5 segundos

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);

// Função para interceptar cliques em links e redirecioná-los para fora
useEffect(() => {
  const handleClickEvent = (event) => {
    const target = event.target;

    // Verifica se o elemento clicado é um link e se o link é externo
    if (target.tagName === 'A' && target.href && target.href.startsWith('http')) {
      event.preventDefault(); // Impede o comportamento padrão do link

      // Verifica se o window.ReactNativeWebView e o postMessage estão disponíveis
      if (typeof window !== 'undefined' && window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
        try {
          // Se estiver disponível, envia a mensagem para o WebView
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'external_link', url: target.href }));
        } catch (error) {
          console.error("Erro ao tentar enviar a mensagem para o WebView:", error);
        }
      } else {
        // Se não estiver disponível, abre o link externamente no navegador
        console.log("Navegador: abrindo link externamente", target.href);
        window.open(target.href, '_blank');
      }
    }
  };

  // Adicionar ouvinte de clique
  document.addEventListener('click', handleClickEvent);

  // Limpar ouvinte ao desmontar o componente
  return () => {
    document.removeEventListener('click', handleClickEvent);
  };
}, []);






  const handleOpen = (novidade) => {
    setSelectedImage(novidade.url);
    setSelectedLink(novidade.link);
    setSelectedTitle(novidade.title);
    setButtonColor(novidade.buttonColor);
    setButtonTextColor(novidade.buttonTextColor);
    setButtonBorderColor(novidade.buttonBorderColor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
    setSelectedLink(null);
    setSelectedTitle(null);
  };

  return (
    <div>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 'bold', 
          marginBottom: '-1vh', 
          fontSize: '14px', 
          color: '#444', 
          marginLeft: '5px',  
          marginTop: '25px',  
          padding: '20px'
        }}
      >
        Novidades
      </Typography>

      <Box
        className="acesso-rapido-scroll"
        sx={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '2px 0',
        }}
      >
        {novidades.map((novidade, index) => (
          <Box
            key={index}
            className="inline-box"
            sx={{
              display: 'inline-block',
              marginRight: '-8px', // Ajuste o valor para controlar a sobreposição
              cursor: 'pointer',
              padding: '0 10px',
            }}
            onClick={() => handleOpen(novidade)}
          >
            {novidade.url && ( // Somente renderizar se houver URL de imagem
              <img
                src={novidade.url}
                alt={`Novidade ${index + 1}`}
                className="rounded-image"
                style={{
                  borderRadius: '50%',
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}
              />
            )}
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
            flexDirection: 'column',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '25px',
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: '#fff',
              borderRadius: '50%',
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedImage && (
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={selectedImage}
                alt="Novidade ampliada"
                style={{
                  maxWidth: '90%',
                  maxHeight: '90vh',
                  borderRadius: '10px',
                }}
              />

              {/* Botão dinâmico com título e link sobre a imagem */}
              {selectedLink && selectedTitle && (
                <Button
                  variant="contained"
                  href={selectedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    position: 'absolute',
                    bottom: '10px',
                    backgroundColor: buttonColor, // Cor dinâmica do botão
                    color: buttonTextColor, // Cor dinâmica do texto do botão
                    border: `2px solid ${buttonBorderColor}`, // Cor dinâmica da borda
                    borderRadius: '10%', // Torna o botão arredondado
                    padding: '10px 20px',
                    minWidth: '120px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                  onClick={() => { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'external_link', url: selectedLink }));
                  }}
                >
                  {selectedTitle}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default Novidades;
