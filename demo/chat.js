#!/usr/bin/env node
var sys = require("sys"),
	fs = require("fs"),
	chat = require('../lib/server'),
	router = require("../lib/router");

// create chat server
var chatServer = chat.createServer();
chatServer.listen(8001);

// create a channel and log all activity to stdout
chatServer.addChannel({
	title: 'Main Room',
	basePath: "/chat"
}).addListener("msg", function(msg) {
	sys.puts("<" + msg.nick + "> " + msg.text);
}).addListener("join", function(msg) {
	sys.puts(msg.nick + " join");
}).addListener("part", function(msg) {
	sys.puts(msg.nick + " part");
});
chatServer.addChannel({
	title: 'Engineering',
	basePath: "/engineering"
}).addListener("msg", function(msg) {
	sys.puts("<" + msg.nick + "> " + msg.text);
}).addListener("join", function(msg) {
	sys.puts(msg.nick + " join");
}).addListener("part", function(msg) {
	sys.puts(msg.nick + " part");
});
chatServer.addChannel({
	title: 'UX',
	basePath: "/ux"
}).addListener("msg", function(msg) {
	sys.puts("<" + msg.nick + "> " + msg.text);
}).addListener("join", function(msg) {
	sys.puts(msg.nick + " join");
}).addListener("part", function(msg) {
	sys.puts(msg.nick + " part");
});
chatServer.addChannel({
	title: 'Private Room 1',
	basePath: "/room1"
}).addListener("msg", function(msg) {
	sys.puts("<" + msg.nick + "> " + msg.text);
}).addListener("join", function(msg) {
	sys.puts(msg.nick + " join");
}).addListener("part", function(msg) {
	sys.puts(msg.nick + " part");
});

// server static web files
function serveFiles(localDir, webDir) {
	fs.readdirSync(localDir).forEach(function(file) {
		var local = localDir + "/" + file,
			web = webDir + "/" + file;
		
		if (fs.statSync(local).isDirectory()) {
			serveFiles(local, web);
		} else {
			chatServer.passThru(web, router.staticHandler(local));
		}
	});
}
serveFiles(__dirname + "/web", "");
chatServer.passThru("/js/nodechat.js", router.staticHandler(__dirname + "/../web/nodechat.js"));
chatServer.passThru("/", router.staticHandler(__dirname + "/web/index.html"));
