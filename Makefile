name = transcendence
all:
	@printf "Running ${name}...\n"
	@docker-compose -f ./docker-compose.yml up -d

build:
	@printf "Building ${name}...\n"
	@docker-compose -f ./docker-compose.yml up -d --build

down:
	@printf "Stopping ${name}...\n"
	@docker-compose -f ./docker-compose.yml down

re:	down
	@printf "Rebuilding ${name}...\n"
	@docker-compose -f ./docker-compose.yml up -d --build

clean: down
	@printf "Cleaning ${name}...\n"
	@docker system prune -a
	# rm ./backend/assets/profiles/*
fclean:
	@printf "!FCLEANING! docker\n"
	@docker system prune --all --force --volumes
	@docker network prune --force
	@docker volume prune --force

.PHONY	: all build down re clean fclean