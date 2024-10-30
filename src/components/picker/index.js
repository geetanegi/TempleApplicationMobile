import {StyleSheet, Text, View, TouchableOpacity,Platform} from 'react-native';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';

import {colors} from '../../global/theme';
import moment from 'moment';
import st from '../../global/styles';

const MyPicker = ({
  editableField,
  disabled,
  handleChange,
  minDate,
  selectedValue,
  maxDate,
  renderType,
  placeholder
}) => {
  
  const [open, setOpen] = useState(false);
  const pickerDate = selectedValue
    ? selectedValue instanceof Date
      ? selectedValue
      : new Date(selectedValue)
    : new Date();
  const displayDate = selectedValue
    ? moment(selectedValue).format('DD-MM-YYYY')
    : placeholder
    ? placeholder
    : '';


  const handleDateChange = newDate => {
    setOpen(false);
    handleChange(newDate);
  };

  const renderControl = () => {
      return (
        <>
          <TouchableOpacity
         //   disabled={disabled}
            style={[
              st.inputDatesty,
              st.justify_C,
              st.mt_t10
              // disabled && styles.disabled,
            ]}
            onPress={() => setOpen(true)}>
            <Text
              style={[
                st.tx14,
                {
                  color: colors.black
                },
              ]}>
              {selectedValue ? displayDate : renderType}
            </Text>
          </TouchableOpacity>
        </>
      );
  };

  return (
    <>
      {renderControl()}
      <DatePicker
        modal
        open={open}     
        mode={'date'}
        date={pickerDate}
        // minimumDate={minDate}
         maximumDate={maxDate}
        onConfirm={handleDateChange}
        onCancel={() => {
          setOpen(false);
        }}
        disabled={disabled}
      />
    </>
  );
};

export default MyPicker;

const styles = StyleSheet.create({
  disabled: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  datePicsty: {
    backgroundColor: '#E6E6E6',
    padding: 5,
    width: 160,
  },
});
