import { Amplify } from 'aws-amplify';

const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_NhavJiqwv', // Tu User Pool ID
      userPoolClientId: '4qg334lpbfgjsdg4d4su31fj96', // Tu Client ID
      userPoolRegion: 'us-east-1', // La región de tu User Pool
    },
  },
};

Amplify.configure(awsconfig);

export default awsconfig;