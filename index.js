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

      if(event.ctrlKey || event.key !== 'ArrowDown' || document.activeElement !== textArea)
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
          console.log("called 1")
          return
        }
        if(document.querySelector("div[class*='colorLink-2vG20E size14-e6ZScH mentionButton-3710-W']")){
          this.createPendingReply(this.getChannel(getChannelId()), globalmessage, false)
          console.log("called 2")
          return
        }
        else{
          if(textContent.trim().length !== 0)
            return
          if((this.settings.get('automention', true)))
            var val = false
          else
            var val = true;
          globalmessage = lastMessage;
          console.log("called 3")
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
thanks to https://github.com/relative for some code references
*/
