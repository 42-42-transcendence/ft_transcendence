DC = docker

IMAGE = react-image
CONTAINER = react-test

SRC_PORT = 3001
DEST_PORT = 3001

all: $(IMAGE)

$(IMAGE): Dockerfile
	@if [ -z "$$(docker images -q $@)" ]; then \
		$(DC) build . -t $@; \
	fi

start: all
	$(DC) run -it -d --name $(CONTAINER) -p $(SRC_PORT):$(DEST_PORT) $(IMAGE)
	@echo "\033[1;32m"
	@echo "It is just only \"react-test\" server"
	@echo "Actually, be built by the backend"
	@echo "Open browser => http://localhost:3001/login"

clean:
		$(DC) rm -f $(CONTAINER);

fclean: clean
		$(DC) rmi $(IMAGE);

re: clean start

fre: fclean start

.PHONY: all start clean fclean re fre
