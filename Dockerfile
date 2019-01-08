FROM node:latest
LABEL maintainer="docker@hoelweb.com"

ENV HOME=/home/app

RUN rm -rf $HOME/api

# Copy the files we need
COPY . $HOME/api

# Change into our working directory
WORKDIR $HOME/api

# Install dependencies and build...
RUN npm install --production

# Expose the port and start the server...
EXPOSE 5000
CMD npm start
