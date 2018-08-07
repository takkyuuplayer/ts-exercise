.PHONY: test node_modules node_modules/upgrade

TEST_WATCH_COUNT=1

all: node_modules

node_modules:
	yarn install

node_modules/upgrade:
	yarn upgrade --latest

test:
	yarn run test
	yarn run lint

test-watch:
	$(shell npm bin)/nodemon -w src/ -w test/ -e ts -x "make -i test-mru"
	
test-mru:
	@find src test -type f -name "*.spec.ts" \
		| xargs ls -t \
		| head -n ${TEST_WATCH_COUNT} \
		| xargs $(shell npm bin)/mocha
