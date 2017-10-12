var React = require('react')
var ReactPivot = require('react-pivot')
var createReactClass = require('create-react-class')

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

var reduce = function(row, memo) {
  memo.loads = (memo.loads || 0)
  memo.impressions = (memo.impressions || 0)
  memo.displays = (memo.displays || 0)

  switch (row.type) {
    case 'load':
      memo.loads += 1
      break
    case 'impression':
      memo.impressions += 1
      break
    case 'display':
      memo.displays += 1
      break
    default:
      break
  }
  return memo
}

var calculations = [
  {
    title: 'Loads',
    value: 'loads'
  },
  {
    title: 'Impressions',
    value: 'impressions'
  },
  {
    title: 'Displays',
    value: 'displays'
  },
  {
    title: 'Load Rate',
    value: function(memo) {
      return memo.loads / memo.impressions
    }
  },
  {
    title: 'Display Rate',
    value: function(memo) {
      return memo.displays / memo.loads
    }
  }
]

module.exports = createReactClass({
  render () {
    return (
      <div>
        <ReactPivot
          rows={rows}
          dimensions={dimensions}
          reduce={reduce}
          calculations={calculations}
          activeDimensions={['Host']}
        />
      </div>
    )
  }
})
