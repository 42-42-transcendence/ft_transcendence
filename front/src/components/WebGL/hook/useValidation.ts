import { useEffect, useState } from 'react';
import data from '../interface/gameData';

function useValidation() {
    const [validation, setValidation] = useState(data.validation);
  
    useEffect(() => {
      const checkValidation = () => {
        setValidation(data.validation);
      };
        window.addEventListener('validationChanged', checkValidation);
      return () => {
        window.removeEventListener('validationChanged', checkValidation);
      };
    }, []);
  
    return validation;
  }

  export default useValidation;