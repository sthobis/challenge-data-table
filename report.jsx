var React = require('react')
var ReactPivot = require('react-pivot')
var createReactClass = require('create-react-class')
var Emitter = require('wildemitter')

var rows = require('./data.json')

var dimensions = [
  {
    title: 'Date',
    value: 'date'
  },
  {
    title: 'Host',
    value: 'host'
  }
]

var reduce = function (row, memo) {
  memo.loads = (memo.loads || 0)
  memo.impressions = (memo.impressions || 0)
  memo.displays = (memo.displays || 0)

  if (row.type === 'load') {
    memo.loads += 1
  } else if (row.type === 'impression') {
    memo.impressions += 1
  } else if (row.type === 'display') {
    memo.displays += 1
  }
  return memo
}

var calculations = [
  {
    title: 'Loads',
    value: 'loads',
    className: 'alignRight'
  },
  {
    title: 'Impressions',
    value: 'impressions',
    className: 'alignRight'
  },
  {
    title: 'Displays',
    value: 'displays',
    className: 'alignRight'
  },
  {
    title: 'Load Rate',
    value: function (memo) {
      return memo.loads / memo.impressions * 100
    },
    template: function (val, row) {
      return `${val.toFixed(1)}%`
    },
    className: 'alignRight'
  },
  {
    title: 'Display Rate',
    value: function (memo) {
      return memo.displays / memo.loads * 100
    },
    template: function (val, row) {
      return `${val.toFixed(1)}%`
    },
    className: 'alignRight'
  }
]

function UserConfig () {
  if (window.localStorage.getItem('trafficTableUserConfig')) {
    this.config = JSON.parse(window.localStorage.getItem('trafficTableUserConfig'))
  } else {
    this.config = {
      activeDimensions: ['Host'],
      hiddenColumns: [],
      sortBy: '',
      sortDir: 'asc',
      solo: {}
    }
  }
}
UserConfig.prototype.updateConfig = function (newData) {
  var newConfig = Object.assign(
    this.config,
    newData
  )
  this.config = newConfig
  window.localStorage.setItem('trafficTableUserConfig', JSON.stringify(this.config))
}

var trafficTableUserConfig = new UserConfig()
Emitter.mixin(UserConfig)

trafficTableUserConfig.on('activeDimensions', function () {
  this.updateConfig({activeDimensions: arguments[0]})
})
trafficTableUserConfig.on('hiddenColumns', function () {
  this.updateConfig({hiddenColumns: arguments[0]})
})
trafficTableUserConfig.on('sortBy', function () {
  this.updateConfig({sortBy: arguments[0]})
})
trafficTableUserConfig.on('sortDir', function () {
  this.updateConfig({sortDir: arguments[0]})
})
trafficTableUserConfig.on('solo', function () {
  this.updateConfig({solo: arguments[0]})
})

module.exports = createReactClass({
  render () {
    return (
      <ReactPivot
        rows={rows}
        dimensions={dimensions}
        reduce={reduce}
        calculations={calculations}
        activeDimensions={trafficTableUserConfig.config.activeDimensions}
        hiddenColumns={trafficTableUserConfig.config.hiddenColumns}
        sortBy={trafficTableUserConfig.config.sortBy}
        sortDir={trafficTableUserConfig.config.sortDir}
        solo={trafficTableUserConfig.config.solo}
        eventBus={trafficTableUserConfig}
      />
    )
  }
})
