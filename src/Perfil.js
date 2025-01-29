/* global google */
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Typography, Grid, Paper } from '@mui/material';

function Perfil() {
  // Definindo os estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefoneCelular, setTelefoneCelular] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [secudaryColor, setsecudaryColor] = useState(''); // Adicionando estado para a cor secundária
  const [highlightColor, setHighlightColor] = useState(''); // Adicionando estado para a cor de destaque
  const [buttonColor, setButtonColor] = useState(''); // Adicionando estado para a cor do botão
  const [primaryColor, setPrimaryColor] = useState('green'); // Cor padrão
  const [cardBackgroundColor, setCardBackgroundColor] = useState(''); // Adicionando estado para a cor de fundo do cartão
  const [iconCasaConectadaUrl, setIconCasaConectadaUrl] = useState('https://i.ibb.co/JqkK1WF/casa.png'); // Estado para a URL do ícone

  const mapRef = useRef(null);


// Função para processar os dados e ajustar conforme necessário
const processarDadosCliente = (data) => {
  const contratos = data.contratos || [];
  const cliente = data.cliente || {};

  if (contratos.length === 0) return {};

  const contrato = contratos[0]; // Pegamos o primeiro contrato ativo
  const endereco = contrato.endereco.split(',');

  // Pega o CPF ou CNPJ diretamente do localStorage
  const cnpjCpf = localStorage.getItem('cnpj_cpf') || '';

  return {
    razao_social: cliente.razaosocial || '',  // Ajusta para o nome do cliente
    cnpj_cpf: cnpjCpf,  // Agora pega o valor diretamente do localStorage
    cep: endereco[endereco.length - 1]?.trim() || '',  // Pegamos o último campo que seria o CEP
    numero: endereco[1]?.split('-')[0]?.trim() || '',  // Pegamos o número da casa
    endereco: endereco.slice(0, 2).join(',').trim(),  // Junta a rua e o bairro
    bairro: endereco[2]?.trim() || '',
    complemento: endereco[3]?.trim() || '',
    cidade: endereco[4]?.split('/')[0]?.trim() || '',  // Ajuste o nome da cidade
    whatsapp: cliente.telefone?.replace(/[^\d]+/g, '') || '',  // Ajusta para o telefone do cliente sem máscara
    email: cliente.email || '',  // Ajusta para o email do cliente
    telefone_celular: cliente.telefone || ''  // Ajusta para o telefone celular do cliente
  };
};

// Função para carregar os dados do cliente
const loadClientData = async () => {
  try {
    // Obtém o CPF diretamente do localStorage
    const cpf = localStorage.getItem('cnpj_cpf');
    
    if (cpf) {
      // Faz a requisição para buscar os dados do cliente no arquivo JSON
      const response = await fetch(`http://localhost:3002/buscarClienteNoArquivo/${cpf}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dados do cliente encontrados no arquivo JSON:', data);

        // Processar os dados do cliente para o formato desejado
        const dadosCliente = processarDadosCliente(data);

        // Preencher os estados com os valores processados
        setNome(dadosCliente.razao_social || '');
        setCpfCnpj(dadosCliente.cnpj_cpf || '');
        setTelefoneCelular(dadosCliente.telefone_celular || '');
        setCep(dadosCliente.cep || '');
        setNumero(dadosCliente.numero || '');
        setEndereco(dadosCliente.endereco || '');
        setBairro(dadosCliente.bairro || '');
        setComplemento(dadosCliente.complemento || '');
        setWhatsapp(dadosCliente.whatsapp || '');
        setEmail(dadosCliente.email || '');
        setCidade(dadosCliente.cidade || '');
      } else {
        const errorData = await response.json();
        console.warn(errorData.error || 'Erro ao buscar dados do cliente.');
      }
    } else {
      console.warn('CPF não encontrado no localStorage.');
    }
  } catch (error) {
    console.error('Erro ao carregar os dados do cliente:', error);
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
      </Grid>
    </Box>
  );
}

export default Perfil;
