import { Amplify } from 'aws-amplify';

const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_Z0j1v1VS4', // Tu User Pool ID
      userPoolClientId: '55mr34sd21dhpsvaeebj3f3v63', // Tu Client ID
      userPoolRegion: 'us-east-1', // La región de tu User Pool
    },
  },
};

Amplify.configure(awsconfig);

export default awsconfig;