import React, { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";

const AddressInput = () => {
  const [address, setAddress] = useState("");

  const handleSelect = (value) => {
    setAddress(value);
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
      searchOptions={{
        componentRestrictions: { country: "br" },
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input {...getInputProps({ placeholder: "Digite o endereço" })} />
          <div>
            {loading ? <div>Carregando...</div> : null}
            {suggestions.map((suggestion) => (
              <div
                {...getSuggestionItemProps(suggestion, {
                  style: { backgroundColor: suggestion.active ? "#fafafa" : "#ffffff" },
                })}
              >
                {suggestion.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default AddressInput;
