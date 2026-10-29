// Publishes every workspace package whose version isn't on the registry yet,
// one at a time, stopping at the first failure. Packages that are already
// published are skipped, so a failed release can be finished by running this
// again (e.g. re-running the workflow).
//
// A stable version lower than one already published (e.g. 2.0.1 from a
// release/2.x branch after 3.0.0) is published under `latest-<major>`, so
// `latest` stays on the newest major. npm 11 refuses to publish it without a
// tag.
//
// Extra arguments are passed to `npm publish`, e.g. `npm run publish -- --dry-run`.
// An explicit `--tag` is used as is.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publishArgs = process.argv.slice(2);
const hasTag = publishArgs.some(
  (arg) => arg === "--tag" || arg.startsWith("--tag="),
);

const npm = (args, options = {}) =>
  spawnSync("npm", args, { cwd: root, encoding: "utf8", ...options });

const getPublishedVersions = (name) => {
  const result = npm(["view", name, "versions", "--json"]);
  if (result.status === 0) {
    // A single version comes back as a string
    return [JSON.parse(result.stdout || "[]")].flat();
  }
  const { error } = JSON.parse(result.stdout || "{}");
  if (error?.code === "E404") {
    return [];
  }
  throw new Error(
    `Couldn't read the versions of ${name} from the registry:\n${result.stdout}${result.stderr}`,
  );
};

// Stable x.y.z versions only; pre-releases are published under `next`.
const parseStable = (version) =>
  /^\d+\.\d+\.\d+$/.test(version) ? version.split(".").map(Number) : null;

const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

const getTagArgs = (version, publishedVersions) => {
  const current = parseStable(version);
  if (hasTag || !current) {
    return [];
  }
  const isLower = publishedVersions
    .map(parseStable)
    .some((published) => published && compare(published, current) > 0);
  return isLower ? [`--tag=latest-${current[0]}`] : [];
};

const packagesDir = path.join(root, "packages");
const packages = fs
  .readdirSync(packagesDir)
  .map((dir) => path.join(packagesDir, dir, "package.json"))
  .filter((manifest) => fs.existsSync(manifest))
  .map((manifest) => JSON.parse(fs.readFileSync(manifest, "utf8")))
  .filter((pkg) => !pkg.private);

for (const { name, version } of packages) {
  const publishedVersions = getPublishedVersions(name);
  if (publishedVersions.includes(version)) {
    console.info(`Skipping ${name}@${version}: already published.`);
    continue;
  }
  const tagArgs = getTagArgs(version, publishedVersions);
  console.info(
    `Publishing ${name}@${version}${tagArgs.length ? ` with ${tagArgs[0]}` : ""}...`,
  );
  const result = npm(
    ["publish", "--workspace", name, ...tagArgs, ...publishArgs],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error(
      `Failed to publish ${name}@${version}. Fix the cause and run this again; published packages will be skipped.`,
    );
    process.exit(result.status ?? 1);
  }
}
