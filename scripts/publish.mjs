// Publishes every workspace package whose version isn't on the registry yet,
// one at a time, stopping at the first failure. Packages that are already
// published are skipped, so a failed release can be finished by running this
// again (e.g. re-running the workflow).
//
// Extra arguments are passed to `npm publish`, e.g. `npm run publish -- --dry-run`.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publishArgs = process.argv.slice(2);

const npm = (args, options = {}) =>
  spawnSync("npm", args, { cwd: root, encoding: "utf8", ...options });

const isPublished = (name, version) => {
  const result = npm(["view", `${name}@${version}`, "version", "--json"]);
  if (result.status === 0) {
    return true;
  }
  const { error } = JSON.parse(result.stdout || "{}");
  if (error?.code === "E404") {
    return false;
  }
  throw new Error(
    `Couldn't check ${name}@${version} on the registry:\n${result.stdout}${result.stderr}`,
  );
};

const packagesDir = path.join(root, "packages");
const packages = fs
  .readdirSync(packagesDir)
  .map((dir) => path.join(packagesDir, dir, "package.json"))
  .filter((manifest) => fs.existsSync(manifest))
  .map((manifest) => JSON.parse(fs.readFileSync(manifest, "utf8")))
  .filter((pkg) => !pkg.private);

for (const { name, version } of packages) {
  if (isPublished(name, version)) {
    console.info(`Skipping ${name}@${version}: already published.`);
    continue;
  }
  console.info(`Publishing ${name}@${version}...`);
  const result = npm(["publish", "--workspace", name, ...publishArgs], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error(
      `Failed to publish ${name}@${version}. Fix the cause and run this again; published packages will be skipped.`,
    );
    process.exit(result.status ?? 1);
  }
}
