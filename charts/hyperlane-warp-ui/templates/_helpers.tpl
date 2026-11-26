{{/* Release-scoped name, within the 63 characters Kubernetes allows. */}}
{{- define "warpUi.fullname" -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "warpUi.selectorLabels" -}}
app.kubernetes.io/name: hyperlane-warp-ui
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "warpUi.labels" -}}
{{ include "warpUi.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
The image: a digest or a tag of the values, or else the chart's appVersion,
the tag of the image built from the chart's commit, which CI sets when it
publishes the chart. A chart packaged without one needs the values'.
*/}}
{{- define "warpUi.image" -}}
{{- $i := .Values.image }}
{{- if not $i.repository }}{{ fail "image.repository is required" }}{{ end }}
{{- if $i.digest }}{{ printf "%s@%s" $i.repository $i.digest }}
{{- else if $i.tag }}{{ printf "%s:%s" $i.repository $i.tag }}
{{- else if .Chart.AppVersion }}{{ printf "%s:%s" $i.repository .Chart.AppVersion }}
{{- else }}{{ fail "image.digest or image.tag is required: this chart was packaged without an appVersion" }}
{{- end }}
{{- end }}

{{/*
The app's deploy-time settings, the ones the image's /config.js gives it
(docker/config.js): a name outside them would reach no one, so it fails the
render instead.
*/}}
{{- define "warpUi.deployTimeSettingNames" -}}
NEXT_PUBLIC_ALEO_NETWORK NEXT_PUBLIC_CHAIN_WALLET_WHITELISTS NEXT_PUBLIC_EXPLORER_API_URL NEXT_PUBLIC_FEE_QUOTING_URL NEXT_PUBLIC_GITHUB_PROXY NEXT_PUBLIC_INTERCOM_APP_ID NEXT_PUBLIC_REFINER_PROJECT_ID NEXT_PUBLIC_REFINER_TRANSFER_FORM_ID NEXT_PUBLIC_REGISTRY_BRANCH NEXT_PUBLIC_REGISTRY_URL NEXT_PUBLIC_RELAY_API_URL NEXT_PUBLIC_RPC_OVERRIDES NEXT_PUBLIC_SENTRY_DSN NEXT_PUBLIC_TRANSFER_BLACKLIST NEXT_PUBLIC_WALLET_CONNECT_ID
{{- end }}

{{- define "warpUi.deployTimeSettingsEnv" -}}
{{- $known := splitList " " (include "warpUi.deployTimeSettingNames" .) }}
{{- range $name, $value := .Values.deployTimeSettings }}
{{- if not (has $name $known) }}{{ fail (printf "deployTimeSettings.%s is not a deploy-time setting of the app; it has %s" $name (join ", " $known)) }}{{ end }}
- name: {{ $name }}
  value: {{ $value | toString | quote }}
{{- end }}
{{- end }}

{{/* The container's environment: the settings, then extraEnv. */}}
{{- define "warpUi.env" -}}
{{- include "warpUi.deployTimeSettingsEnv" . }}
{{- with .Values.embedAllowedOrigins }}
- name: NEXT_PUBLIC_EMBED_ALLOWED_ORIGINS
  value: {{ . | quote }}
{{- end }}
{{- with .Values.extraEnv }}
{{ toYaml . }}
{{- end }}
{{- end }}

{{- define "warpUi.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}{{ default (include "warpUi.fullname" .) .Values.serviceAccount.name }}
{{- else }}{{ default "default" .Values.serviceAccount.name }}{{ end }}
{{- end }}
