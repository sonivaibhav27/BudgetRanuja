import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Product} from 'react-native-qonversion';
import {PressableButton, ActivityLoader} from '../../common';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {Theme} from '../../theme&styles';
import {Icons, PopupMessage, QonversionManager} from '../../utils';

type Props = StackScreenProps<MainStackScreenType, 'Pricing'>;

const features = [
  'Unlimited Categories',
  'View Extra Detail without Ads',
  'Download Report without Ads',
];
const {width} = Dimensions.get('window');
const APP_ICON_SIZE = width * 0.33;
export default (props: Props) => {
  const [productState, setProductState] = React.useState<Product | null>(null);
  const [isUserMakingPayment, setIsUserMakingPayment] = React.useState(false);
  const getProductsFromQonversion = async () => {
    const product = await QonversionManager.getOfferings();
    if (product) {
      setProductState(product!);
    } else {
      setProductState(product!);
      PopupMessage(
        '',
        'Failed to get product from google, Please try again',
        () => {},
        false,
      );
    }
  };
  React.useEffect(() => {
    getProductsFromQonversion();
  }, []);
  const makePayment = async () => {
    setIsUserMakingPayment(true);
    if (
      productState !== null &&
      typeof productState.prettyPrice !== 'undefined'
    ) {
      await QonversionManager.makePayment(productState.qonversionID);
    }
    setIsUserMakingPayment(false);
  };
  if (productState === null) {
    return <ActivityLoader loadingText="Loading..." />;
  }
  return (
    <ScrollView style={styles.container}>
      <PressableButton
        onPress={() => props.navigation.goBack()}
        style={styles.crossContainer}>
        <Icons.Entypo name="cross" size={25} color="#000" />
      </PressableButton>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={[
              styles.appIcon,
              {width: APP_ICON_SIZE, height: APP_ICON_SIZE},
            ]}
            source={require('../../assets/images/Icon.png')}
          />
        </View>
        <View style={styles.featureContainer}>
          {features.map(feature => {
            return (
              <View style={styles.featureStyle} key={feature}>
                <Icons.Entypo
                  name="check"
                  size={18}
                  color={Theme.ColorsTheme.primary}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            );
          })}
        </View>
        {!!productState && (
          <View>
            <PressableButton
              disable={isUserMakingPayment}
              onPress={makePayment}
              style={styles.purchaseButton}>
              {isUserMakingPayment ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.purchaseText}>
                  {productState?.prettyPrice} / Lifetime
                </Text>
              )}
            </PressableButton>
          </View>
        )}
        <View>
          <Text style={styles.info}>
            By purchasing you will also help the developer to include amazing
            feature and also adhere to the privacy policy by purchasing
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  crossContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 40,
    padding: 8,
    alignSelf: 'flex-start',
    margin: 20,
  },
  appIcon: {
    borderRadius: 100,
  },
  contentContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
  },
  featureStyle: {
    backgroundColor: '#FFF',
    // elevation: 2,
    borderRadius: 8,
    marginBottom: 2,
    padding: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  featureContainer: {
    marginTop: 20,
  },
  purchaseButton: {
    backgroundColor: Theme.ColorsTheme.primary,
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 2,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 200,
    marginTop: 30,
  },
  purchaseText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    fontSize: 12,
    marginHorizontal: 20,
    marginTop: 8,
    textAlign: 'center',
    color: '#aaa',
  },
});
