FROM node:12
COPY frontend /app
RUN cd /app && ls && npm install && npm run build
EXPOSE 8000/tcp
CMD cd /app && npm run server
