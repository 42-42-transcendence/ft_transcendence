FROM        node
MAINTAINER  heryu@student.42seoul.kr

RUN         mkdir -p  /react/test
COPY        ./front/package.json  /react/test/.
COPY        ./front/public /react/test/public
COPY        ./front/src /react/test/src

WORKDIR     /react/test
RUN         npm install

EXPOSE      3001

#ENTRYPOINT  
CMD         PORT=3001 npm start