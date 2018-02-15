Esse projeto tem como objetivo construir e testar o Aliflix com o Jenkins+Jmeter

Construindo a imagem do frontend

```docker
docker build --rm -t aliflix-front .
```

```
docker run -td --hostname dns.mageddo --name dns-proxy-server -p 5380:5380 \
-v /opt/dns-proxy-server/conf:/app/conf \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /etc/resolv.conf:/etc/resolv.conf \
defreitas/dns-proxy-server
```
