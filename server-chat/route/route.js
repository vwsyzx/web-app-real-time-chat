const express = require('express')
const middleFunc = require('../func/middle-func')
const topFunc = require('../func/top-func')
const userFunc = require('../func/user-func')

const route = express()

route.post('/regis', (req, res) => userFunc.regis(req, res))
route.post('/login', (req, res) => userFunc.login(req, res))
route.get('/logout', (req, res) => userFunc.logout(req, res))
route.post('/refresh', (req, res) => userFunc.refresh(req, res))

route.post('/request', (req, res) => middleFunc.request(req, res))
route.post('/accept', (req, res) => middleFunc.accept(req, res))
route.get('/reject/:unique', (req, res) => middleFunc.reject(req, res))
route.get('/mute/:unique', (req, res) => middleFunc.mute(req, res))
route.get('/status/:unique', (req, res) => middleFunc.status(req, res))
route.get('/select/:unique', (req, res) => middleFunc.select(req, res))
route.post('/online', (req, res) => middleFunc.online(req, res))

route.get('/chat/:chatId', (req, res) => topFunc.getChat(req, res))
route.post('/msg/:chatId', (req, res) => topFunc.sendMsg(req, res))
route.delete('/delete/:chatId/:msgId', (req, res) => topFunc.deleteMsg(req, res))

module.exports = route