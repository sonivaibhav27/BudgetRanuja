import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {CurrencyOperations} from '../../../../../database';
import {NavigationTypes} from '../../../../../types';
import {
  Loader,
  Pressable,
  PressableTextButton,
  Text,
} from '../../../../components';
import {COLORS, PADDING} from '../../../../theme';

type Props = {
  data: any[];
  onItemSelect: (name: string, symbol: string) => void;
  navigation: StackNavigationProp<
    NavigationTypes.TSettingStackScreen,
    'Settings'
  >;
};

export default (props: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = React.useState<
    string | undefined | null
  >(undefined);
  const [selectedCurrencyName, setSelectedCurrencyName] = React.useState<
    string | undefined | null
  >(undefined);
  const init = async () => {
    const currency = await CurrencyOperations.getCurrency();
    setSelectedCurrencySymbol(currency?.symbol);
    setSelectedCurrencyName(currency?.name);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      init();
    }, []),
  );

  const _onItemSelect = async (name: string, symbol: string) => {
    props.onItemSelect(name, symbol);
    setSelectedCurrencySymbol(symbol);
    setSelectedCurrencyName(name);
  };
  const goToEditScreen = () => {
    props.navigation.navigate('Edit', {
      comingFrom: 'Currency',
    });
  };
  const renderItem = ({item}: {item: any}) => {
    const isSelected =
      item.symbol === selectedCurrencySymbol &&
      item.name === selectedCurrencyName;
    return (
      <Pressable
        onPress={() => _onItemSelect(item.name, item.symbol)}
        style={styles.itemContainer}>
        <Text textType="normal" style={styles.text}>
          {item.name}
        </Text>
        <Text
          textType="subheading"
          style={[
            styles.symbol,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              color: isSelected ? COLORS.primary : 'black',
            },
          ]}>
          {item.symbol}
        </Text>
      </Pressable>
    );
  };
  const goToEditScreenWithCustomData = () => {
    props.navigation.navigate('Edit', {
      comingFrom: 'Currency',
      category: {
        categoryName: selectedCurrencySymbol!,
      },
      // categoryName: selectedCurrencySymbol!,
    });
  };
  if (loading) {
    return (
      <Loader
        show={loading}
        backdropColor={COLORS.white}
        loadingText="Loading Currencies..."
      />
    );
  }
  return (
    <>
      <FlatList
        keyExtractor={(item, index) => `${item.name}-${index}`}
        data={props.data}
        renderItem={renderItem}
        ListFooterComponent={() => {
          if (
            (selectedCurrencyName?.length &&
              selectedCurrencyName !== 'Custom') ||
            typeof selectedCurrencyName === 'undefined' ||
            selectedCurrencyName === null
          ) {
            return (
              <PressableTextButton
                textType="normal"
                text="Add Custom Currency"
                textStyle={styles.newCurrencyText}
                onPress={goToEditScreen}
                style={styles.newCurrencyAdd}
              />
            );
          }
          return (
            <Pressable
              onPress={goToEditScreenWithCustomData}
              style={[
                styles.itemContainer,
                {backgroundColor: COLORS.lightGray, borderRadius: 8},
              ]}>
              <Text textType="normal" style={styles.text}>
                {selectedCurrencyName}
              </Text>
              <Text
                textType="normal"
                style={[styles.symbol, {color: COLORS.primary}]}>
                {selectedCurrencySymbol || ''}
              </Text>
            </Pressable>
          );
        }}
      />
    </>
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
    alignItems: 'center',
  },
  symbol: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#000',
  },
  newCurrencyAdd: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    padding: PADDING.big,
    borderRadius: 8,
    marginTop: 10,
  },
  newCurrencyText: {
    color: '#fff',
    fontSize: 15,
  },
});
