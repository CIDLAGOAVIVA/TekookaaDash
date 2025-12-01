#!/bin/bash

# Script para inspecionar o schema completo do banco agrodata

DB_URL="postgresql://dashboard:dashboard_tekokaa_2024@localhost:5432/agrodata"

echo "=== SCHEMA DO BANCO AGRODATA ==="
echo

# Listar todas as tabelas
echo "### TABELAS ###"
psql "$DB_URL" -c "\dt"
echo

# Para cada tabela, mostrar a estrutura
for table in tab_propriedade tab_cultura tab_estacao tab_pos_estacao tab_sensor tab_grandeza tab_medida_individual tab_medicao tab_midia tab_alerta tab_criterio_alerta; do
  echo "### TABELA: $table ###"
  psql "$DB_URL" -c "\d $table"
  echo
done

# Mostrar relacionamentos (chaves estrangeiras)
echo "### CHAVES ESTRANGEIRAS ###"
psql "$DB_URL" -c "
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
"
echo

# Contar registros em cada tabela
echo "### CONTAGEM DE REGISTROS ###"
for table in tab_propriedade tab_cultura tab_estacao tab_pos_estacao tab_sensor tab_grandeza tab_medida_individual tab_medicao tab_midia tab_alerta tab_criterio_alerta; do
  count=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM $table")
  echo "$table: $count"
done
