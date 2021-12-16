import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Text, StyleSheet, FlatList, View} from 'react-native';
import {PressableButton} from '../../../common';
import {CurrencyOperations} from '../../../database';
import {MainStackScreenType} from '../../../navigations/MainStack/types';
import {Theme} from '../../../theme&styles';

type Props = {
  data: any[];
  onItemSelect: (name: string, symbol: string) => void;
  navigation: StackNavigationProp<MainStackScreenType, 'Settings'>;
  closeModal: () => void;
};

export default (props: Props) => {
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = React.useState<
    string | undefined | null
  >(undefined);
  const [selectedCurrencyName, setSelectedCurrencyName] = React.useState<
    string | undefined | null
  >(undefined);
  React.useEffect(() => {
    const init = async () => {
      const currency = await CurrencyOperations.getCurrency();
      setSelectedCurrencySymbol(currency?.symbol);
      setSelectedCurrencyName(currency?.name);
    };
    init();
  }, []);
  React.useEffect(() => {
    const navigation = props.navigation.addListener('focus', () => {
      const init = async () => {
        const currency = await CurrencyOperations.getCurrency();
        console.log({currency});
        setSelectedCurrencySymbol(currency?.symbol);
        setSelectedCurrencyName(currency?.name);
      };

      init();
    });

    return () => navigation();
  }, [props.navigation]);
  const _onItemSelect = async (name: string, symbol: string) => {
    props.onItemSelect(name, symbol);
    setSelectedCurrencySymbol(symbol);
    setSelectedCurrencyName(name);
  };
  const goToEditScreen = () => {
    props.navigation.navigate('EditCategory', {
      comingFrom: 'Currency',
    });
  };
  const renderItem = ({item}: {item: any}) => {
    return (
      <PressableButton
        onPress={() => _onItemSelect(item.name, item.symbol)}
        style={styles.itemContainer}>
        <View style={styles.radioContainer}>
          {item.symbol === selectedCurrencySymbol &&
            item.name === selectedCurrencyName && (
              <View style={styles.selectedRadio} />
            )}
        </View>
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.symbol}>{item.symbol}</Text>
      </PressableButton>
    );
  };
  const goToEditScreenWithCustomData = () => {
    // props.closeModal();
    props.navigation.navigate('EditCategory', {
      comingFrom: 'Currency',
      categoryName: selectedCurrencySymbol!,
    });
  };
  return (
    <FlatList
      keyExtractor={(item, index) => `${item.name}-${index}`}
      data={props.data}
      renderItem={renderItem}
      ListFooterComponent={() => {
        if (
          (selectedCurrencyName?.length && selectedCurrencyName !== 'Custom') ||
          typeof selectedCurrencyName === 'undefined' ||
          selectedCurrencyName === null
        ) {
          return (
            <PressableButton
              onPress={goToEditScreen}
              style={styles.newCurrencyAdd}>
              <Text style={styles.newCurrencyText}>Enter Custom Currency.</Text>
            </PressableButton>
          );
        }
        return (
          <PressableButton
            onPress={goToEditScreenWithCustomData}
            style={styles.itemContainer}>
            <View style={styles.radioContainer}>
              {selectedCurrencyName === 'Custom' && (
                <View style={styles.selectedRadio} />
              )}
            </View>
            <Text style={styles.text}>{selectedCurrencyName}</Text>
            <Text style={styles.symbol}>{selectedCurrencySymbol}</Text>
          </PressableButton>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000',
  },
  itemContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  newCurrencyAdd: {
    backgroundColor: Theme.ColorsTheme.primary,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  newCurrencyText: {
    color: '#fff',
    fontSize: 15,
  },
  radioContainer: {
    width: 15,
    height: 15,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    width: 10,
    height: 10,
    borderRadius: 9,
    backgroundColor: Theme.ColorsTheme.primary,
    alignSelf: 'center',
  },
});
