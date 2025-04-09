export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("Running in nodejs environment");
    const s = await import("./startup-script");
    s.default();
  } else if (process.env.NEXT_RUNTIME === "edge") {
    console.log("Running in edge environment");
    return;
  }
}
