-- ============================================================
-- Bora Viver — Modelo físico (PostgreSQL)
-- ============================================================

-- ----------------------------------------------------------
-- USUARIO (entidade principal)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario                        BIGSERIAL PRIMARY KEY,
    nome_completo                     VARCHAR(200)  NOT NULL,
    email                             VARCHAR(254)  NOT NULL UNIQUE,
    telefone                          VARCHAR(40),
    data_cadastro                     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ativo                             BOOLEAN       NOT NULL DEFAULT TRUE,
    documentacao_identidade_validada  BOOLEAN       NOT NULL DEFAULT FALSE,
    biometria_facial_validada         BOOLEAN       NOT NULL DEFAULT FALSE
);

-- ----------------------------------------------------------
-- ORGANIZADOR (subtipo / papel)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizador (
    usuario_id                 BIGINT PRIMARY KEY,
    nome_instituicao_ou_grupo  VARCHAR(180) NOT NULL,
    descricao_grupo            TEXT,
    link_rede_social           VARCHAR(500),
    CONSTRAINT fk_organizador_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario (id_usuario)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- PARTICIPANTE (subtipo / papel)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS participante (
    usuario_id  BIGINT PRIMARY KEY,
    apelido     VARCHAR(100),
    CONSTRAINT fk_participante_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario (id_usuario)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- CONTATO_EMERGENCIA (obrigatório para participante)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS contato_emergencia (
    id_contato                  BIGSERIAL PRIMARY KEY,
    usuario_id_participante     BIGINT       NOT NULL UNIQUE,
    nome_completo_contato       VARCHAR(200) NOT NULL,
    telefone_contato            VARCHAR(40)  NOT NULL,
    parentesco_ou_observacao    TEXT,
    CONSTRAINT fk_contato_participante
        FOREIGN KEY (usuario_id_participante) REFERENCES participante (usuario_id)
        ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- LOCAL (espaço físico)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS local (
    id_local           BIGSERIAL PRIMARY KEY,
    nome_ou_referencia VARCHAR(140) NOT NULL,
    endereco_completo  TEXT,
    cidade             VARCHAR(100),
    estado             VARCHAR(60),
    cep                VARCHAR(12)
);

-- ----------------------------------------------------------
-- ATIVIDADE (evento cadastrado)
-- latitude / longitude: busca por geolocalização
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS atividade (
    id_atividade             BIGSERIAL PRIMARY KEY,
    usuario_id_organizador   BIGINT        NOT NULL,
    id_local                 BIGINT        NOT NULL,
    titulo                   VARCHAR(200)  NOT NULL,
    descricao                TEXT,
    tipo_ou_categoria        VARCHAR(120),
    data_hora_inicio         TIMESTAMP     NOT NULL,
    data_hora_fim            TIMESTAMP,
    limite_participantes     INTEGER,
    status_publicacao        VARCHAR(48)   NOT NULL DEFAULT 'publicado',
    gratuito                 BOOLEAN       NOT NULL DEFAULT TRUE,
    latitude                 DOUBLE PRECISION NOT NULL,
    longitude                DOUBLE PRECISION NOT NULL,
    image_url                TEXT,
    CONSTRAINT fk_atividade_organizador
        FOREIGN KEY (usuario_id_organizador) REFERENCES organizador (usuario_id),
    CONSTRAINT fk_atividade_local
        FOREIGN KEY (id_local) REFERENCES local (id_local),
    CONSTRAINT ck_atividade_periodo
        CHECK (data_hora_fim IS NULL OR data_hora_fim >= data_hora_inicio),
    CONSTRAINT ck_atividade_lat
        CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT ck_atividade_lng
        CHECK (longitude BETWEEN -180 AND 180)
);

CREATE INDEX IF NOT EXISTS idx_atividade_geo
    ON atividade (latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_atividade_inicio
    ON atividade (data_hora_inicio);

-- ----------------------------------------------------------
-- INSCRICAO (interesse / participação)
-- situacao: solicitada | confirmada | lista_espera | cancelada
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS inscricao (
    id_inscricao              BIGSERIAL PRIMARY KEY,
    usuario_id_participante   BIGINT      NOT NULL,
    id_atividade              BIGINT      NOT NULL,
    data_hora_solicitacao     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao                  VARCHAR(32) NOT NULL DEFAULT 'solicitada',
    CONSTRAINT fk_inscricao_participante
        FOREIGN KEY (usuario_id_participante) REFERENCES participante (usuario_id),
    CONSTRAINT fk_inscricao_atividade
        FOREIGN KEY (id_atividade) REFERENCES atividade (id_atividade)
        ON DELETE CASCADE,
    CONSTRAINT uq_inscricao_participante_atividade
        UNIQUE (usuario_id_participante, id_atividade),
    CONSTRAINT ck_inscricao_situacao
        CHECK (situacao IN ('solicitada', 'confirmada', 'lista_espera', 'cancelada'))
);

-- ----------------------------------------------------------
-- REGISTRO_PRESENCA (check-in / check-out)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS registro_presenca (
    id_registro_presenca  BIGSERIAL PRIMARY KEY,
    id_inscricao          BIGINT    NOT NULL UNIQUE,
    data_hora_checkin     TIMESTAMP NOT NULL,
    data_hora_checkout    TIMESTAMP,
    observacao_opcional   TEXT,
    CONSTRAINT fk_presenca_inscricao
        FOREIGN KEY (id_inscricao) REFERENCES inscricao (id_inscricao)
        ON DELETE CASCADE,
    CONSTRAINT ck_presenca_periodo
        CHECK (
            data_hora_checkout IS NULL
            OR data_hora_checkout >= data_hora_checkin
        )
);
