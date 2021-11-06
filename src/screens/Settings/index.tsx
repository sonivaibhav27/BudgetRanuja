import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  Linking,
  View,
  Modal,
} from 'react-native';
import {FullScreenModal} from '../../common';
import {CurrencyCategories} from '../../data';
import {MainStackScreenType} from '../../navigations/MainStack/types';
import {ColorsTheme} from '../../theme&styles/theme';
import {Icons, Logger, Toast} from '../../utils';
import {IconButton, SettingSection} from './components';

const openAnotherApp = (
  appName: 'mail' | 'whatsapp' | 'browser',
  url: string,
) => {
  try {
    Linking.openURL(url);
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
  const sendMail = () => {
    openAnotherApp('mail', 'mailto:vidowndownload@gmail.com');
  };

  // React.useEffect(() => {
  //   navigation.setOptions({
  //     headerShown: openFullScreenModal ? false : true,
  //   });
  // }, [openFullScreenModal, navigation]);

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

  const toggleFullScreenModal = () => {
    setOpenFullScreenModal(prev => !prev);
  };

  const openLicenses = () => {
    openAnotherApp('browser', 'https://ranuja-apps.github.io/');
  };

  return (
    <View style={styles.flex}>
      <ScrollView style={styles.container}>
        <Pressable style={styles.goPremiumContainer}>
          <Icons.AntDesign name="diamond" color="#FFF" size={20} />
          <Text style={styles.goPremiumText}>Go Premium</Text>
        </Pressable>
        <SettingSection title="App settings">
          <>
            <IconButton
              onPress={toggleFullScreenModal}
              iconFamily="Fontisco"
              iconName="dollar"
              text="Currency"
              showChevronRightIcon
            />
            <IconButton
              iconName="circle-with-plus"
              text="bill categories"
              showChevronRightIcon
            />
            <IconButton
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
        {/* <SettingSection title="Other settings" /> */}
      </ScrollView>

      {openFullScreenModal && (
        <FullScreenModal
          data={CurrencyCategories}
          title="Currency"
          closeModal={toggleFullScreenModal}
          navigation={navigation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    padding: 20,
    // marginBottom: 10,
  },
  goPremiumContainer: {
    backgroundColor: ColorsTheme.primary,
    padding: 20,
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
});
