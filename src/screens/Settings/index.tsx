import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  Linking,
  View,
  NativeModules,
} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {FullScreenModal, PressableButton} from '../../common';
import {CurrencyCategories} from '../../data';
import {CurrencyOperations} from '../../database';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {UtilsAtom} from '../../State';
import {ColorsTheme} from '../../theme&styles/theme';
import {Icons, Logger, Toast} from '../../utils';
import {
  IconButton,
  SettingSection,
  DeleteBills,
  List,
  CategoryList,
} from './components';

const {CustomNativeModule} = NativeModules;
const openAnotherApp = async (
  appName: 'mail' | 'whatsapp' | 'browser',
  url: string,
) => {
  try {
    // const canOpenUrl = await Linking.canOpenURL(url);
    // if (canOpenUrl) {
    await Linking.openURL(url);
    // } else {
    // Toast(
    //   appName.charAt(0).toUpperCase() + appName.slice(1) + ' App not found.',
    // );
    // }
  } catch (err) {
    Toast(err.code);
    Logger.consoleLog(err.description, 'log');
  }
};

interface Props {
  navigation: StackNavigationProp<MainStackScreenType, 'Settings'>;
}

export default ({navigation}: Props) => {
  const [openFullScreenModal, setOpenFullScreenModal] = React.useState(false);
  const [appVersion, setAppVerion] = React.useState<string | null>(null);
  const [selectModalText, setSelectModalText] = React.useState<
    'Currency' | 'Categories' | 'Delete Bills' | null
  >(null);

  const setCurrency = useSetRecoilState(UtilsAtom.Currency);

  const sendMail = () => {
    openAnotherApp('mail', 'mailto:vidowndownload@gmail.com');
  };

  React.useEffect(() => {
    CustomNativeModule.getAppVersion((version: string | null) => {
      setAppVerion(version);
    });
  }, []);

  React.useEffect(() => {
    const event = navigation.addListener('focus', () => {
      setOpenFullScreenModal(false);
    });
    return () => event();
  }, [navigation]);

  const shareViaWhatsapp = () => {
    try {
      openAnotherApp(
        'whatsapp',
        'whatsapp://send?text=Found Awesome app on play store for storing your finance bills&url=https://play.google.com/store/search?q=pub%3ARanuja&c=apps',
      );
    } catch (err) {
      Toast(err.code);
    }
  };

  const toggleFullScreenModal = (
    typeOfScreen: 'Currency' | 'Categories' | 'Delete Bills',
  ) => {
    setSelectModalText(typeOfScreen);
    setOpenFullScreenModal(prev => !prev);
  };

  const openLicenses = () => {
    openAnotherApp('browser', 'https://ranuja-apps.github.io/');
  };
  const onPremiumClick = () => {
    navigation.navigate('Pricing', {
      version: appVersion || '',
    });
  };

  const onCurrencySelectCallback = async (name: string, symbol: string) => {
    await CurrencyOperations.setCurrency(name, symbol);
    // setOpenFullScreenModal(false);
    setCurrency(symbol);
  };

  return (
    <View style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.container}>
        <PressableButton
          onPress={onPremiumClick}
          style={styles.goPremiumContainer}>
          <Icons.FontAwesome name="diamond" color="#FFF" size={20} />
          <Text style={styles.goPremiumText}>Go Premium</Text>
        </PressableButton>

        <SettingSection title="App settings">
          <>
            <IconButton
              onPress={() => toggleFullScreenModal('Currency')}
              iconFamily="Fontisco"
              iconName="dollar"
              text="Currency"
              showChevronRightIcon
            />
            <IconButton
              onPress={() => toggleFullScreenModal('Categories')}
              iconName="circle-with-plus"
              text="bill categories"
              showChevronRightIcon
            />
            <IconButton
              onPress={() => toggleFullScreenModal('Delete Bills')}
              iconName="delete"
              text="Delete prev bills to free space"
              showChevronRightIcon
              iconFamily="AntDesign"
            />
          </>
        </SettingSection>
        <SettingSection title="Other settings">
          <>
            <IconButton
              onPress={sendMail}
              iconName="mail"
              text="Suggest a new feature / feedback"
            />
            <IconButton
              onPress={shareViaWhatsapp}
              iconName="share"
              text="share with your friends"
            />
            <IconButton
              onPress={openLicenses}
              iconName="text-document"
              text="Privacy Policy"
            />
            <IconButton
              onPress={openLicenses}
              iconName="text-document"
              text="Terms of Condition"
            />
          </>
        </SettingSection>
        {appVersion != null && (
          <Text style={styles.appVersionText}>version v{appVersion}</Text>
        )}
      </ScrollView>

      {openFullScreenModal && (
        <FullScreenModal
          title={selectModalText || ''}
          closeModal={toggleFullScreenModal}
          navigation={navigation}>
          {selectModalText && selectModalText === 'Delete Bills' ? (
            <DeleteBills />
          ) : selectModalText === 'Categories' ? (
            <CategoryList navigation={navigation} />
          ) : (
            <List
              closeModal={() => setOpenFullScreenModal(false)}
              onItemSelect={onCurrencySelectCallback}
              navigation={navigation}
              data={CurrencyCategories}
            />
          )}
        </FullScreenModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: 20,
  },
  goPremiumContainer: {
    backgroundColor: ColorsTheme.primary,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#EEE',
        shadowOffset: {width: 2, height: 2},
        shadowRadius: 5,
        shadowOpacity: 1,
      },
    }),
    marginBottom: 20,
  },
  goPremiumText: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 18,
    marginLeft: 10,
  },
  appVersionText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 1.1,
  },
});
