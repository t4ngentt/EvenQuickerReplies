const { Plugin } = require("powercord/entities")
const { getModule, channels } = require("powercord/webpack")
const { getMessages } = getModule([ "getMessages" ], false)
const { ComponentDispatch } = getModule(["ComponentDispatch"], false)

const Settings = require("./Settings")


module.exports = class quickreply extends Plugin {

  startPlugin () {
    
  }

    sendmessage(){

    document.addEventListener("keydown", async event => { 
        if (!this.active) return
        if (event.ctrlKey) return

        const { getCurrentUser } = getModule(["getCurrentUser"], false)
        const user = getCurrentUser()

        const key = event.key 
        const expectation = document.querySelector("#app-mount > div.app-1q1i1E > div > div.layers-3iHuyZ.layers-3q14ss > div > div > div > div > div.chat-3bRxxu > div.content-yTz4x3 > main > form > div > div > div > div > div > div.textArea-12jD-V.textAreaSlate-1ZzRVj.slateContainer-3Qkn2x > div.markup-2BOw-j.slateTextArea-1Mkdgw.fontSize16Padding-3Wk7zP")

        if ((key) && (key == "ArrowDown")) {
            
            getMessages(channels.getChannelId()).toArray().map(message => {
                const author = message.author

                if (message.content.trim()) {
                    if (!this.settings.get("exclude", true)) {
                        // messages.push(message)
                    } else {
                        if (author.id == user.id) {
                            // messages.push(message)
                        }
                    }
                }
            })  

            const lastMessage = messages.pop()
            const textArea = document.querySelector("div[class*='slateTextArea']").childNodes[0].childNodes[0]
            const { textContent } = textArea

            if ((textContent.trim().length == 0) && (lastMessage) && (document.activeElement == expectation)) {
                ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", {
                    content: lastMessage.content.trim()
                })

                console.log(textArea)
            }
        }


    pluginWillUnload () {
        powercord.api.commands.unregisterCommand('mock');
    }

    }
    }

};