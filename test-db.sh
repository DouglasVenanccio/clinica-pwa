#!/bin/bash
docker exec clinica-db psql -U clinica -d clinica_pwa -c "SELECT id, email, senha, role FROM usuarios WHERE email = 'admin@clinica.com';"
