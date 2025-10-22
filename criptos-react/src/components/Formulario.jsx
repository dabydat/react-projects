import { useState, useEffect } from 'react'
import styled from '@emotion/styled';
import Error from './Error'
import useSelectMonedas from '../hooks/useSelectMonedas';
import { monedas, cantidadCriptos } from "../data/monedas";

const InputSubmit = styled.input`
  background-color: #9497FF;
  border: none;
  width:100%;
  padding: 10px;
  color: #FFFFFF;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 20px;
  border-radius: 5px;
  transition: background-color .3s ease;
  margin-top: 30px;
  
  &:hover {
    background-color: #7A7DFE;
    cursor:pointer;
  }
`

const Formulario = ({ setMonedas, setResultado }) => {
  const [criptos, setCriptos] = useState([])
  const [error, setError] = useState(false)
  const [moneda, SelectMonedas] = useSelectMonedas('Elige tu Moneda', monedas)
  const [criptomoneda, SelectCriptomoneda] = useSelectMonedas('Elige tu Criptomoneda', criptos)
  const [cantidadCriptomonedas, SelectCantidadCriptomonedas] = useSelectMonedas('Elige tu cantidad de Criptomonedas', cantidadCriptos)

  useEffect(() => {
    if (cantidadCriptomonedas) {
      const consultarAPI = async () => {
        const URL = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=${cantidadCriptomonedas}&tsym=USD`;
        const respuesta = await fetch(URL);
        const resultado = await respuesta.json();
        const arrayCriptos = resultado.Data.map(cripto => {
          const objecto = { id: cripto.CoinInfo.Name, nombre: cripto.CoinInfo.FullName }
          return objecto;
        })
        setCriptos(arrayCriptos)
      };
      consultarAPI();
    }
  }, [cantidadCriptomonedas])

  const handleSubmit = e => {
    e.preventDefault();
    if ([moneda, criptomoneda, cantidadCriptomonedas].includes('')) {
      setError(true);
      return;
    }
    setError(false);
    setMonedas({ moneda, criptomoneda });
  }

  return (
    <>
      {error && <Error>Seleccione la moneda y criptomoneda</Error>}
      <form onSubmit={handleSubmit}>
        <SelectMonedas />
        <SelectCantidadCriptomonedas />
        {cantidadCriptomonedas && <SelectCriptomoneda />}
        <InputSubmit type="submit" value="Cotizar" />
      </form>
    </>
  )
}

export default Formulario