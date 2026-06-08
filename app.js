const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

async function startApp() {
  console.log("Hello World! Application starting...");

  try {
    const ssm = new SSMClient({ region: process.env.AWS_REGION });
    
    // SSM fetch
    const data = await ssm.send(new GetParameterCommand({
      Name: "/my-app/prod/DB_PASSWORD",
      WithDecryption: true
    }));

    // Variable set in memory
    process.env.DB_PASSWORD = data.Parameter.Value;
    console.log("Success: Secure variables loaded from AWS SSM!");
    
    // s3 code or server run
    console.log("Application is now running smoothly.");

  } catch (error) {
    console.error("Error loading secure configs:", error.message);
  }
}

startApp();
