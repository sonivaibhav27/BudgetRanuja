import admob from '@invertase/react-native-google-ads';

export default async () => {
  try {
    await admob().initialize();
    await admob().setRequestConfiguration({
      testDeviceIdentifiers: ['B3EEABB8EE11C2BE770B684D95219ECB', 'EMULATOR'],
    });
  } catch (_) {}
};
