FROM ubuntu:16.04

RUN apt-get update \
    && apt-get install -y coturn \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV TURN_PORT 3478
ENV TURN_PORT_START 10000
ENV TURN_PORT_END 20000
ENV TURN_SECRET voxpopsecret
ENV TURN_SERVER_NAME voxpop
ENV TURN_REALM voxpop.com

ADD start_coturn.sh start_coturn.sh
RUN chmod +x start_coturn.sh

CMD ["./start_coturn.sh"]