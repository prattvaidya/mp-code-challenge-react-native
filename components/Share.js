import React from 'react';
import {Button, StyleSheet, View} from 'react-native';

const Share = ({
  onImport: handleImport,
  onExport: handleExport,
  onExportToOffice: handleExportToOffice,
  onTruncate: handleTrundate,
}) => {
  return (
    <View style={styles.sharingContainer}>
      <Button title="Import from Local Storage" onPress={handleImport} />
      <Button title="Export to Local Storage" onPress={handleExport} />
      <Button title="Export to Back-Office" onPress={handleExportToOffice} />
      <Button title="Truncate" color="firebrick" onPress={handleTrundate} />
    </View>
  );
};

export default Share;

const styles = StyleSheet.create({
  sharingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
