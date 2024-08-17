.DEFAULT_GOAL := help

.PHONY: ci
ci: rector csfix test

vendor: composer.json composer.lock ## Installs composer dependencies
	ddev composer validate
	ddev composer install

.PHONY: csfix
csfix: ## runs pint cs fixer
	ddev exec vendor/bin/pint

.PHONY: rector
rector: ## Runs rector
	ddev exec vendor/bin/rector

.PHONY: phpstan
phpstan: ## Runs phpstan
	ddev exec vendor/bin/phpstan analyse

.PHONY: test
test:  ## Runs phpunit
	ddev exec vendor/bin/pest --compact --parallel

.PHONY: deploy
deploy:
	ddev exec ./artisan cache:clear
	ddev exec ./please stache:refresh
	ddev exec ./please ssg:generate
	cd infrastructure && cdk deploy --profile sandbox-admin

.PHONY: help
help:
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
