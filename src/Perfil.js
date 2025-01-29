/* global google */
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Typography, Grid, Paper } from '@mui/material';

function Perfil() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefoneCelular, setTelefoneCelular] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [secudaryColor, setsecudaryColor] = useState(''); // Adicionando estado para a cor secundária
  const [highlightColor, setHighlightColor] = useState(''); // Adicionando estado para a cor de destaque
  const [buttonColor, setButtonColor] = useState(''); // Adicionando estado para a cor do botão
  const [primaryColor, setPrimaryColor] = useState('green'); // Cor padrão
  const [cardBackgroundColor, setCardBackgroundColor] = useState(''); // Adicionando estado para a cor de fundo do cartão
  const [iconCasaConectadaUrl, setIconCasaConectadaUrl] = useState('https://i.ibb.co/JqkK1WF/casa.png'); // Estado para a URL do ícone

  const mapRef = useRef(null);

  // Carregar os dados do cliente do localStorage
  const loadClientData = () => {
    const storedData = localStorage.getItem('dadosCliente');
    if (storedData) {
      try {
        const dadosCliente = JSON.parse(storedData);
        console.log('Dados Cliente:', dadosCliente);

        const idCliente = dadosCliente?.id_cliente;

        // Preencher os estados com os valores recebidos
        if (dadosCliente) {
          setNome(dadosCliente.razao_social_nome || '');
          setCpfCnpj(dadosCliente.cnpj_cpf || '');
          setTelefoneCelular(dadosCliente.telefone_celular || '');
          setCep(dadosCliente.cep || '');
          setNumero(dadosCliente.numero || '');
          setEndereco(dadosCliente.endereco || '');
          setBairro(dadosCliente.bairro || '');
          setComplemento(dadosCliente.complemento || '');
          setWhatsapp(dadosCliente.whatsapp || '');
          setEmail(dadosCliente.email || '');
          const cidade = dadosCliente.cidade === '3169' ? 'Viana' : (dadosCliente.cidade || '');
          setCidade(cidade);

          // Buscar a localização da ONU com base no ID do cliente
          if (idCliente) {
            fetchLocalizacaoOnu(idCliente);
          } else {
            console.error('ID do cliente não encontrado.');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do cliente do localStorage:', error);
      }
    }
  };

  const fetchLocalizacaoOnu = async (idCliente) => {
    try {
      const response = await fetch(`https://www.db.app.nexusnerds.com.br/buscar-localizacao-onu?id_cliente=${idCliente}`);
      if (response.ok) {
        const data = await response.json();
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      } else {
        console.error('Erro ao buscar a localização da ONU:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar a localização da ONU:', error);
    }
  };

// Fetch para cores e ícones
const fetchPrimaryColorAndIcons = async () => {
  const colorsTableId = 'mi4m06fy7w1u5h2'; // Tabela de cores
  const iconsTableId = 'mio2lr97vak735b'; // Tabela de ícones
  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação

  try {
    // Fetch de cores
    const colorsResponse = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${colorsTableId}/records`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': token,
      },
    });

    // Fetch de ícones
    const iconsResponse = await fetch(`https://nocodb.nexusnerds.com.br/api/v2/tables/${iconsTableId}/records`, {
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
        if (settings.secudaryColor) {
          setsecudaryColor(settings.secudaryColor);
        }
        if (settings.highlightColor) {
          setHighlightColor(settings.highlightColor);
        }
        if (settings.buttonColor) {
          setButtonColor(settings.buttonColor);
        }
        if (settings.cardBackgroundColor) {
          setCardBackgroundColor(settings.cardBackgroundColor);
        }
      }
    } else {
      console.error('Erro ao buscar as configurações de cores:', colorsResponse.statusText);
    }

    if (iconsResponse.ok) {
      const iconsData = await iconsResponse.json();
      if (iconsData.list.length > 0) {
        const settings = iconsData.list[0];
        if (settings.IconCasaConectada) {
          setIconCasaConectadaUrl(settings.IconCasaConectada);
        }
        // Adicione mais ícones se necessário
      }
    } else {
      console.error('Erro ao buscar as configurações de ícones:', iconsResponse.statusText);
    }
  } catch (error) {
    console.error('Erro ao buscar as configurações:', error);
  }
};


  // useEffect para carregar dados do cliente e as cores/ícones
  useEffect(() => {
    loadClientData();
    fetchPrimaryColorAndIcons(); // Carregar cores e ícones inicialmente

    // Configurar o intervalo para verificar a cada 5 segundos
    const intervalId = setInterval(fetchPrimaryColorAndIcons, 5000); // 5 segundos

    // Limpeza do intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);


  // Inicializa o mapa com o marcador usando latitude e longitude
  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      const map = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 19,
        disableDefaultUI: true, // Remove todos os controles padrão
        mapTypeId: 'hybrid', // Alterar para 'roadmap', 'hybrid', ou 'terrain' conforme necessário
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        minZoom: 23, // Define o nível mínimo de zoom permitido
        maxZoom: 23, // Define o nível máximo de zoom permitido
        gestureHandling: 'none', // Desativa zoom via scroll e gestos
      });

      new google.maps.Marker({
        position: { lat, lng },
        map,
        icon: {
          url: iconCasaConectadaUrl,
          scaledSize: new google.maps.Size(40, 40), // Tamanho do ícone
        },
      });
    }
  }, [latitude, longitude, iconCasaConectadaUrl]);

  return (
    <Box sx={{ padding: '20px', minHeight: '100vh', boxSizing: 'border-box', overflowY: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Perfil
      </Typography>

      <Grid container spacing={1.7}>
        {/* Primeira linha: Nome */}
        <Grid item xs={12}>
          <TextField
            label="Razão Social/Nome"
            fullWidth
            variant="standard"
            value={nome}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false, // Apenas a linha inferior aparece
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor, // Cor do label
                '&.Mui-focused': {
                  color: primaryColor, // Cor do label ao focar
                },
              },
            }}
          />
        </Grid>

        {/* Segunda linha: CPF e Telefone */}
        <Grid item xs={6}>
          <TextField
            label="CNPJ/CPF"
            fullWidth
            variant="standard"
            value={cpfCnpj}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Telefone Celular"
            fullWidth
            variant="standard"
            value={telefoneCelular}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>

        {/* WhatsApp */}
        <Grid item xs={6}>
          <TextField
            label="Whatsapp"
            fullWidth
            variant="standard"
            value={whatsapp}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>

        {/* Email Principal */}
        <Grid item xs={6}>
          <TextField
            label="Email Principal"
            fullWidth
            variant="standard"
            value={email}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>

        {/* Endereço */}
        <Grid item xs={6}>
          <TextField
            label="CEP"
            fullWidth
            variant="standard"
            value={cep}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Nº"
            fullWidth
            variant="standard"
            value={numero}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>

        {/* Restante do endereço */}
        <Grid item xs={12}>
          <TextField
            label="Endereço"
            fullWidth
            variant="standard"
            value={endereco}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Bairro"
            fullWidth
            variant="standard"
            value={bairro}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Complemento"
            fullWidth
            variant="standard"
            value={complemento}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Cidade"
            fullWidth
            variant="standard"
            value={cidade}
            disabled // Desabilita o campo para edição
            InputProps={{
              disableUnderline: false,
              style: { borderBottom: `2px solid ${primaryColor}` }, // Linha inferior usando primaryColor
            }}
            InputLabelProps={{
              sx: {
                color: primaryColor,
                '&.Mui-focused': {
                  color: primaryColor,
                },
              },
            }}
          />
        </Grid>

        {/* Seção do Mapa */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ marginBottom: '5px' }}>
            Localização:
          </Typography>
          <Paper sx={{ height: '210px', backgroundColor: '#e0e0e0', overflow: 'hidden', borderRadius: '10px' }}>
            {/* Div para o mapa */}
            <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '10px' }}></div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Perfil;
