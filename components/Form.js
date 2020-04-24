import React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

const Form = ({
  name,
  tel,
  onNameChange: handleNameChange,
  onTelChange: handleTelChange,
  onSubmit: handleSubmit,
}) => {
  return (
    <View style={styles.customerForm}>
      <View style={styles.formControl}>
        <Text>Name</Text>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={handleNameChange}
          style={styles.textFields}
        />
      </View>

      <View style={styles.formControl}>
        <Text>Tel</Text>
        <TextInput
          placeholder="Tel"
          value={tel}
          onChangeText={handleTelChange}
          style={styles.textFields}
        />
      </View>
      <Button title="Add/Update" onPress={handleSubmit} />
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  customerForm: {
    borderBottomWidth: 3,
    paddingBottom: 20,
  },
  formControl: {
    marginHorizontal: 50,
    marginVertical: 10,
  },
  textFields: {
    borderWidth: 1,
    padding: 5,
  },
});
