FROM centos:7
MAINTAINER odilon.junior@4linux.com.br
RUN yum install wget gcc openssl-devel cairo cairo-devel cairomm-devel python27-python-markupsafe python27-devel libxslt-devel libffi-devel gcc-c++ kernel-devel python27-gobject gobject-introspection-devel cairo-gobject cairo-gobject-devel epel-release -y 
RUN yum install python-pip -y
RUN pip install --upgrade pip
COPY Requirements.txt /srv/
RUN cd /srv/ && pip install -r Requirements.txt
RUN yum remove gcc kernel-devel gcc-c++ -y
RUN yum clean all
# RUN rm -rf /var/cache/yum
COPY app.py /srv/
CMD ["python", "/srv/app.py"]
