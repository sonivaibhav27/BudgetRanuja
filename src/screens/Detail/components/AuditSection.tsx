import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface AuditProps {
  text: string;
  amount: number;
}
const Audit = ({text, amount}: AuditProps) => {
  return (
    <View style={styles.auditContainer}>
      <Text style={styles.auditHeaderText}>{text}</Text>
      <Text style={styles.auditAmountText}>${amount}</Text>
    </View>
  );
};

export default () => {
  return (
    <View style={styles.container}>
      <Audit text="budget" amount={1000} />
      <Audit text="income" amount={2000} />

      <Audit text="expense" amount={2000} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(89,93,229)',
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-evenly',
  },
  auditContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  auditHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'capitalize',
  },
  auditAmountText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
});
