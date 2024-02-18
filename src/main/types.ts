export type MadaraConfig = {
  name?: string;
  RPCCors: string;
  RPCExternal: string;
  RPCTsukuyomi: string;
  RPCMethods: string;
  port: string;
  RPCPort: string;
  telemetryURL: string;
  bootnodes: string;
  testnet: string;
  release: string;
  developmentMode: string;
};

export type AppAppendLogs = {
  appId: string;
  logs: string;
  containerName: string;
};
