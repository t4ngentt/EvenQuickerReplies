const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');

module.exports = class Settings extends React.Component {
  render () {
    const { getSetting, toggleSetting } = this.props;

    return (
      <div>
        <SwitchItem
          note={[
            'Toggle Auto-Mention On/Off on replies'
          ]}
          value={getSetting('automention', true)}
          onChange={() => toggleSetting('automention')}
        >  
          Turn off Auto-Mention
        </SwitchItem>

      </div>
    );
  }
};
