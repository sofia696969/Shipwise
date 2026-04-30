type ObservabilityContext = Record<string, unknown>;

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return { message: String(error) };
}

async function postToSentry(error: unknown, context: ObservabilityContext) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  try {
    const url = new URL(dsn);
    const [projectId] = url.pathname.replace(/^\/+/, "").split("/");
    const publicKey = url.username;
    const host = `${url.protocol}//${url.host}`;
    const endpoint = `${host}/api/${projectId}/store/?sentry_key=${publicKey}&sentry_version=7`;

    const payload = {
      level: "error",
      platform: "node",
      timestamp: Date.now() / 1000,
      environment: process.env.NODE_ENV ?? "development",
      message: normalizeError(error).message,
      extra: {
        error: normalizeError(error),
        ...context,
      },
    };

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (postError) {
    console.error("Failed to post to Sentry:", postError);
  }
}

export async function reportError(
  error: unknown,
  context: ObservabilityContext = {},
) {
  console.error("[observability:error]", normalizeError(error), context);
  await postToSentry(error, context);
}

export function reportInfo(message: string, context: ObservabilityContext = {}) {
  console.info("[observability:info]", message, context);
}
