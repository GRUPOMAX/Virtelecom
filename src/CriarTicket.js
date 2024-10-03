import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  Paper,
  Fab,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Wifi as WifiIcon, Home as HomeIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PostAddIcon from '@mui/icons-material/PostAdd';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import LoupeIcon from '@mui/icons-material/Loupe';




// Mapeamento dos ícones disponíveis
const iconsMap = {
  Settings: <SettingsIcon />,
  Wifi: <WifiIcon />,
  Home: <HomeIcon />,
  AccountCircle: <AccountCircleIcon />,
  PostAddIcon: <PostAddIcon />,
  AddBoxIcon: <AddBoxIcon />,
  DataSaverOnIcon: <DataSaverOnIcon />,
  AddCircleIcon: <AddCircleIcon />,
  AddIcon: <AddIcon />,
  InsertCommentIcon: <InsertCommentIcon/>,
  LibraryAddIcon: <LibraryAddIcon/>,
  NoteAddIcon: <NoteAddIcon/>,
  PlaylistAddIcon: <PlaylistAddIcon/>,
  LoupeIcon: <LoupeIcon/>








  // Adicione mais ícones conforme necessário
};

const CriarTicket = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [atendimentos, setAtendimentos] = useState([]);
  const [selectedAtendimento, setSelectedAtendimento] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [idAssunto, setIdAssunto] = useState('');
  const [idCliente, setIdCliente] = useState(
    JSON.parse(localStorage.getItem('dadosCliente'))?.id_cliente || null
  );

  const [primaryColor, setPrimaryColor] = useState('green'); // Cor padrão
  const [iconOpenTicket, setIconOpenTicket] = useState(null); // Estado para o ícone
  const [iconCasaConectadaUrl, setIconCasaConectadaUrl] = useState('');
  const [priorityColors, setPriorityColors] = useState({});
  const [statusColors, setStatusColors] = useState({});
  const [backgroundSolucionadoColor, setBackgroundSolucionadoColor] = useState('');
  const [backgroundSpamColor, setBackgroundSpamColor] = useState('');
  const [secudaryColor, setSecudaryColor] = useState('green'); // Cor secundária



  // Define the table IDs for colors and icons
  const colorsTableId = 'mn37trxp7ai1efw'; // Nova tabela de cores
  const iconsTableId = 'm27t8z8ht25mplj'; // Nova tabela de ícones
  const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Token de autenticação

  // Fetch para buscar atendimentos
  const fetchAtendimentos = async () => {
    if (!idCliente) return;

    try {
      const response = await fetch(
        `https://www.appmax.nexusnerds.com.br/api/v1/atendimentos?id_cliente=${idCliente}`
      );
      if (response.ok) {
        const data = await response.json();
        setAtendimentos(data.registros || []); // Garante que seja um array
      } else {
        console.error('Erro ao buscar atendimentos:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar atendimentos:', error);
    }
  };

// Função para buscar cores e ícones
const fetchPrimaryColorAndIcons = async () => {
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
        
        // Definindo a cor primária
        if (settings.primaryColor) {
          setPrimaryColor(settings.primaryColor);
        }
                    // Define a cor secundária
        if (settings.secudaryColor) {
            setSecudaryColor(settings.secudaryColor);
        }
        if (settings.backgroundSolucionadoColor) {
          setBackgroundSolucionadoColor(settings.backgroundSolucionadoColor);
        }
        if (settings.backgroundSpamColor) {
          setBackgroundSpamColor(settings.backgroundSpamColor);
        }

        // Definindo as cores de prioridade
        setPriorityColors({
          baixa: settings.prioridadeColorBaixa,
          normal: settings.prioridadeColorNormal,
          alta: settings.prioridadeColorAlta,
          critica: settings.prioridadeColorCritica,
        });

        // Definindo as cores de status
        setStatusColors({
          pendente: settings.statusColorPendente,
          execucao: settings.statusColorExecução,
          osExecucao: settings.statusColor_OSExecução,
          osAgendada: settings.statusColor_OSAgendada,
          finalizada: settings.statusColor_OSFinalizada,
          solucionada: settings.statusColor_OSSolucionada,
          desconhecido: settings.statusColor_OSDesconhecido,
        });
      }
    } else {
      console.error('Erro ao buscar as configurações de cores:', colorsResponse.statusText);
    }

    if (iconsResponse.ok) {
      const iconsData = await iconsResponse.json();
      if (iconsData.list.length > 0) {
        const settings = iconsData.list[0];
        
        // Define o ícone do ticket
        if (settings.IconOpenTicket) {
          setIconOpenTicket(settings.IconOpenTicket); // Use o nome correto do campo aqui
        }
      }
    } else {
      console.error('Erro ao buscar as configurações de ícones:', iconsResponse.statusText);
    }
  } catch (error) {
    console.error('Erro ao buscar as configurações:', error);
  }
};


  useEffect(() => {
    const intervalId = setInterval(fetchPrimaryColorAndIcons, 5000);
    fetchPrimaryColorAndIcons();

    return () => clearInterval(intervalId);
  }, []);



  useEffect(() => {
    fetchAtendimentos(); // Carrega os atendimentos quando o componente é montado
  }, [idCliente]);

  const handleAtendimentoClick = (atendimento) => {
    setSelectedAtendimento(
      selectedAtendimento === atendimento ? null : atendimento
    );
  };

  const handleSubmit = async () => {
    if (!idCliente || !idAssunto || !titulo || !mensagem) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const ticketData = {
      id_cliente: idCliente.toString(),
      id_assunto: idAssunto.toString(),
      titulo: titulo,
      menssagem: mensagem,
    };

    try {
      const response = await fetch('https://www.appmax.nexusnerds.com.br/criar-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Ticket criado com sucesso!');
        setTitulo('');
        setMensagem('');
        setIdAssunto('');
        setModalOpen(false);
        fetchAtendimentos(); // Recarrega os atendimentos
      } else {
        const errorData = await response.json();
        alert(`Erro ao criar ticket: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao enviar ticket:', error);
      alert('Erro ao criar ticket. Tente novamente mais tarde.');
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'B':
        return { text: 'Baixa', color: priorityColors.baixa || 'navy' };
      case 'M':
        return { text: 'Normal', color: priorityColors.normal || 'gray' };
      case 'A':
        return { text: 'Alta', color: priorityColors.alta || 'orange' };
      case 'C':
        return { text: 'Crítica', color: priorityColors.critica || 'red' };
      default:
        return { text: '', color: 'transparent' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'T':
        return { label: 'Pendente', color: statusColors.pendente || 'yellow' };
      case 'EX':
        return { label: 'Execução', color: statusColors.execucao || '#ed5b51' };
      case 'OSAB':
        return { label: 'OS em Execução', color: statusColors.osExecucao || 'blue' };
      case 'OSAG':
        return { label: 'OS Agendada', color: statusColors.osAgendada || 'yellow' };
      case 'F':
        return { label: 'Finalizado', color: statusColors.finalizada || 'gray' };
      case 'S':
        return { label: 'Solucionado', color: statusColors.solucionada || 'green' };
      case 'Desconhecido':
        return { label: 'Desconhecido', color: statusColors.desconhecido || 'yellow' };
      default:
        return { label: '', color: 'transparent' };
    }
  };

  const formatDateToBR = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


    // Função para renderizar o ícone do botão
  const renderIcon = () => {
    if (iconOpenTicket && iconsMap[iconOpenTicket]) {
      return iconsMap[iconOpenTicket]; // Retorna o ícone mapeado
    }
    return <SettingsIcon />; // Ícone padrão caso não haja um definido
  };

  return (
    <Box sx={{ padding: '20px', height: '100vh', position: 'relative' }}>
      <Typography variant="h5" gutterBottom>
        Atendimentos
      </Typography>
      {atendimentos.length > 0 ? (
        <List>
          {atendimentos.slice(0, 3).map((atendimento) => (
            <div key={atendimento.id}>
              <ListItem
                button
                onClick={() => handleAtendimentoClick(atendimento)}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                }}
              >
                <ListItemText
                  primary={
                    <span>
                      {atendimento.titulo}{' '}
                      <span
                        style={{
                          color: getPriorityLabel(atendimento.prioridade).color,
                          backgroundColor: backgroundSpamColor || '#e0f7fa',
                          padding: '2px 8px',
                          borderRadius: '5px',
                        }}
                      >
                        {getPriorityLabel(atendimento.prioridade).text}
                      </span>
                      {getStatusLabel(atendimento.su_status).label && (
                        <span
                          style={{
                            color: getStatusLabel(atendimento.su_status).color,
                            backgroundColor: getStatusLabel(atendimento.su_status).label === 'Solucionado' 
                            ? backgroundSolucionadoColor 
                            : getStatusLabel(atendimento.su_status).label ? 'lightgreen' : 'transparent',
                            padding: '2px 8px',
                            borderRadius: '5px',
                          }}
                        >
                          {getStatusLabel(atendimento.su_status).label}
                        </span>
                      )}
                    </span>
                  }
                />
              </ListItem>
              <Collapse in={selectedAtendimento === atendimento}>
                <Paper
                  sx={{
                    padding: '15px',
                    borderRadius: '10px',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography variant="body1">
                    <strong>Mensagem:</strong> {atendimento.menssagem}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Data de Criação:</strong> {formatDateToBR(atendimento.data_criacao)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Última Atualização:</strong> {formatDateToBR(atendimento.ultima_atualizacao)}
                  </Typography>
                  {atendimento.endereco && (
                    <Typography variant="body1">
                      <strong>Endereço:</strong> {atendimento.endereco}
                    </Typography>
                  )}
                  {atendimento.latitude && atendimento.longitude && (
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}
                    >
                      <LocationOnIcon sx={{ color: 'green', marginRight: '5px' }} />
                    </Box>
                  )}
                </Paper>
              </Collapse>
            </div>
          ))}
        </List>
      ) : (
        <img
          src="https://i.ibb.co/7Rj8hfS/Nothing-Salles.png"
          alt="Nenhum Atendimento"
          style={{ width: '100%', height: 'auto', maxWidth: '400px' }}
        />
      )}

      <Fab
        sx={{
          position: 'fixed',
          bottom: '76px',
          right: '16px',
          backgroundColor: primaryColor,
          color: '#fff',
          '&:hover': { backgroundColor: secudaryColor || '#388E3C' },
        }}
        onClick={() => setModalOpen(true)}
      >
        {renderIcon()} {/* Renderiza o ícone aqui */}
      </Fab>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper
          sx={{
            padding: '30px',
            width: '80%',
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            border: `2px solid ${primaryColor}`, // Adiciona a borda com a cor primária
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '20px', color: primaryColor ||'green' }}>
            Abrir Atendimento
          </Typography>
          <TextField
            label="Título"
            variant="outlined"
            fullWidth
            margin="normal"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            label="Mensagem"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            sx={{ marginBottom: '15px' }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="id-assunto-label">ID do Assunto</InputLabel>
            <Select
              value={idAssunto}
              onChange={(e) => setIdAssunto(e.target.value)}
              sx={{ marginBottom: '15px' }}
            >
              <MenuItem value="11">Sem Conexão</MenuItem>
              <MenuItem value="21">Lentidão</MenuItem>
              <MenuItem value="22">Financeiro</MenuItem>
              <MenuItem value="3">Alteração de Endereço</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              backgroundColor: primaryColor ||'#4CAF50',
              '&:hover': { backgroundColor: secudaryColor ||'#388E3C' },
              width: '90%',
            }}
          >
            Enviar Ticket
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
};

export default CriarTicket;
