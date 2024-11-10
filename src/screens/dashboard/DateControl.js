import React, {useState, useEffect} from 'react';
import MydatePicker from '../../components/datePicker';


const DateControl = ({disabled, handleChange, value, renderType}) => {
  const [minDate, setMinDate] = useState(undefined);
  const maxDate = new Date()


  return (
    <MydatePicker
      // disabled={disabled}
      handleChange={handleChange}
      minDate={minDate}
      selectedValue={value}
      maxDate={maxDate}
    />
  );
};

export default DateControl;
