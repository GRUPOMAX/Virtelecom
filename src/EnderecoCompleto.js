import React from "react";
import { TextField } from "@mui/material";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const EnderecoCompleto = ({ value, onChange }) => {
  const { ready, value: inputValue, suggestions, setValue, clearSuggestions } = usePlacesAutocomplete();

  const handleSelect = async (description) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      onChange(description, { lat, lng });
    } catch (error) {
      console.error("Erro ao obter coordenadas:", error);
    }
  };

  return (
    <div>
      <TextField
        label="Endereço Completo"
        fullWidth
        variant="outlined"
        value={inputValue || value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
      />
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {suggestions.status === "OK" &&
          suggestions.data.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion.description)}
              style={{ cursor: "pointer", padding: "5px 0" }}
            >
              {suggestion.description}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default EnderecoCompleto;
