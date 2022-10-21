import React from 'react';
import CodePush from 'react-native-code-push';

let codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_START};

export default (RootComponent: () => JSX.Element) => {
  class WithCodePush extends React.Component {
    componentDidMount() {
      CodePush.sync({
        installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        updateDialog: {
          title: 'New Update Available',
        },
        mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
      });
    }
    render() {
      return <RootComponent />;
    }
  }
  return CodePush(codePushOptions)(WithCodePush);
};
