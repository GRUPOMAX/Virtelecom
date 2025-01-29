import { useNavigate } from 'react-router-dom';

function MinhaFatura() {
  const navigate = useNavigate();

  const handleRedirectToFinanceiro = () => {
    navigate('/financeiro');
  };

  return (
    <div>
      <button onClick={handleRedirectToFinanceiro}>Minhas Faturas</button>
    </div>
  );
}

export default MinhaFatura;
