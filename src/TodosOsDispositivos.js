import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { Computer } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const TodosOsDispositivos = ({ frequencia: propFrequencia }) => {
  const { frequencia: urlFrequencia } = useParams(); // Pega a frequência da URL
  const [hosts, setHosts] = useState([]);
  
  // Use a frequência da prop se fornecida, senão use a da URL
  const frequencia = propFrequencia || urlFrequencia;

  useEffect(() => {
    // Verifica se a frequência é definida
    if (!frequencia) {
      console.log('Frequência não definida na URL.');
      return;
    }

    const dadosCliente = JSON.parse(localStorage.getItem('dadosCliente'));

    if (
      dadosCliente &&
      dadosCliente.dadosCliente &&
      dadosCliente.dadosCliente.Onu &&
      dadosCliente.dadosCliente.Onu['ACS_completo.json'] &&
      dadosCliente.dadosCliente.Onu['ACS_completo.json'].data
    ) {
      const allHosts = dadosCliente.dadosCliente.Onu['ACS_completo.json'].data.hosts.hosts || [];

      // Se a frequência for "ethernet", filtra dispositivos conectados via cabo
      if (frequencia === 'ethernet') {
        const hostsNaRede = allHosts.filter((host) => host.interfaceType === 'Ethernet' && host.active);
        console.log(`Hosts encontrados para ethernet:`, hostsNaRede);
        setHosts(hostsNaRede);
        return; // Sai da função após definir hosts para Ethernet
      }

      // Verificação das frequências 2.4GHz e 5GHz
      const interfaceTypePorFrequencia = {
        '2.4ghz': '802.11',
        '5ghz': '802.11ac'
      };

      // Obtém o tipo de interface correto com base na frequência
      const interfaceTypeEsperado = interfaceTypePorFrequencia[frequencia.toLowerCase()];

      if (!interfaceTypeEsperado) {
        console.log(`Frequência ${frequencia} não é suportada ou não há interfaceType mapeado.`);
        return;
      }

      // Filtra os hosts para Wi-Fi com base na interfaceType e se o host está ativo
      const hostsNaRede = allHosts.filter(
        (host) => host.interfaceType === interfaceTypeEsperado && host.active
      );

      console.log(`Frequência recebida: ${frequencia}`);
      console.log(`Hosts encontrados para a frequência ${frequencia}:`, hostsNaRede);

      setHosts(hostsNaRede);
    } else {
      console.log('Não foi possível acessar ACS_completo.json');
    }
  }, [frequencia]);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Dispositivos Conectados - {frequencia || 'Desconhecida'}
      </Typography>

      {hosts.length > 0 ? (
        hosts.map((host, index) => (
          <Paper key={index} sx={{ padding: '15px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#f4f4f4', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Computer sx={{ marginRight: '10px', color: '#047B02' }} />
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                {host.hostName || 'Desconhecido'}
              </Typography>
            </Box>
            <Divider sx={{ marginBottom: '10px' }} />
            <Typography variant="body2" sx={{ marginBottom: '5px', color: '#666' }}>
              <strong>IP:</strong> {host.ipAddress}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '5px', color: '#666' }}>
              <strong>MAC:</strong> {host.macAddress}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              <strong>Fornecedor:</strong> {host.vendorName?.split(' ')[0] || 'Desconhecido'}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography>Nenhum dispositivo encontrado</Typography>
      )}
    </Box>
  );
};

export default TodosOsDispositivos;
