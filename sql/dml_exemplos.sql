-- ============================================================
-- Exemplos de manipulação (INSERT / UPDATE / DELETE / SELECT)
-- Execute após schema.sql + seed.sql
-- ============================================================

PRAGMA foreign_keys = ON;

-- ---------- INSERT ----------
INSERT INTO local (nome_ou_referencia, endereco_completo, cidade, estado, cep)
VALUES ('Parque do Carmo', 'Av. Afonso de Sampaio e Sousa, 951', 'São Paulo', 'SP', '08270-001');

INSERT INTO atividade (
  usuario_id_organizador, id_local, titulo, descricao, tipo_ou_categoria,
  data_hora_inicio, data_hora_fim, limite_participantes, status_publicacao, gratuito,
  latitude, longitude
) VALUES (
  3,
  (SELECT id_local FROM local WHERE nome_ou_referencia = 'Parque do Carmo'),
  'Piquenique Comunitário',
  'Encontro gratuito com música e brincadeiras.',
  'comunidade',
  '2026-07-05 12:00:00',
  '2026-07-05 17:00:00',
  150,
  'publicado',
  1,
  -23.5732,
  -46.4621
);

-- ---------- UPDATE ----------
UPDATE atividade
SET status_publicacao = 'cancelado',
    descricao = descricao || ' (cancelado por chuva)'
WHERE titulo = 'Piquenique Comunitário';

UPDATE inscricao
SET situacao = 'confirmada'
WHERE usuario_id_participante = 2
  AND id_atividade = 3
  AND situacao = 'solicitada';

-- ---------- SELECT (listagem) ----------
SELECT
  a.id_atividade,
  a.titulo,
  a.latitude,
  a.longitude,
  l.nome_ou_referencia AS local,
  o.nome_instituicao_ou_grupo AS organizador
FROM atividade a
JOIN local l ON l.id_local = a.id_local
JOIN organizador o ON o.usuario_id = a.usuario_id_organizador
WHERE a.status_publicacao = 'publicado'
ORDER BY a.data_hora_inicio;

-- ---------- SELECT (geolocalização — filtro por bounding box; a API usa Haversine) ----------
-- Ponto de referência: Praça da Sé (-23.5505, -46.6333), ~10 km ≈ 0.09 graus
SELECT
  a.id_atividade,
  a.titulo,
  a.latitude,
  a.longitude,
  l.nome_ou_referencia AS local
FROM atividade a
JOIN local l ON l.id_local = a.id_local
WHERE a.status_publicacao = 'publicado'
  AND a.latitude BETWEEN -23.5505 - 0.09 AND -23.5505 + 0.09
  AND a.longitude BETWEEN -46.6333 - 0.09 AND -46.6333 + 0.09
ORDER BY a.titulo;

-- ---------- SELECT (inscrições de um participante) ----------
SELECT
  u.nome_completo,
  a.titulo,
  i.situacao,
  i.data_hora_solicitacao
FROM inscricao i
JOIN participante p ON p.usuario_id = i.usuario_id_participante
JOIN usuario u ON u.id_usuario = p.usuario_id
JOIN atividade a ON a.id_atividade = i.id_atividade
WHERE u.email = 'bruno.part@gevents.com';

-- ---------- DELETE ----------
DELETE FROM registro_presenca
WHERE id_inscricao = (
  SELECT id_inscricao FROM inscricao WHERE usuario_id_participante = 2 AND id_atividade = 1
);

DELETE FROM inscricao
WHERE usuario_id_participante = 2 AND id_atividade = 1;

DELETE FROM atividade
WHERE titulo = 'Piquenique Comunitário';
