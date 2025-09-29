import { Amplify } from 'aws-amplify';

const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_NhavJiqwv', // Tu User Pool ID
      userPoolClientId: '61r1pom7r8gu5027llse652i8t', // Tu Client ID
      userPoolRegion: 'us-east-1', // La región de tu User Pool
    },
  },
};

Amplify.configure(awsconfig);

export default awsconfig;