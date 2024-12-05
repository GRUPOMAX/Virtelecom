import React, { useState, useEffect } from "react";
import { Modal, Button, Box } from "@mui/material";

const LocationPicker = ({ onSave }) => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });

  const handleOpen = () => {
    // Usar geolocalização do navegador para definir a localização inicial
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
    if (open && location.lat && location.lng) {
      // Inicializa o mapa com controles desativados
      const map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 15,
        disableDefaultUI: true, // Remove controles padrão
        zoomControl: false, // Remove os botões de zoom
        streetViewControl: false, // Remove o controle do Street View
        fullscreenControl: false, // Remove o botão de tela cheia
      });
  
      // Cria o marcador que pode ser arrastado
      const marker = new google.maps.Marker({
        position: location,
        map,
        draggable: true, // Permitir que o pino seja arrastado
      });
  
      // Atualiza a localização quando o pino é movido
      google.maps.event.addListener(marker, "dragend", () => {
        const newPosition = marker.getPosition();
        setLocation({
          lat: newPosition.lat(),
          lng: newPosition.lng(),
        });
      });
    }
  }, [open, location]);
  
  
  
  

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

      <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                    document.activeElement.blur(); // Remove o foco de qualquer elemento ativo
                  }}
                keepMounted
                onEntered={() => {
                    if (location.lat && location.lng) {
                    const mapElement = document.getElementById("map");
                    if (mapElement) {
                        const map = new google.maps.Map(mapElement, {
                        center: location,
                        zoom: 15,
                        });

                        const marker = new google.maps.Marker({
                        position: location,
                        map,
                        draggable: true,
                        });

                        google.maps.event.addListener(marker, "dragend", () => {
                        const position = marker.getPosition();
                        setLocation({ lat: position.lat(), lng: position.lng() });
                        });
                    }
                    }
                }}
                >
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
