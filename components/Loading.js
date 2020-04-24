import React from 'react';
import {StyleSheet, Image, View} from 'react-native';

const Loading = () => {
  return (
    <View style={styles.loading}>
      <Image
        style={{width: 150, height: 150}}
        source={require('../img/loading.gif')}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
