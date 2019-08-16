FROM cypress/base:10.16.0 AS assets

RUN yarn global add cypress

COPY superset/assets /assets
WORKDIR /assets
RUN npm ci
RUN npm run build

FROM python:3.6

# Configure environment
ENV GUNICORN_BIND=0.0.0.0:8088 \
    GUNICORN_LIMIT_REQUEST_FIELD_SIZE=0 \
    GUNICORN_LIMIT_REQUEST_LINE=0 \
    GUNICORN_TIMEOUT=60 \
    GUNICORN_WORKERS=2 \
    GUNICORN_EXTRA_ARGS= \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    PYTHONPATH=/etc/superset:/home:$PYTHONPATH \
    SUPERSET_HOME=/var/lib/superset
ENV GUNICORN_CMD_ARGS="--workers ${GUNICORN_WORKERS} --timeout ${GUNICORN_TIMEOUT} --bind ${GUNICORN_BIND} --limit-request-line ${GUNICORN_LIMIT_REQUEST_LINE} --limit-request-field_size ${GUNICORN_LIMIT_REQUEST_FIELD_SIZE}"

COPY requirements.txt .

# Create superset user & install dependencies
RUN useradd -U -m superset && \
    mkdir /etc/superset  && \
    mkdir ${SUPERSET_HOME} && \
    chown -R superset:superset /etc/superset && \
    chown -R superset:superset ${SUPERSET_HOME} && \
    apt-get update && \
    apt-get install -y \
        build-essential \
        curl \
        default-libmysqlclient-dev \
        freetds-dev \
        freetds-bin \
        libffi-dev \
        libldap2-dev \
        libpq-dev \
        libsasl2-dev \
        libssl1.0 && \
    apt-get clean && \
    rm -r /var/lib/apt/lists/* && \
    pip install --no-cache-dir -r requirements.txt

# Configure Filesystem
COPY superset /home/superset
COPY superset/bin/superset /usr/local/bin
COPY --from=assets /assets/dist /home/superset/assets/dist
VOLUME /home/superset \
       /etc/superset \
       /var/lib/superset
WORKDIR /home/superset

# Deploy application
EXPOSE 8088
HEALTHCHECK CMD ["curl", "-f", "http://localhost:8088/health"]
CMD ["gunicorn", "superset:app"]
USER superset