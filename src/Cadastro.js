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
import { Modal } from '@mui/material';
import axios from 'axios';
import data from './data.json'; // Supondo que o arquivo JSON esteja no mesmo diretório
import InputMask from 'react-input-mask';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import Autocomplete from "react-google-autocomplete";
import LocationPicker from "./LocationPicker";
import { FormControlLabel, Checkbox } from '@mui/material';





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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorTelefone1, setErrorTelefone1] = useState('');
  const [errorTelefone2, setErrorTelefone2] = useState('');


  
  


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
    const requiredFieldsStep1 = ['nomeCompleto', 'cpfCnpj', 'dataNascimento'];
    const requiredFieldsStep2 = ['telefone1', 'telefone2', 'endereco', 'cep', 'numeroResidencial', 'bairro'];
    const requiredFieldsStep3 = ['planoContratado', 'vendedor', 'dataVencimento'];
  
    const stepsRequiredFields = [requiredFieldsStep1, requiredFieldsStep2, requiredFieldsStep3];
  
    const fieldLabels = {
      nomeCompleto: "Nome Completo",
      cpfCnpj: "CPF/CNPJ",
      rg: "RG",
      dataNascimento: "Data de Nascimento",
      telefone1: "Telefone 01",
      telefone2: "Telefone 02",
      email: "E-mail",
      endereco: "Endereço Completo",
      cep: "CEP",
      numeroResidencial: "Número da Casa",
      bairro: "Bairro",
      referencia: "Ponto de Referência",
      planoContratado: "Plano Contratado",
      dataVencimento: "Data de Vencimento",
      vendedor: "Vendedor",
    };
  
    // Verifica os campos obrigatórios para a etapa atual
    const currentRequiredFields = stepsRequiredFields[activeStep];
  
    for (const field of currentRequiredFields) {
      if (!formData[field]) {
        const fieldLabel = fieldLabels[field] || field; // Usa o nome amigável ou o nome técnico
        setModalMessage(`O campo "${fieldLabel}" é obrigatório.`);
        setModalOpen(true);
        return; // Para o avanço se algum campo obrigatório estiver vazio
      }
    }
  
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
    const requiredFields = [
      { name: 'nomeCompleto', label: 'Nome Completo' },
      { name: 'cpfCnpj', label: 'CPF/CNPJ' },
      { name: 'dataNascimento', label: 'Data de Nascimento' },
      { name: 'telefone1', label: 'Telefone 1' },
      { name: 'telefone2', label: 'Telefone 2' },
      { name: 'endereco', label: 'Endereço Completo' },
      { name: 'cep', label: 'CEP' },
      { name: 'numeroResidencial', label: 'Número da Casa' },
      { name: 'bairro', label: 'Bairro' },
      { name: 'planoContratado', label: 'Plano Contratado' },
      { name: 'vendedor', label: 'Vendedor' },
      { name: 'dataVencimento', label: 'Data de Vencimento' },
    ];
  
    for (const field of requiredFields) {
      if (!formData[field.name]) {
        alert(`O campo "${field.label}" é obrigatório.`);
        return;
      }
    }
  
    const dataFormatada = formData.dataNascimento
      ? formData.dataNascimento.split('/').reverse().join('-')
      : '';
  
    try {
      const planoSelecionado = planos.find(
        (p) => p.nome === formData.planoContratado
      );
  
      if (!planoSelecionado) {
        alert('Selecione um plano válido.');
        return;
      }
  
      // Determine o valor da casa (Própria ou Alugada)
      let tipoCasa = '';
      if (formData.casaPropria) {
        tipoCasa = 'Casa Própria';
      } else if (formData.casaAlugada) {
        tipoCasa = 'Casa Alugada';
      }
  
      const payload = {
        ...formData,
        planoContratado: planoSelecionado.id,
        nomePlano: planoSelecionado.nome, // Inclui o nome do plano no payload
        tipoCasa, // Adiciona o valor do tipo de casa
      };
  
      console.log('Payload enviado ao Webhook:', payload);
  
      await axios.post(
        'https://webhook.nexusnerds.com.br/webhook/077381c6-a42f-4aca-8a56-174167cae26f',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'xc-token': nocodbToken,
          },
        }
      );
  

        // Exibir modal de sucesso
      setSuccessModalOpen(true);

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
        nomePlano: '', // Adicionado
        dataVencimento: '',
        vendedor: '',
        casaPropria: false, // Adicionado
        casaAlugada: false, // Adicionado
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
                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.telefone1}
                  onChange={(e) => {
                    const telefone = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
                    setFormData((prev) => ({ ...prev, telefone1: telefone }));

                    // Validação para evitar números iguais
                    if (telefone === formData.telefone2) {
                      setErrorTelefone1('Os telefones não podem ser iguais.');
                    } else {
                      setErrorTelefone1(''); // Limpa erro
                      setErrorTelefone2(''); // Limpa erro no outro campo, se necessário
                    }
                  }}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="Telefone 01"
                      name="telefone1"
                      fullWidth
                      variant="outlined"
                      error={!!errorTelefone1}
                      helperText={errorTelefone1}
                    />
                  )}
                </InputMask>
              </Grid>

              <Grid item xs={6}>
                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.telefone2}
                  onChange={(e) => {
                    const telefone = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
                    setFormData((prev) => ({ ...prev, telefone2: telefone }));

                    // Validação para evitar números iguais
                    if (telefone === formData.telefone1) {
                      setErrorTelefone2('Os telefones não podem ser iguais.');
                    } else {
                      setErrorTelefone2(''); // Limpa erro
                      setErrorTelefone1(''); // Limpa erro no outro campo, se necessário
                    }
                  }}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="Telefone 02"
                      name="telefone2"
                      fullWidth
                      variant="outlined"
                      error={!!errorTelefone2}
                      helperText={errorTelefone2}
                    />
                  )}
                </InputMask>
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.casaPropria}
                      onChange={(e) =>
                        setFormData({ ...formData, casaPropria: e.target.checked, casaAlugada: !e.target.checked })
                      }
                    />
                  }
                  label="Casa Própria"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.casaAlugada}
                      onChange={(e) =>
                        setFormData({ ...formData, casaAlugada: e.target.checked, casaPropria: !e.target.checked })
                      }
                    />
                  }
                  label="Casa Alugada"
                />
              </Grid>

                  {/*
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
            */}

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
                  value={formData.planoContratado} // Deve conter o nome do plano
                  onChange={(e) => {
                    const selectedPlano = planos.find(
                      (plano) => plano.nome === e.target.value
                    );
                    setFormData({
                      ...formData,
                      planoContratado: selectedPlano ? selectedPlano.nome : '',
                    });
                  }}
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Campos Obrigatórios
          </Typography>
          <Typography sx={{ mt: 2 }}>{modalMessage}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(false)}
            sx={{ mt: 3 }}
          >
            OK
          </Button>
        </Box>
      </Modal>
      <Modal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          aria-labelledby="success-modal-title"
          aria-describedby="success-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography id="success-modal-title" variant="h6" component="h2" textAlign="center">
              Cadastro Realizado com Sucesso!
            </Typography>
            <Typography id="success-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
              Seu cadastro será analisado e nossa equipe entrará em contato em breve. Obrigado!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSuccessModalOpen(false)}
              sx={{ mt: 3, display: 'block', mx: 'auto' }}
            >
              Fechar
            </Button>
          </Box>
        </Modal>


    </Container>
  );
}

export default Cadastro;
