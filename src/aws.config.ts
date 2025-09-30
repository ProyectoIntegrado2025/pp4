import { Amplify } from 'aws-amplify';

const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_YapmDAj4Q', // Tu User Pool ID
      userPoolClientId: '1ebju7v52tu2b74scfa8nck8pr', // Tu Client ID
      userPoolRegion: 'us-east-1', // La región de tu User Pool
    },
  },
};

Amplify.configure(awsconfig);

export default awsconfig;