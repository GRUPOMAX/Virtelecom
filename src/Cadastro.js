import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import data from './data.json'; // Supondo que o arquivo JSON esteja no mesmo diretório
import InputMask from 'react-input-mask';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import Autocomplete from "react-google-autocomplete";
import LocationPicker from "./LocationPicker";





// Estilização customizada
const StyledPaper = styled(Paper)({
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 'bold',
  borderRadius: '25px',
  padding: '10px 20px',
});

function Cadastro() {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpfCnpj: '',
    rg: '',
    dataNascimento: '',
    email: '',
    telefone1: '',
    telefone2: '',
    cidade: '',
    bairro: '',
    endereco: '',
    cep: '',
    numeroResidencial: '',
    complemento: '',
    referencia: '',
    planoContratado: '',
    dataVencimento: '',
    vendedor: '',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [planos, setPlanos] = useState([]);
  const [datasVencimento, setDatasVencimento] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [errorTelefone, setErrorTelefone] = useState('')

  const steps = ['Informações Pessoais', 'Contatos e Endereço', 'Detalhes do Plano'];

  const nocodbToken = 'rrRtn86Fi6dmzwKfOiNhzDsi4JGTxOAQSZ-xkMYN';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseColumns = await axios.get(
          'https://nocodb.nexusnerds.com.br/api/v1/db/meta/columns?table=cadastro_clientes', // Substitua pelo nome ou ID correto da tabela
          {
            headers: {
              'xc-token': nocodbToken,
            },
          }
        );
  
        console.log('Configurações do campo retornadas:', responseColumns.data);
  
        // Extrair opções de "Plano Contratado"
        const planoColumn = responseColumns.data.list.find(
          (col) => col.name === 'Plano Contratado'
        );
        const planosData = planoColumn?.meta?.options || [];
  
        // Extrair opções de "Data de Vencimento"
        const vencimentoColumn = responseColumns.data.list.find(
          (col) => col.name === 'Data de Vencimento'
        );
        const datasData = vencimentoColumn?.meta?.options || [];
  
        // Extrair opções de "Vendedor"
        const vendedorColumn = responseColumns.data.list.find(
          (col) => col.name === 'Vendedor'
        );
        const vendedoresData = vendedorColumn?.meta?.options || [];
  
        setPlanos(planosData);
        setDatasVencimento(datasData);
        setVendedores(vendedoresData);
  
        console.log('Planos:', planosData);
        console.log('Datas de Vencimento:', datasData);
        console.log('Vendedores:', vendedoresData);
      } catch (error) {
        console.error('Erro ao buscar configurações de colunas do NocoDB:', error);
      }
    };
  
    fetchData();
  }, []);
  


  useEffect(() => {
    // Inicializar os valores dos estados com os dados do JSON
    setPlanos(data.planos);
    setDatasVencimento(data.datasVencimento);
    setVendedores(data.vendedores);
  }, []);
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
  
    // Validação para verificar se os telefones são iguais
    if (name === 'telefone1' || name === 'telefone2') {
      if (
        (name === 'telefone1' && value === formData.telefone2) ||
        (name === 'telefone2' && value === formData.telefone1)
      ) {
        setErrorTelefone('Os telefones não podem ser iguais.');
      } else {
        setErrorTelefone('');
      }
    }
  };
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const dataFormatada = formData.dataNascimento
      ? formData.dataNascimento.split('/').reverse().join('-')
      : '';
  
    try {
      const planoSelecionado = planos.find((p) => p.nome === formData.planoContratado);
  
      if (!planoSelecionado) {
        alert('Selecione um plano válido.');
        return;
      }
  
      if (!formData.coordenadas || !formData.coordenadas.lat || !formData.coordenadas.lng) {
        alert('Por favor, adicione sua localização antes de enviar.');
        return;
      }
  
      const payload = {
        ...formData,
        planoContratado: planoSelecionado.id,
        coordenadas: {
          latitude: formData.coordenadas.lat,
          longitude: formData.coordenadas.lng,
        },
      };
  
      console.log('Payload enviado ao Webhook:', payload);
  
      await axios.post(
        'https://n8n.nexusnerds.com.br/webhook-test/077381c6-a42f-4aca-8a56-174167cae26f',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'xc-token': nocodbToken,
          },
        }
      );
  
      alert('Cadastro realizado com sucesso!');
      setFormData({
        nomeCompleto: '',
        cpfCnpj: '',
        rg: '',
        dataNascimento: '',
        email: '',
        telefone1: '',
        telefone2: '',
        cidade: '',
        bairro: '',
        endereco: '',
        cep: '',
        numeroResidencial: '',
        complemento: '',
        referencia: '',
        planoContratado: '',
        dataVencimento: '',
        vendedor: '',
        coordenadas: { lat: null, lng: null },
      });
      setActiveStep(0);
    } catch (error) {
      console.error('Erro ao enviar cadastro:', error);
      alert('Erro ao cadastrar. Verifique os dados e tente novamente.');
    }
  };
  
  
  

  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nome Completo"
                name="nomeCompleto"
                fullWidth
                required
                variant="outlined"
                value={formData.nomeCompleto}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <InputMask
                mask="999.999.999-99"
                value={formData.cpfCnpj}
                onChange={handleInputChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    label="CPF/CNPJ"
                    name="cpfCnpj"
                    fullWidth
                    required
                    variant="outlined"
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="RG"
                name="rg"
                fullWidth
                variant="outlined"
                value={formData.rg}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={formData.dataNascimento}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Telefone 01"
                  name="telefone1"
                  fullWidth
                  variant="outlined"
                  value={formData.telefone1}
                  onChange={handleInputChange}
                  error={!!errorTelefone} // Adiciona estado de erro
                  helperText={errorTelefone} // Exibe a mensagem de erro
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Telefone 02"
                  name="telefone2"
                  fullWidth
                  variant="outlined"
                  value={formData.telefone2}
                  onChange={handleInputChange}
                  error={!!errorTelefone} // Adiciona estado de erro
                  helperText={errorTelefone} // Exibe a mensagem de erro
                />
              </Grid>
            <Grid item xs={12}>
              <TextField
                label="E-mail"
                name="email"
                fullWidth
                required
                variant="outlined"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                apiKey="AIzaSyARQNVrPOVWN2Gf14l8qemF9xPstYiRwVw" // Substitua pela sua chave da API do Google Maps
                onPlaceSelected={(place) => {
                  if (!place || !place.formatted_address) {
                    console.warn("Endereço inválido ou não selecionado corretamente.");
                    return;
                  }
                
                  const enderecoCompleto = place.formatted_address;
                  const coordenadas = {
                    lat: place.geometry?.location?.lat?.() || null, // Verificação de segurança
                    lng: place.geometry?.location?.lng?.() || null, // Verificação de segurança
                  };
                
                  const addressComponents = place.address_components;
                  const cep = addressComponents.find((comp) => comp.types.includes("postal_code"))?.long_name || "";
                  const bairro = addressComponents.find((comp) => comp.types.includes("sublocality_level_1") || comp.types.includes("sublocality"))?.long_name || "";
                  const cidade = addressComponents.find((comp) => comp.types.includes("administrative_area_level_2"))?.long_name || "";
                  const estado = addressComponents.find((comp) => comp.types.includes("administrative_area_level_1"))?.short_name || "";
                
                  setFormData((prevState) => ({
                    ...prevState,
                    endereco: enderecoCompleto,
                    cep,
                    bairro,
                    cidade,
                    estado,
                    coordenadas,
                  }));
                }}
                options={{
                  types: ["address"],
                  componentRestrictions: { country: "br"},
                }}                
                defaultValue={formData.endereco || ""}
                placeholder="Endereço Completo"
                className="form-control"
                style={{
                  width: "100%",
                  height: "56px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                  padding: "0 14px",
                  boxSizing: "border-box",
                }}
              />
            </Grid>



            <Grid item xs={6}>
              <TextField
                label="CEP"
                name="cep"
                fullWidth
                variant="outlined"
                value={formData.cep}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Número da Casa"
                name="numeroResidencial"
                fullWidth
                variant="outlined"
                value={formData.numeroResidencial}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Bairro"
                name="bairro"
                fullWidth
                variant="outlined"
                value={formData.bairro}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Ponto de Referência"
                name="referencia"
                fullWidth
                variant="outlined"
                value={formData.referencia}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <LocationPicker
                onSave={(coords) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    coordenadas: coords,
                  }));
                }}
              />
            </Grid>

          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Plano Contratado"
                name="planoContratado"
                select
                fullWidth
                required
                variant="outlined"
                value={formData.planoContratado}
                onChange={(e) => setFormData({ ...formData, planoContratado: e.target.value })}
              >
                {planos.map((plano) => (
                  <MenuItem key={plano.id} value={plano.nome}>
                    {plano.nome} - {plano.valor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Data de Vencimento"
                name="dataVencimento"
                select
                fullWidth
                required
                variant="outlined"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
              >
                {datasVencimento.map((data, index) => (
                  <MenuItem key={index} value={data}>
                    {data}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Vendedor"
                name="vendedor"
                select
                fullWidth
                required
                variant="outlined"
                value={formData.vendedor}
                onChange={(e) => setFormData({ ...formData, vendedor: e.target.value })}
              >
                {vendedores.map((vendedor, index) => (
                  <MenuItem key={index} value={vendedor}>
                    {vendedor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Typography
        variant="h4"
        style={{ marginBottom: '30px', fontWeight: 'bold', textAlign: 'center' }}
      >
        Cadastro de Cliente
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <StyledPaper style={{ marginTop: '20px' }}>
        {renderStepContent(activeStep)}

        <Box display="flex" justifyContent="space-between" marginTop="30px">
          <StyledButton
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Voltar
          </StyledButton>
          <StyledButton
            onClick={handleNext}
            variant="contained"
            color="primary"
          >
            {activeStep === steps.length - 1 ? 'Cadastrar' : 'Próximo'}
          </StyledButton>
        </Box>
      </StyledPaper>
    </Container>
  );
}

export default Cadastro;
