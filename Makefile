NAME = transcendence
DCFILE = docker-compose.yml
DCPATH = ./
DCCMD = docker compose

all: $(NAME)

$(NAME):
	make build
	make up

build:
	@printf "Building ${NAME}...\n"
	@$(DCCMD) -f $(DCPATH)$(DCFILE) build

up:
	@printf "Running ${NAME}...\n"
	@$(DCCMD) -f $(DCPATH)$(DCFILE) up -d

down:
	@printf "Stopping ${NAME}...\n"
	@$(DCCMD) -f $(DCPATH)$(DCFILE) down

clean:
	@printf "Cleaning ${NAME}...\n"
	@$(DCCMD) -f $(DCPATH)$(DCFILE) down -v
	@rm -rf data

fclean:
	@printf "!FCLEANING! docker\n"
	@$(DCCMD) -f $(DCPATH)$(DCFILE) down -v
	@rm -rf data
	@docker image ls -q | xargs docker image rm

re:
	make clean
	make all

fre:
	make fclean
	make all

.PHONY: all build up down clean fclean re fre