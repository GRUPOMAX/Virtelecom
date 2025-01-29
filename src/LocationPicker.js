import React, { useState, useEffect } from "react";
import { Modal, Button, Box } from "@mui/material";
import axios from "axios";

const LocationPicker = ({ onSave }) => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [iconUrl, setIconUrl] = useState("");

  const nocodbToken = "ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5";
  const apiUrl = "https://nocodb.nexusnerds.com.br";

  const fetchIconUrl = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v2/tables/m3p8zfpw2tejup3/records`,
        {
          headers: {
            "Content-Type": "application/json",
            "xc-token": nocodbToken,
          },
          params: {
            fields: "Icon-LocationPicker",
            limit: 1,
          },
        }
      );

      const icon = response.data.list[0]["Icon-LocationPicker"];
      setIconUrl(icon || null);
    } catch (error) {
      console.error("Erro ao buscar URL do ícone:", error);
    }
  };

  useEffect(() => {
    fetchIconUrl();
  }, []);

  const handleOpen = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setOpen(true);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        alert("Não foi possível obter sua localização. Permita o acesso no navegador.");
      }
    );
  };
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        const mapElement = document.getElementById("map");
        if (mapElement) {
          // Inicializa o mapa
          const map = new google.maps.Map(mapElement, {
            center: location.lat && location.lng ? location : { lat: -14.235, lng: -51.9253 }, // Localização padrão: Brasil
            zoom: 15,
            disableDefaultUI: true,
          });
  
          // Cria o marcador arrastável
          const marker = new google.maps.Marker({
            position: location,
            map,
            draggable: true,
            icon: {
              url: iconUrl || undefined, // URL do ícone
              scaledSize: new google.maps.Size(50, 50), // Ajuste para o tamanho desejado (largura x altura)
            },
          });
  
          // Atualiza a localização ao mover o marcador
          google.maps.event.addListener(marker, "dragend", () => {
            const newPosition = marker.getPosition();
            setLocation({
              lat: newPosition.lat(),
              lng: newPosition.lng(),
            });
          });
        } else {
          console.error("Elemento com ID 'map' não encontrado.");
        }
      }, 100); // Aguarda 100ms para garantir que o DOM esteja pronto
  
      return () => clearTimeout(timeout); // Limpa o timeout ao desmontar o componente
    }
  }, [open, location, iconUrl]);
  
  
  const handleSave = () => {
    if (location.lat && location.lng) {
      onSave(location);
      setOpen(false);
    } else {
      alert("Por favor, selecione uma localização válida.");
    }
  };

  return (
    <div>
      <p
        onClick={handleOpen}
        style={{
          color: "#007BFF",
          cursor: "pointer",
          textDecoration: "underline",
          margin: "10px 0",
        }}
      >
        Adicione sua Localização aqui!
      </p>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          style={{
            width: "90%",
            height: "400px",
            margin: "50px auto",
            backgroundColor: "#fff",
            padding: "20px",
            position: "relative",
            borderRadius: "8px",
          }}
        >
          <div id="map" style={{ width: "100%", height: "300px" }}></div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
            onClick={handleSave}
          >
            Salvar Localização
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default LocationPicker;
