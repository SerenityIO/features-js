import './two-lists-fields.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { twoListsStatus } from '../../../../actions'


class TwoListsField extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: 'Cat in the Hat',
      visible: false,
      error: true,
      done: false,
      data: this.props.data,
      data1: [],
      buffer: null,
      colorForListTwo: '#36a9e0',
      colorForListOne: '#36a9e0'
    }
  }
  dragListOne(ev) {
    ev.dataTransfer.setData('text/plain', '')
    let buffer = this.state.data.find(item => item.id === +ev.target.id)
    this.setState({ buffer, colorForListTwo: '#3286c4' })
  }
  dragListTwo(ev) {
    ev.dataTransfer.setData('text/plain', '')
    let buffer = this.state.data1.filter(item => item.id === +ev.target.id)[0]
    this.setState({ buffer, colorForListOne: '#3286c4' })
  }
  dropListOne() {
    if (this.state.data.indexOf(this.state.buffer) === -1 && this.state.buffer) {
      let data1 = this.state.data1
      let arr = this.state.data

      data1 = data1.filter(i => i.id !== this.state.buffer.id)
      arr.push(this.state.buffer)
      arr.sort((a, b) => a.id - b.id)
      let body = {
        id: this.props.id,
        value: data1,
        done: data1.length !== 0,
        error: data1.length === 0
      }
      this.props.twoListsStatus(body)
      this.setState({
        buffer: null,
        data: arr,
        data1: data1,
        colorForListOne: '#36a9e0'
      })
    }
  }
  dropListTwo() {
    if (this.state.data1.indexOf(this.state.buffer) === -1 && this.state.buffer) {
      let data = this.state.data
      let arr = this.state.data1
      data = data.filter(i => i.id !== this.state.buffer.id)

      arr.push(this.state.buffer)
      arr.sort((a, b) => a.id - b.id)
      let body = {
        id: this.props.id,
        value: arr,
        done: arr.length !== 0,
        error: arr.length === 0
      }
      this.props.twoListsStatus(body)
      this.setState({
        buffer: null,
        data1: arr,
        data: data,
        colorForListTwo: '#36a9e0'
      })
    }
  }
  allowDrop(ev) {
    ev.preventDefault()
  }
  componentWillReceiveProps(){
    this.setState({
      data1: this.props.webForm[this.props.id].value,
      error: this.props.webForm[this.props.id].error,
      done: this.props.webForm[this.props.id].done
    }, () => this.state.data1.length === 0 && this.setState({data: this.props.data}))
  }
  render() {
    return (
      <div className="row" id='two-lists-field'>
        <div >
          <span className={this.state.error ? 'error-field' : 'hidden'}>Please, drag & drop at least one option to the field called `Lists with Options #2` <i className='icon ion-ios-close-outline' aria-hidden="true"></i></span>
          <span className={this.state.error ? 'hidden' : 'done-field'}>Fields are succesfully submitted <i className='icon ion-ios-checkmark-outline' aria-hidden="true"></i></span>
        </div>
        <div className='col-xs-6'>
          <div style={{backgroundColor: this.state.colorForListOne}} onDrop={() => this.dropListOne()} onDragOver={event => this.allowDrop(event)} id='one-list' className='list'>
            <div className='header'>
              <span className='header-text'>List with Options #1</span>
            </div>
            <div className='content'>
              {
                this.state.data.map(item => <div id={item.id} key={item.id} className='list-item' draggable="true" onDragStart={event => this.dragListOne(event)}><div className='text'>{item.name}</div></div>)
              }
            </div>
          </div>
        </div>
        <div className='col-xs-6'>
          <div style={{backgroundColor: this.state.colorForListTwo}} onDrop={() => this.dropListTwo()} onDragOver={event => this.allowDrop(event)} id='two-list' className='list two-list'>
            <div className='header'>
              <span className='header-text'>List with Options #2</span>
            </div>
            <div className='content'>
              {
                this.state.data1.map(item => <div id={item.id} key={item.id} className='list-item' draggable="true" onDragStart={event => this.dragListTwo(event)}><div className='text'>{item.name}</div></div>)
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
TwoListsField.defaultProps = {
  data: [
    {
      id: 1,
      name: 'LoremIpsumsadasdasdcasdasdcc asdasdasd '
    },
    {
      id: 2,
      name: 'LoremIpsum2'
    },
    {
      id: 3,
      name: 'LoremIpsum3'
    },
    {
      id: 4,
      name: 'LoremIpsum4'
    },
    {
      id: 5,
      name: 'LoremIpsum5'
    },
    {
      id: 6,
      name: 'LoremIpsum6'
    },
    {
      id: 7,
      name: 'LoremIpsum7'
    },
    {
      id: 8,
      name: 'LoremIpsum8'
    },
    {
      id: 9,
      name: 'LoremIpsum9'
    }
  ]
}
TwoListsField.propTypes = {
  webForm: PropTypes.object
}

const mapStateToProps = state => ({
  webForm: state.webForm
})

export default connect(mapStateToProps, { twoListsStatus })(TwoListsField)
