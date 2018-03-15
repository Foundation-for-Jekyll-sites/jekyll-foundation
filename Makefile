# use tabs for indentation!

SSH-USER = my-username
SSH-HOST = my-host
REMOTE-PATH = /my-remote-path with trailing slash/

deploy:
	rsync -cavze ssh --delete --exclude '.DS_Store' ./_site/ $(SSH-USER)@$(SSH-HOST):$(REMOTE-PATH)

install:
	bundle install
	yarn install
	# composer install
