/*NÃO UTILIZANDO*/


import { useNavigate } from 'react-router-dom';

function MinhaFatura() {
  const navigate = useNavigate();

  const handleRedirectToFinanceiro = () => {
    const cpfCnpj = localStorage.getItem('cnpj_cpf');
    if (cpfCnpj) {
      navigate(`/financeiro?cpfCnpj=${cpfCnpj}`);
    } else {
      console.error('CPF/CNPJ não encontrado no localStorage.');
    }
  };

  return (
    <div>
      <button onClick={handleRedirectToFinanceiro}>Minhas Faturas</button>
    </div>
  );
}

export default MinhaFatura;
