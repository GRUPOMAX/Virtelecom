import { useState, useEffect } from 'react';

const useFetchAppSettings = () => {
  const [primaryColor, setPrimaryColor] = useState('#28a745'); // Valor padrão
  const [footerIconColor, setFooterIconColor] = useState('#000000'); // Valor padrão

  useEffect(() => {
    // Função para buscar as configurações do NocoDB
    const fetchAppSettings = async () => {
      const token = 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5'; // Substitua pelo token correto
      try {
        const response = await fetch('https://nocodb.nexusnerds.com.br/api/v2/tables/mw1lsgk4ka13uhs/records', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'xc-token': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.list.length > 0) {
            const settings = data.list[0];

            // Atualiza a cor primária (CircleLoader) com o valor recebido do NocoDB
            if (settings.primaryColor) {
              setPrimaryColor(settings.primaryColor);
            }

            // Atualiza a cor dos ícones do footer com o valor recebido do NocoDB
            if (settings.footerIconColor) {
              setFooterIconColor(settings.footerIconColor);
            }
          }
        } else {
          console.error('Erro ao buscar as configurações do app:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar as configurações do app:', error);
      }
    };

    fetchAppSettings();
  }, []);

  return { primaryColor, footerIconColor };
};

export default useFetchAppSettings;
