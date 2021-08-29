# ServerTool

Tool for making your MCServer easier

## SETUP FROM Source Code
1. clone the project
	```sh-session
	git clone https://github.com/XyZerKunG/ServerTool.git
	```
2. installs modules defined in the dependencies section of the __package.json__ file 
	```sh-session
	npm install
	```
3. run this command to build node-pty
	```sh-session
	./node_modules/.bin/electron-rebuild
	```
4. build typescript
	```sh-session
	npm run buildtypescript
	```
5.  and then run this command to run the app
	```sh-session
	npm start
	```
