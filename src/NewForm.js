import React, { Component } from 'react'



export default class NewForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: ''
    }
  }

  handleChange = (event) => {
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    fetch(this.props.baseUrl + '/', {
      method: 'POST',
      body: JSON.stringify({
        text: this.state.text
    }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( res => {
        return res.json()
    }).then( data => {
      this.props.createPost(data)
      this.setState({
        text: '',
      })
    }).catch (error => console.error({'Error': error}))
  }


  render() {
    return (
    <div className="post">
        <form onSubmit={this.handleSubmit}>
            <div className="submit">
                <input autoComplete="off" type="text"  name="text" onChange={ (e) => this.handleChange(e)} value={this.state.text} placeholder="What's up ..." />
            </div>
            <button className="button" type="submit">
                    Post
            </button>
        </form>
    </div>
    )
  }

}