# The app's image: the static export (`pnpm build`, out/) served by Caddy. The
# export is built before the image, as CI does; docker/Caddyfile says what the
# server reads from its environment.

ARG CADDY_VERSION=2.10.2

FROM caddy:${CADDY_VERSION}-alpine AS caddy
# The official binary carries the file capability to bind ports below 1024,
# and a binary with one does not run in a container that drops every
# capability and allows no new privileges, as the chart's does. Port 3000
# needs none.
RUN setcap -r /usr/bin/caddy
# Caddy's own state, which it writes even with nothing to keep: a directory
# its user owns.
RUN mkdir -p /rootfs/data /rootfs/config

FROM scratch

COPY --from=caddy /usr/bin/caddy /usr/bin/caddy
COPY --from=caddy --chown=65534:65534 /rootfs /
ENV XDG_DATA_HOME=/data XDG_CONFIG_HOME=/config
RUN ["/usr/bin/caddy", "version"]

COPY out /srv
COPY docker/config.js /srv/config.js
COPY docker/Caddyfile /etc/caddy/Caddyfile

USER 65534:65534
EXPOSE 3000
CMD ["/usr/bin/caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
