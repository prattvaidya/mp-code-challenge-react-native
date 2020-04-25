import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

const CustomerList = ({
  customers,
  onDelete: handleDelete,
  onEdit: handleEdit,
}) => {
  return (
    <>
      <Text style={styles.subHeader}> Customer List </Text>
      {customers.map(customer => (
        <View key={customer.id} style={styles.customerContainer}>
          <Text style={styles.columnName}>{customer.name}</Text>
          <Text style={styles.columnTel}>{customer.tel}</Text>
          <View style={styles.actions}>
            <Button title="Edit" onPress={() => handleEdit(customer)} />
            <Button
              title="Delete"
              onPress={() => handleDelete(customer.id)}
              color="firebrick"
            />
          </View>
        </View>
      ))}
    </>
  );
};

export default CustomerList;

const styles = StyleSheet.create({
  subHeader: {
    fontSize: 24,
    textAlign: 'center',
    paddingTop: 25,
  },
  customerContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  columnName: {
    flex: 1,
  },
  columnTel: {
    flex: 1,
    justifyContent: 'center',
  },
});
