const { Plugin } = require('powercord/entities')
const {getModule, FluxDispatcher: Dispatcher, channels: { getChannelId }, constants: { ActionTypes }, channels} = require('powercord/webpack')
const Settings = require('./Settings');

class EvenQuickerReply extends Plugin {
  constructor() {
    super()
    this.replyingToMessage = undefined
  }

  async createPendingReply(channel, message, shouldMention, showMentionToggle) {
    if (typeof showMentionToggle === 'undefined') {
      showMentionToggle = channel.guild_id !== null 
    }
    Dispatcher.dirtyDispatch({
      type: ActionTypes.CREATE_PENDING_REPLY,
      channel,
      message,
      shouldMention,
      showMentionToggle,
    })
  }
  onCreatePendingReply = (data) => {
    if (this.replyingToMessage !== data.message.id) {
      this.replyingToMessage = data.message.id
    }
  }

  async startPlugin() {
    powercord.api.settings.registerSettings('quickdelete', {
      category: this.entityID,
      label: 'EvenQuickerReply',
      render: Settings
    });
    

    const { getChannel } = await getModule(['getChannel'])
    const { getMessages } = await getModule(['getMessages'])
    this.getChannel = getChannel
    this.getMessages = getMessages

    Dispatcher.subscribe(
      ActionTypes.CREATE_PENDING_REPLY,
      this.onCreatePendingReply
    )
    
    var globalmessage = null;

    document.addEventListener('keydown', async event => { 
      const textArea = document.querySelector("div[class*='slateTextArea']");
      const { textContent } = textArea;

      if(textContent.trim().length !== 0 || event.ctrlKey || event.key !== 'ArrowDown' || document.activeElement !== textArea)
          return;

      let messages = []                 
      getMessages(channels.getChannelId()).toArray().map(message => {
          if (message.mentioned){
              messages.push(message)
          }})
      if(messages.length  == 0)
        return;
      const lastMessage = messages[messages.length - 1]
          
      if (event.key == 'ArrowDown') { 
        if(document.querySelector("div[class*='colorMuted-HdFt4q size14-e6ZScH mentionButton-3710-W']")){
          this.createPendingReply(this.getChannel(getChannelId()), globalmessage, true)
          return
        }
        if(document.querySelector("div[class*='colorLink-2vG20E size14-e6ZScH mentionButton-3710-W']")){
          this.createPendingReply(this.getChannel(getChannelId()), globalmessage, false)
          return
        }
        else{
          if((this.settings.get('automention', true)))
            var val = false
          else
            var val = true;
          globalmessage = lastMessage;
          this.createPendingReply(this.getChannel(getChannelId()), lastMessage, val)
        }
    }
    })
  }
  pluginWillUnload() {
    Dispatcher.unsubscribe(
      ActionTypes.CREATE_PENDING_REPLY,
      this.onCreatePendingReply
    )
    window.removeEventListener('keydown')
  }
}

module.exports = EvenQuickerReply

/*
major thanks to https://github.com/relative for parts of the code
*/
//#app-mount > div.app-1q1i1E > div > div.layers-3iHuyZ.layers-3q14ss > div > div > div > div > div.chat-3bRxxu > div.content-yTz4x3 > main > form > div > div > div > div.container-2fRDfG
