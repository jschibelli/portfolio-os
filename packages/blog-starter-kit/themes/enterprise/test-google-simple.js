// Simple test script to verify Google Calendar API configuration
console.log('🔍 Testing Google Calendar API Configuration...\n');

// Check environment variables
const requiredVars = [
  'GOOGLE_CALENDAR_ID',
  'GOOGLE_TYPE',
  'GOOGLE_PROJECT_ID',
  'GOOGLE_PRIVATE_KEY_ID',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_AUTH_URI',
  'GOOGLE_TOKEN_URI',
  'GOOGLE_AUTH_PROVIDER_X509_CERT_URL',
  'GOOGLE_CLIENT_X509_CERT_URL',
  'GOOGLE_UNIVERSE_DOMAIN'
];

console.log('📋 Environment Variables Check:');
let allVarsSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: SET`);
  } else {
    console.log(`  ❌ ${varName}: NOT SET`);
    allVarsSet = false;
  }
});

console.log('\n🔧 Configuration Details:');
console.log(`  Project ID: ${process.env.GOOGLE_PROJECT_ID || 'NOT SET'}`);
console.log(`  Client Email: ${process.env.GOOGLE_CLIENT_EMAIL || 'NOT SET'}`);
console.log(`  Calendar ID: ${process.env.GOOGLE_CALENDAR_ID || 'NOT SET'}`);
console.log(`  Universe Domain: ${process.env.GOOGLE_UNIVERSE_DOMAIN || 'NOT SET'}`);

if (allVarsSet) {
  console.log('\n✅ All required environment variables are set!');
  console.log('\n📅 Next Steps:');
  console.log('  1. Make sure your Google Calendar is shared with:');
  console.log(`     ${process.env.GOOGLE_CLIENT_EMAIL}`);
  console.log('  2. Give the service account "Make changes to events" permission');
  console.log('  3. Restart your development server');
  console.log('  4. Test the meeting scheduling feature');
} else {
  console.log('\n❌ Some environment variables are missing!');
  console.log('   Please check your .env.local file and ensure all variables are set.');
  console.log('\n📝 Required .env.local content:');
  console.log(`
# Google Calendar Configuration
GOOGLE_CALENDAR_ID=jschibelli@gmail.com
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=schibelli-site
GOOGLE_PRIVATE_KEY_ID=0cbd0f3335536e230e7d4c4ee2111465939576b5
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWvO+nCYKSq8KK\\nHamNj3iJzk+67vB4u75BPaPzYDNNt8GKDIRv5hlmWJncyqXtJDjv7zYkb3QbJ0K+\\nmDDoi2CNhC3Q0QV013efVygCFysyrf0cCpi/Y7vcuRNdJj+FIzbkP82uXalUUv+e\\nB/P4DCqWGeocHFzIazQ2P9aDHuZKDTOeQSCHoFGv5Bwq2YF0Hr8PZgEfxR178xq9\\n6QUipiolSDiipICL4sc9OZ67BT9poqDPWNNszgYY8FnGFSucWkAETsysncar5IYm\\n5q70nOvJGoh9Y+2eA7ajIOPvtZxjdJ3aYS4fMMithwueOobSXdjjZzor9PtrOCE6\\nkC9D2lotAgMBAAECggEAImO0n5QS0KloKNVSQ4TwAWXEeAPvB+7NK8aS3JWR8cbV\\nXGXfycnYVH8o+OaNRxqPccFl8tTUi8qwUjSuVHeJuXArJC9tR8Z/9kkvc5JBTUb2\\n64g46SGwQsty8e5/qrM2hbxAFMYUKZh3LlhItndAVLSGvQS/ySr9/BgiIvKOX9pN\\nLWyHXqDWoUXrW/VioaDAO20gaFaaSySXXJ8h8yz2XI9dSznqbEnK+McipGQR0auH\\nRtLif2bDVIZ0rgc3QveaP/ydqKNH1XwTs5VO9tZntF+rlPgQJYuGLhtZJ+sf1diL\\nYStRIhhhU0azA0i/vCre8lebVT4gGYUarZky0vVDUwKBgQD3sOTgXhKsVtrL31sw\\ny1ic15jZrO4sSQPWXhpUcm5SPfvKuMjQQZlAz6+xAQoNrH+vutWE6L/5TEBHLZZg\\nhaQyf57H9sytypSS3RoGrUyNkSeY0qNVMI1m0pjL3gICYC1rk4Lno7Mh0TDvGMyi\\nifOPk4eetpOX0ogvFEZ+ry75vwKBgQDd8Qz1jq/r9Ux433t4pg6j+daletb5vf4r\\njQE6OVYpNjMBP2Gqv5SI10XdyTuee2fGi40dzJnLfyo4RMMbSH9QLYc1QVAOHfa1\\nuHBJMoLhsZFMaXP3jSq0guSg7D3h612CT+BHvZ2YIvxIc1YuzPe6tvNDMI+jlXAx\\nskkLl+xvEwKBgQCLiCw3NOeCDF+vT8D4SOU/XbjujxuQ+QTfYx2kCt6ZF+/bMKN3\\npiymNRk9Nl+qek1n+nFEMTXMQ6dGMakv8Lkh9YDGFwMQuDlgTovVzRR9/5J15ds7\\nJ2HQ1bxbxFIPcozDuFKbGT3VRBoz5x2IRvxdGnfg8etNML2k/+ACh7+H0wKBgHE/\\ni+5M9cWAMJpI5vcEPNo9JOLhkIp1ARn15FdyZF25E0OitNJs2X0N48+s3CgdLjHo\\niYRYH23wIHn/1FK6poQiBykMf64EahwF1f3zsUc61TpZYNxDgzQCymi2w0jhUaCp\\n43aX8a9swrCxcZuF6S60JeL2B4VgPpSNNaqdxf5TAoGAQmfv2yPg9KnenAsDC3Mi\\nikWl719vbuxgI7nXssR2msdKvHqZYFj9/PN+/nv9k+U1GLSehXKqPWggVSFrmdnn\\nk82k/5l7WcZ01tdtnJHXtmYCX5ftw/pvH6yATR0qRz/lig7xwk3wmNfIgSdmrzsw\\nyNzpvUnwjTfpb1lC2ajC6XE=\\n-----END PRIVATE KEY-----\\n"
GOOGLE_CLIENT_EMAIL=bot-541@schibelli-site.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=101447597110474628262
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/bot-541%40schibelli-site.iam.gserviceaccount.com
GOOGLE_UNIVERSE_DOMAIN=googleapis.com

# Feature Flags
NEXT_PUBLIC_FEATURE_SCHEDULING=true
FEATURE_SCHEDULING=true
  `);
}

console.log('\n�� Test complete!');
