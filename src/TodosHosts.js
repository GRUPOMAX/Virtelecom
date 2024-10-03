import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



const TodosHosts = () => {
  const location = useLocation();
  const { hosts } = location.state || { hosts: [] };
  const [expanded, setExpanded] = useState(false);
  const maxVisibleHosts = 5; // Defina o limite de hosts visíveis antes de agrupar em um dropdown.

    // Estados para as cores e ícones
  const [primaryColor, setPrimaryColor] = useState('green'); // Cor primária
  const [secudaryColor, setSecudaryColor] = useState('green'); // Cor secundária
  const [muiIconColor, setmuiIconColor] = useState('#b7a3ff'); // Cor secundária
  const [textmuilColor, settextmuilColor] = useState('#ccc'); // Cor secundária 
  const [iconConfigUrl, setIconConfigUrl] = useState(''); // URL do ícone de configuração
  const [iconName, setIconName] = useState('SettingsIcon'); // Nome do ícone dinâmico
  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5';


  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const fetchPrimaryColorAndIcons = async () => {
      console.log("Buscando as configurações de cores...");
  
      try {
        // Definir o token diretamente na função
        const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; 
        
        const response = await fetch('https://nocodb.nexusnerds.com.br/api/v2/tables/mw1lsgk4ka13uhs/records', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });
  
        // Verificar o status HTTP
        console.log("Response status:", response.status);
  
        if (response.ok) {
          const data = await response.json();
          console.log("Dados recebidos da API:", data);
  
          if (data.list && data.list.length > 0) {
            const settings = data.list[0];
  
            // Verifique se as cores estão disponíveis e sendo atualizadas
            if (settings.muiIconColor) {
              console.log("Atualizando MuiIconColor:", settings.muiIconColor);
              setmuiIconColor(settings.muiIconColor);
            } else {
              console.warn("Cor MuiIconColor não foi encontrada.");
            }
  
            if (settings.textmuilColor) {
              console.log("Atualizando TextMuiIconColor:", settings.textmuilColor);
              settextmuilColor(settings.textmuilColor);
            } else {
              console.warn("Cor TextMuiIconColor não foi encontrada.");
            }
          } else {
            console.warn("Nenhuma configuração foi encontrada na resposta da API.");
          }
        } else {
          console.error('Erro ao buscar as configurações:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar as configurações:', error);
      }
    };
  
    // Executa a função a cada X segundos (por exemplo, 30 segundos)
    const intervalId = setInterval(fetchPrimaryColorAndIcons, 3000); // 30 segundos
  
    // Executa a função imediatamente quando o componente é montado
    fetchPrimaryColorAndIcons();
  
    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);
  

  
  
  
  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '18px', fontWeight: 'bold', color: secudaryColor || '#4CAF50' }}>
        Todos os Hosts Conectados
      </Typography>

      {hosts.length > 0 ? (
        hosts.slice(0, maxVisibleHosts).map((host, index) => (
          <Paper
            key={index}
            sx={{
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '12px',
              backgroundColor: '#F9F9F9',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E0E0E0',
              transition: '0.3s',
              '&:hover': {
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                  {host.hostName || 'Desconhecido'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
                  <strong>IP:</strong> {host.ipAddress || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
                  <strong>MAC:</strong> {host.macAddress || 'N/A'}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '12px',
                  color: textmuilColor || '#222', // Padrão caso textmuilColor seja indefinido
                  padding: '4px 10px',
                  backgroundColor: muiIconColor || '#f9f9f9', // Padrão caso muiIconColor seja indefinido
                  borderRadius: '8px',
                }}
              >
                {host.interfaceType}
              </Typography>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: '#999' }}>Nenhum host conectado.</Typography>
      )}

      {hosts.length > maxVisibleHosts && (
        <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{ backgroundColor: muiIconColor || '#f9f9f9' }}
          >
            <Typography sx={{ color: textmuilColor || '#222' }}>
              {`Exibir mais ${hosts.length - maxVisibleHosts} hosts`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {hosts.slice(maxVisibleHosts).map((host, index) => (
              <Paper
                key={index}
                sx={{
                  padding: '15px',
                  marginBottom: '15px',
                  borderRadius: '12px',
                  backgroundColor: '#F9F9F9',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #E0E0E0',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                      {host.hostName || 'Desconhecido'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
                      <strong>IP:</strong> {host.ipAddress || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
                      <strong>MAC:</strong> {host.macAddress || 'N/A'}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '12px',
                      color: textmuilColor || '#222',
                      padding: '4px 10px',
                      backgroundColor: muiIconColor || '#f9f9f9',
                      borderRadius: '8px',
                    }}
                  >
                    {host.interfaceType}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default TodosHosts;