import React from 'react';
import CodePush from 'react-native-code-push';

let codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_START};

export default (RootComponent: any) => {
  class WithCodePush extends React.Component {
    componentDidMount() {
      CodePush.sync({
        installMode: CodePush.InstallMode.IMMEDIATE,
        updateDialog: {
          title: 'New Update Available',
        },
      });
    }
    render() {
      return <RootComponent />;
    }
  }
  return CodePush(codePushOptions)(WithCodePush);
};
