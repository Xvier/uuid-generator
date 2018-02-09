FROM python:3
COPY app /src/app
COPY requirements.txt /src/
WORKDIR /src/
ENV FLASK_APP=/src/app/__init__.py
RUN pip install -r requirements.txt
EXPOSE 5000
ENTRYPOINT [ "flask" ]
CMD [ "run","--host=0.0.0.0" ]