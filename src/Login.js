import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Modal, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CircleLoader } from 'react-spinners'; // Importa o CircleLoader do react-spinners
import './Login.css'; // Arquivo CSS personalizado

const formatarCPFouCNPJ = (valor) => {
  valor = valor.replace(/\D/g, ''); // Remove tudo que não for dígito
  if (valor.length <= 11) {
    valor = valor.substring(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    valor = valor.substring(0, 14);
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
  return valor;
};

function Login({ onLogin }) {
  const [documento, setDocumento] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(''); // Estado para armazenar a URL da logo
  const [backgroundUrl, setBackgroundUrl] = useState(''); // Estado para armazenar a URL do background
  const [animationType, setAnimationType] = useState('none'); // Estado para armazenar o tipo de animação
  const [primaryColor, setPrimaryColor] = useState('#28a745'); // Valor padrão da cor primária
  const [clienteInfo, setClienteInfo] = useState(null);
  const [dados, setDados] = useState(null);

  const navigate = useNavigate();

  const handleDocumentoChange = (e) => {
    const valor = e.target.value;
    setDocumento(formatarCPFouCNPJ(valor));
  };

  // Define the table IDs for colors, icons, logo and background, and animation
  const colorsTableId = 'mi4m06fy7w1u5h2'; // Nova tabela de cores
  const iconsTableId = 'mio2lr97vak735b'; // Nova tabela de ícones
  const logoBackgroundTableId = 'm9ijo50nt4m9wpk'; // Tabela de logo e background
  const animationTableId = 'mm2nyv7vqk2jue1'; // Tabela de animação
  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação
  

  useEffect(() => {
    // Função para buscar logo e background
    const fetchLogoAndBackground = async () => {
      try {
        const response = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${logoBackgroundTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Dados recebidos da API:', data); // Log para verificar os dados recebidos da API

          if (data.list.length > 0) {
            let newLogoUrl = null;
            let newBackgroundUrl = null;

            // Atualiza a logo
            newLogoUrl = data.list[0].urlLogo || (data.list[0]['URL  - LOGO EMPRESA'] && data.list[0]['URL  - LOGO EMPRESA'].length > 0 ? `https://nocodb.nexusnerds.com.br/${data.list[0]['URL  - LOGO EMPRESA'][0].signedPath}` : null);
            setLogoUrl(prevLogoUrl => prevLogoUrl !== newLogoUrl ? newLogoUrl : prevLogoUrl);

            // Atualiza o background
            newBackgroundUrl = data.list[0].urlBackground || (data.list[0]['URL - BACKGROUND LOGIN'] && data.list[0]['URL - BACKGROUND LOGIN'].length > 0 ? `https://nocodb.nexusnerds.com.br/${data.list[0]['URL - BACKGROUND LOGIN'][0].signedPath}` : null);
            setBackgroundUrl(prevBackgroundUrl => prevBackgroundUrl !== newBackgroundUrl ? newBackgroundUrl : prevBackgroundUrl);
          }
        } else {
          console.error('Erro ao buscar a logo e background:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar a logo e background:', error);
      }
    };

    // Função para buscar animação e cores
    const fetchAnimationAndColors = async () => {
      try {
        // Fetch de cores
        const colorsResponse = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${colorsTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });

        // Fetch de animação
        const animationResponse = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${animationTableId}/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });

        if (colorsResponse.ok) {
          const colorsData = await colorsResponse.json();
          if (colorsData.list.length > 0) {
            const settings = colorsData.list[0];
            if (settings.primaryColor) {
              setPrimaryColor(settings.primaryColor);
            }
          } else {
            console.error('Nenhuma cor encontrada.');
          }
        } else {
          console.error('Erro ao buscar as configurações de cores:', colorsResponse.statusText);
        }

        if (animationResponse.ok) {
          const animationData = await animationResponse.json();
          if (animationData.list.length > 0) {
            const settings = animationData.list[0];
            const newAnimationType = settings.animationType || 'none';
            setAnimationType(newAnimationType);
          } else {
            console.error('Nenhuma animação encontrada.');
          }
        } else {
          console.error('Erro ao buscar as configurações de animação:', animationResponse.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar as configurações de animação e cores:', error);
      }
    };

    // Verifica os dados salvos no localStorage e redireciona se houver
    const savedData = localStorage.getItem('dadosCliente');
    if (savedData) {
      setDados(JSON.parse(savedData));
      navigate('/home'); // Redireciona para a página inicial
      return; // Interrompe a execução do useEffect
    }

    // Chama as funções imediatamente
    fetchLogoAndBackground();
    fetchAnimationAndColors();

    // Configura o interval para verificar a API a cada 5 segundos
    const intervalId = setInterval(() => {
      fetchLogoAndBackground();
      fetchAnimationAndColors();
    }, 5000); // 5000 ms = 5 segundos

    // Limpa o interval quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [navigate]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setLoading(true);
    setIsModalOpen(true); // Abre o modal de carregamento
  
    const documentoFormatado = documento.trim();
  
    // Verifica se o documento tem tamanho correto para CPF ou CNPJ
    if (documentoFormatado.length !== 14 && documentoFormatado.length !== 18) {
      setErro('CPF ou CNPJ inválido.');
      setLoading(false);
      setIsModalOpen(false); // Fecha o modal em caso de erro
      return;
    }
  
    try {
      // Faz a requisição para a API local, que vai buscar e salvar os dados no JSON
      const response = await fetch(`https://api.virtelecom.nexusnerds.com.br/buscarCliente/${documentoFormatado}`);
  
      if (response.ok) {
        const data = await response.json();
  
        // Salva os dados do cliente no localStorage
        localStorage.setItem('cnpj_cpf', documentoFormatado);
        localStorage.setItem('dadosCliente', JSON.stringify(data));
        
        // Verifica se os dados foram salvos corretamente
        console.log("Dados salvos no localStorage:", {
          cnpj_cpf: documentoFormatado,
          dadosCliente: data
        });
  
        setClienteInfo(data);
  
        console.log("Dados do cliente recebidos:", data);
  
        // Agora, vamos buscar no arquivo JSON o que foi salvo
        const jsonResponse = await fetch(`https://api.virtelecom.nexusnerds.com.br/buscarClienteNoArquivo/${documentoFormatado}`);
        
        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json();
          console.log("Dados do cliente do arquivo JSON:", jsonData);
  
          // Passa os dados para o login
          onLogin(jsonData);
          navigate('/home');
        } else {
          const errorData = await jsonResponse.json();
          setErro(errorData.error || 'Erro ao buscar dados do cliente no arquivo JSON.');
        }
  
      } else {
        const errorData = await response.json();
        setErro(errorData.error || 'Erro ao buscar dados do cliente.');
      }
    } catch (error) {
      console.error('Erro ao buscar os dados do cliente:', error.message);
      setErro(`Erro ao buscar os dados do cliente: ${error.message}`);
    } finally {
      setLoading(false);
      setIsModalOpen(false); // Fecha o modal após o processamento
    }
  };
  
  
  
  


  return (
    <div
      className="login-background"
      style={{ 
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none', // Adiciona a URL do background ou 'none' como fallback
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Renderiza a logo se ela estiver disponível */}
      {logoUrl && (
        <div className={`logo-container ${animationType}`}>
          <img src={logoUrl} alt="Logo da Empresa" className="logo-img" />
        </div>
      )}

      <Container maxWidth="xs" className="login-container">
        <Typography variant="body1" className="login-instruction" sx={{ color: '#fff', marginBottom: '20px' }}>
          Digite seu CPF ou CNPJ para continuar
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="CPF ou CNPJ"
            type="text"
            value={documento}
            onChange={handleDocumentoChange}
            fullWidth
            margin="normal"
            variant="standard"
            InputProps={{
              disableUnderline: false,
              classes: {
                input: 'inputField'
              },
            }}
            inputProps={{
              style: { textAlign: 'center', color: 'white' }
            }}
            className="login-input"
            required
          />

          {erro && (
            <Typography color="error" className="login-error">
              {erro}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="login-button"
            sx={{
              backgroundColor: '#fff',
              color: '#01d636',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
              padding: '10px 0',
              marginTop: '20px',
              fontSize: '16px',
              borderRadius: '8px',
            }}
            disabled={loading}
          >
            Continuar
          </Button>

          <Button
              variant="outlined"
              fullWidth
              className="register-button"
              sx={{
                color: '#fff',
                borderColor: '#fff',
                backgroundColor: 'transparent',
                marginTop: '10px',
                fontSize: '14px',
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => navigate('/cadastro')} // Altere '/cadastro' para a rota desejada
            >
              Contrate Agora!
            </Button>
        </form>
      </Container>

      {/* Modal para o carregamento */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="loading-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircleLoader className="loading-modal" color={primaryColor} size={25} />
          <Typography id="loading-modal-title" variant="h6" sx={{ mt: 2 }}>
            Aguarde... Carregando Dados.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default Login;
