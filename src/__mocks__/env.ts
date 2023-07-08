const mockEnv = {
  env: {
    server: {
      DATABASE_URL: "mock_database_url",
      NODE_ENV: "test",
      NEXTAUTH_SECRET: "mock_secret",
      NEXTAUTH_URL: "mock_url",
      DISCORD_CLIENT_ID: "mock_id",
      DISCORD_CLIENT_SECRET: "mock_secret",
      GITHUB_ID: "mock_id",
      GITHUB_SECRET: "mock_secret",
    },
    client: {},
    runtimeEnv: {
      DATABASE_URL: "mock_database_url",
      NODE_ENV: "test",
      NEXTAUTH_SECRET: "mock_secret",
      NEXTAUTH_URL: "mock_url",
      DISCORD_CLIENT_ID: "mock_id",
      DISCORD_CLIENT_SECRET: "mock_secret",
      GITHUB_ID: "mock_id",
      GITHUB_SECRET: "mock_secret",
    },
    skipValidation: true,
  },
};

export default mockEnv;
