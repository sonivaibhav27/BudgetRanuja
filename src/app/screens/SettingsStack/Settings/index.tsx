import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, ScrollView, Linking, View} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {
  Loader,
  Header,
  PressableIconButton,
  FullScreenModal,
  Text,
} from '../../../components';
import {Icons, NativeModule, PaymentManager} from '../../../helper';

import Utils from '../../../utils';
import {
  SettingSection,
  DeleteBills,
  CurrencyList,
  CategoryList,
} from './components';
import {UtilState} from '../../../state';
import {CurrencyOperations} from '../../../../database';
import {NavigationTypes, UtilTypes} from '../../../../types';
import {Data} from '../../../assets';
import CommonStyles from '../../../styles';
import {useFocusEffect} from '@react-navigation/native';
import {AppUrl} from '../../../config';

const openAnotherApp = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch (err: any) {
    Utils.makeToast('No app found for this action');
  }
};

type Props = StackScreenProps<NavigationTypes.TSettingStackScreen, 'Settings'>;

const ChevronRightIcon = () => (
  <Icons.Entypo name={'chevron-right'} size={25} color="#000" />
);

export default ({navigation, route}: Props) => {
  const [isSettingsScreenFocused, setIsSettingsScreenFocused] =
    React.useState(true);
  const fullScreenRef = React.useRef<UtilTypes.TFullScreenModalRef>(null);
  const [openFullScreenModal, setOpenFullScreenModal] = React.useState(false);
  const [appVersion, setAppVerion] = React.useState<string | null>(null);
  const [selectModalText, setSelectModalText] = React.useState<
    'Currency' | 'Categories' | 'Delete Bills' | null
  >(null);
  const [restorePurchaseStarted, setRestorePurchaseStarted] =
    React.useState(false);

  const setCurrency = useSetRecoilState(UtilState.currencyUtilAtom);

  const sendMail = () => {
    openAnotherApp('mailto:vidowndownload@gmail.com');
  };

  const shareViaWhatsapp = () => {
    // Found Awesome app on play store for storing your finance bills\n
    try {
      openAnotherApp(
        `whatsapp://send?text=Found Awesome app on play store for storing your finance bills\n\n${AppUrl}`,
      );
    } catch (err: any) {}
  };

  const toggleFullScreenModal = (
    typeOfScreen?: 'Currency' | 'Categories' | 'Delete Bills',
  ) => {
    if (typeOfScreen) {
      setOpenFullScreenModal(true);
      setSelectModalText(typeOfScreen);
    } else {
      setSelectModalText(null);
      setOpenFullScreenModal(false);
    }
  };

  const openLicenses = () => {
    openAnotherApp('https://ranuja-apps.github.io/');
  };
  // const onPremiumClick = () => {
  //   navigation.navigate('Pricing', {
  //     version: appVersion || '',
  //   });
  // };

  const onCurrencySelectCallback = async (name: string, symbol: string) => {
    await CurrencyOperations.setCurrency(name, symbol);
    //setOpenFullScreenModal(false);
    setCurrency(symbol);
  };

  const restorePurchase = async () => {
    setRestorePurchaseStarted(true);
    await PaymentManager.restorePurchase();
    setRestorePurchaseStarted(false);
  };

  // const getDataFromRecoil = useRecoilCallback(
  //   ({snapshot}) =>
  //     () => {
  //       const s = snapshot.getLoadable(UtilState.premiumUtilAtom).contents;
  //       setPremiumUser(s);
  //     },
  //   [],
  // );

  React.useEffect(() => {
    // getDataFromRecoil();
    NativeModule.getAppVersion((version: string) => {
      setAppVerion(version);
    });
  }, []);

  const closeModal = () => {
    if (fullScreenRef.current) {
      fullScreenRef.current.close(toggleFullScreenModal);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsSettingsScreenFocused(true);
      if (
        route.params &&
        route.params.openModal &&
        selectModalText !== 'Categories'
      ) {
        toggleFullScreenModal('Categories');
        navigation.setParams({});
      }
      return () => {
        setIsSettingsScreenFocused(false);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params, navigation]),
  );
  return (
    <View style={CommonStyles.flex1}>
      <Header textAlign="left" headerTitle="Settings" />
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        style={CommonStyles.flex1}>
        {/* {!premiumUser && (
          <Pressable onPress={onPremiumClick} style={styles.goPremiumContainer}>
            <Icons.FontAwesome name="diamond" color="#FFF" size={20} />
            <Text style={styles.goPremiumText}>Go Premium</Text>
          </Pressable>
        )} */}
        <SettingSection title="App settings">
          <>
            <PressableIconButton
              onPress={() => toggleFullScreenModal('Currency')}
              iconFamily="Fontisto"
              iconName="dollar"
              text="Currency"
              headerRight={<ChevronRightIcon />}
            />
            <PressableIconButton
              onPress={() => toggleFullScreenModal('Categories')}
              iconName="circle-with-plus"
              text="bill categories"
              headerRight={<ChevronRightIcon />}
            />
            <PressableIconButton
              onPress={() => toggleFullScreenModal('Delete Bills')}
              iconName="delete"
              text="Delete prev bills to free space"
              iconFamily="AntDesign"
              headerRight={<ChevronRightIcon />}
            />
          </>
        </SettingSection>
        <SettingSection title="Other settings">
          <>
            <PressableIconButton
              onPress={restorePurchase}
              iconName="lock"
              text="Restore Purchase"
            />
            <PressableIconButton
              onPress={sendMail}
              iconName="mail"
              text="Suggest a new feature / feedback"
            />
            <PressableIconButton
              onPress={shareViaWhatsapp}
              iconName="share"
              text="Share app with other"
            />
            <PressableIconButton
              onPress={openLicenses}
              iconName="text-document"
              text="Privacy Policy"
            />
            <PressableIconButton
              onPress={openLicenses}
              iconName="text-document"
              text="Terms and Conditions"
            />
          </>
        </SettingSection>
        {appVersion != null && (
          <Text textType="heading" style={styles.appVersionText}>
            v{appVersion}
          </Text>
        )}
      </ScrollView>

      {openFullScreenModal &&
        selectModalText !== null &&
        selectModalText === 'Categories' && (
          <FullScreenModal
            isCurrentScreenFocused={isSettingsScreenFocused}
            ref={fullScreenRef}
            title={selectModalText || ''}
            onModalClose={closeModal}>
            <CategoryList navigation={navigation} />
          </FullScreenModal>
        )}
      {openFullScreenModal &&
        selectModalText !== null &&
        selectModalText !== 'Categories' && (
          <FullScreenModal
            isCurrentScreenFocused={isSettingsScreenFocused}
            ref={fullScreenRef}
            title={selectModalText || ''}
            onModalClose={closeModal}>
            {selectModalText === 'Delete Bills' ? (
              <DeleteBills />
            ) : (
              <CurrencyList
                onItemSelect={onCurrencySelectCallback}
                navigation={navigation}
                data={Data.Currency}
              />
            )}
          </FullScreenModal>
        )}
      <Loader show={restorePurchaseStarted} loadingText="Loading..." />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 20,
  },
  // goPremiumContainer: {
  //   backgroundColor: COLORS.primary,
  //   padding: 15,
  //   borderRadius: 8,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: '#EEE',
  //       shadowOffset: {width: 2, height: 2},
  //       shadowRadius: 5,
  //       shadowOpacity: 1,
  //     },
  //   }),
  //   marginBottom: 20,
  // },
  // goPremiumText: {
  //   fontWeight: 'bold',
  //   color: '#FFF',
  //   fontSize: 18,
  //   marginLeft: 10,
  // },
  appVersionText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 1.1,
  },
});
