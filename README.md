![DeepSource](https://deepsource.io/gh/OpenSource-XyZerKunG/Minecraft-ServerTool.svg/?label=active+issues&token=WDkY7pvSvZRXOa90-uNH_GJC)
![Github](https://img.shields.io/github/downloads/OpenSource-XyZerKunG/Minecraft-ServerTool/total?label=Github&logo=github)
![Sourceforge](https://img.shields.io/sourceforge/dt/minecraft-servertool?color=%237DC556&label=Sourceforge&logo=sourceforge)
[![Discord](https://img.shields.io/discord/578160247991173130.svg?color=%237289da&label=Discord&logo=discord&logoColor=%237289da)](https://discord.gg/sCte3Cu)

<div align="center">
	<a href="https://www.youtube.com/c/XyZerKunG" aria-label="XyZerKunG">
		<img src="https://raw.githubusercontent.com/XyZerKunG/XyZerFile/main/terminal.png" width="400" alt="ServerTool">
	</a>
</div>

## ServerTool

- [Setup from Source Code](#setup-from-source-code)
- [Preview](#preview)

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
	npm run build
	```
5.  and then run this command to run the app
	```sh-session
	npm start
	```
## Preview
<div align="center">
	<img src="https://i.imgur.com/w8sQXjB.png" alt="ServerToolImage">
	<br>
	<img src="https://i.imgur.com/EuNCvJf.png" alt="ServerToolImage">
	<br>
	<img src="https://i.imgur.com/az2lPyH.png" alt="ServerToolImage">
</div>
