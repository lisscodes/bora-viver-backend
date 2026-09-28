-- Seed inicial alinhado aos eventos do mock do frontend Android

INSERT INTO usuario (id_usuario, nome_completo, email, telefone, ativo, documentacao_identidade_validada, biometria_facial_validada)
VALUES
  (1, 'Ana Organizadora', 'ana.orga@gevents.com', '11999990001', TRUE, TRUE, TRUE),
  (2, 'Bruno Participante', 'bruno.part@gevents.com', '11999990002', TRUE, TRUE, FALSE),
  (3, 'Carla Dual', 'carla.dual@gevents.com', '11999990003', TRUE, TRUE, TRUE)
ON CONFLICT (id_usuario) DO NOTHING;

INSERT INTO organizador (usuario_id, nome_instituicao_ou_grupo, descricao_grupo, link_rede_social)
VALUES
  (1, 'Coletivo Cultura SP', 'Eventos culturais gratuitos na cidade', 'https://instagram.com/coletivosp'),
  (3, 'Esporte Comunidade', 'Corridas e atividades ao ar livre', 'https://instagram.com/esportecom')
ON CONFLICT (usuario_id) DO NOTHING;

INSERT INTO participante (usuario_id, apelido)
VALUES
  (2, 'Bruno'),
  (3, 'Carla')
ON CONFLICT (usuario_id) DO NOTHING;

INSERT INTO contato_emergencia (usuario_id_participante, nome_completo_contato, telefone_contato, parentesco_ou_observacao)
VALUES
  (2, 'Maria Participante', '11988880002', 'Mãe'),
  (3, 'Pedro Dual', '11988880003', 'Irmão')
ON CONFLICT (usuario_id_participante) DO NOTHING;

INSERT INTO local (id_local, nome_ou_referencia, endereco_completo, cidade, estado, cep)
VALUES
  (1, 'Praça da Sé', 'Praça da Sé - Sé', 'São Paulo', 'SP', '01001-000'),
  (2, 'Parque Ibirapuera', 'Av. Pedro Álvares Cabral', 'São Paulo', 'SP', '04094-050'),
  (3, 'Parque Villa-Lobos', 'Av. Prof. Fonseca Rodrigues, 2001', 'São Paulo', 'SP', '05461-010'),
  (4, 'Centro Cultural São Paulo', 'Rua Vergueiro, 1000', 'São Paulo', 'SP', '01504-000')
ON CONFLICT (id_local) DO NOTHING;

INSERT INTO atividade (
  id_atividade, usuario_id_organizador, id_local, titulo, descricao, tipo_ou_categoria,
  data_hora_inicio, data_hora_fim, limite_participantes, status_publicacao, gratuito,
  latitude, longitude, image_url
) VALUES
  (1, 1, 1, 'Festival de Música na Praça',
   'Shows gratuitos ao ar livre com artistas locais.', 'música',
   '2026-06-15 18:00:00', '2026-06-15 23:00:00', 500, 'publicado', TRUE,
   -23.5505, -46.6333, NULL),
  (2, 1, 2, 'Feira de Artesanato',
   'Exposição de artesanato e gastronomia regional.', 'cultura',
   '2026-06-18 10:00:00', '2026-06-18 18:00:00', 300, 'publicado', TRUE,
   -23.5874, -46.6576, NULL),
  (3, 3, 3, 'Corrida Solidária 5K',
   'Evento esportivo aberto à comunidade.', 'esporte',
   '2026-06-22 07:00:00', '2026-06-22 11:00:00', 1000, 'publicado', TRUE,
   -23.5458, -46.7292, NULL),
  (4, 1, 4, 'Mostra de Cinema ao Ar Livre',
   'Sessões gratuitas de cinema clássico e independente.', 'cultura',
   '2026-06-25 19:30:00', '2026-06-25 22:30:00', 200, 'publicado', TRUE,
   -23.5701, -46.6458, NULL)
ON CONFLICT (id_atividade) DO NOTHING;

INSERT INTO inscricao (usuario_id_participante, id_atividade, situacao)
VALUES
  (2, 1, 'confirmada'),
  (2, 3, 'solicitada'),
  (3, 2, 'confirmada')
ON CONFLICT (usuario_id_participante, id_atividade) DO NOTHING;

INSERT INTO registro_presenca (id_inscricao, data_hora_checkin, data_hora_checkout, observacao_opcional)
SELECT 1, '2026-06-15 18:10:00', '2026-06-15 22:40:00', 'Check-in na entrada principal'
WHERE NOT EXISTS (
  SELECT 1 FROM registro_presenca WHERE id_inscricao = 1
);

-- Ajusta sequences após inserts com IDs explícitos
SELECT setval(pg_get_serial_sequence('usuario', 'id_usuario'), COALESCE((SELECT MAX(id_usuario) FROM usuario), 1));
SELECT setval(pg_get_serial_sequence('local', 'id_local'), COALESCE((SELECT MAX(id_local) FROM local), 1));
SELECT setval(pg_get_serial_sequence('atividade', 'id_atividade'), COALESCE((SELECT MAX(id_atividade) FROM atividade), 1));
SELECT setval(pg_get_serial_sequence('contato_emergencia', 'id_contato'), COALESCE((SELECT MAX(id_contato) FROM contato_emergencia), 1));
SELECT setval(pg_get_serial_sequence('inscricao', 'id_inscricao'), COALESCE((SELECT MAX(id_inscricao) FROM inscricao), 1));
SELECT setval(pg_get_serial_sequence('registro_presenca', 'id_registro_presenca'), COALESCE((SELECT MAX(id_registro_presenca) FROM registro_presenca), 1));
