const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const http = require("http");

const PORT = process.env.PORT || 3000;

async function startApp() {
  console.log("Application starting...");

  try {
    const ssm = new SSMClient({ region: process.env.AWS_REGION });

    const data = await ssm.send(
      new GetParameterCommand({
        Name: "/my-app/prod/DB_PASSWORD",
        WithDecryption: true,
      })
    );

    process.env.DB_PASSWORD = data.Parameter.Value;
    console.log("Success: Secure variables loaded from AWS SSM!");
  } catch (error) {
    console.error("Error loading secure configs:", error.message);
  }

  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World! App is running securely on EKS.\n");
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startApp();
