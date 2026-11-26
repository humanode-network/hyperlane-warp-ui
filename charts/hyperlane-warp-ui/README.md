# hyperlane-warp-ui

Runs the web app for transfers over Hyperlane Warp Routes: the image built from this repository, the app's static export served by Caddy on port 3000, with its security headers and its deploy-time settings.

## What the chart does

- **The image of its own commit.** The chart and the image are built from the same commit, and CI publishes the chart with the image's tag, `sha-<commit>`, as its appVersion, which is the default tag: pinning the chart's version pins the app's. `image.digest` or `image.tag` runs another image.
- **The settings are given at deploy time.** `deployTimeSettings` holds the app's settings by name (`NEXT_PUBLIC_WALLET_CONNECT_ID`, `NEXT_PUBLIC_REGISTRY_URL`, …); the image's `/config.js` gives them to the app from the container's environment, so one image serves any deployment. A name the app does not have fails the render. The browser reads every setting, so none is a secret.
- **Who may frame `/embed`** is `embedAllowedOrigins`, any site by default, as the image has it; every other page may be framed by none.
- **A Service, and an Ingress if asked for** (`ingress`), of the class, hosts, TLS and annotations the cluster expects.
- **Unprivileged.** The pods run as `nobody` with a read-only root filesystem, no capabilities and no Kubernetes API token; Caddy's own state goes to two `emptyDir` volumes.
- **Extension points** for what the chart leaves to its consumer: `extraEnv`, `extraEnvFrom`, `extraVolumes`, `extraVolumeMounts`, `initContainers`, `extraContainers` and the ServiceAccount.

## Publishing

Every push runs `.github/workflows/helm.yml`, which packages the chart and pushes it to `oci://ghcr.io/humanode-network/hyperlane-warp-ui/charts/hyperlane-warp-ui`, versioned `0.0.0-sha-<short sha>` with the appVersion `sha-<short sha>`, the tag `.github/workflows/docker.yml` gives the image of the same commit.

## Checks

Before publishing, the workflow lints and renders the chart with `ci/test-values.yaml`, checks that the chart packaged as it is published runs the image of its own commit, that its labels stay valid with the version Flux gives it, and that its list of deploy-time settings is the one `docker/config.js` renders.
