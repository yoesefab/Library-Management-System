#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Exécuter ce script avec sudo: sudo ./scripts/install-docker-ubuntu.sh" >&2
  exit 1
fi

if [[ ! -r /etc/os-release ]]; then
  echo "Impossible de détecter la distribution." >&2
  exit 1
fi

source /etc/os-release
if [[ "${ID:-}" != "ubuntu" ]]; then
  echo "Ce script est limité à Ubuntu; distribution détectée: ${ID:-inconnue}." >&2
  exit 1
fi

target_user="${SUDO_USER:-}"
if [[ -z "${target_user}" || "${target_user}" == "root" ]]; then
  echo "SUDO_USER est absent. Lancer le script depuis le compte utilisateur avec sudo." >&2
  exit 1
fi

conflicting_packages=(
  docker.io docker-compose docker-compose-v2 docker-doc docker-buildx
  podman-docker containerd runc
)
installed_conflicts=()
for package_name in "${conflicting_packages[@]}"; do
  if dpkg-query --show --showformat='${db:Status-Status}' "${package_name}" 2>/dev/null | grep -q '^installed$'; then
    installed_conflicts+=("${package_name}")
  fi
done

if (( ${#installed_conflicts[@]} > 0 )); then
  echo "Paquets potentiellement conflictuels détectés: ${installed_conflicts[*]}" >&2
  echo "Aucune suppression automatique n'a été effectuée. Vérifier avant de relancer." >&2
  exit 2
fi

apt-get update
apt-get install --yes ca-certificates curl

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

architecture="$(dpkg --print-architecture)"
codename="${UBUNTU_CODENAME:-${VERSION_CODENAME}}"
cat >/etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: ${codename}
Components: stable
Architectures: ${architecture}
Signed-By: /etc/apt/keyrings/docker.asc
EOF

apt-get update
apt-get install --yes docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker

getent group docker >/dev/null || groupadd docker
usermod --append --groups docker "${target_user}"

docker --version
docker compose version
docker run --rm hello-world

echo
echo "Docker est installé. Fermer puis rouvrir la session pour activer le groupe docker."
echo "Sans reconnexion, utiliser temporairement: sg docker -c 'docker info'"

