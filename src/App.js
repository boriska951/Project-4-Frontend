import './App.css';
import React, { Component } from 'react'

let baseUrl = "https://bromeliad-social-app.herokuapp.com"

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      posts:[],
      modalOpen: false,
      postToBeEdited:{},
      text:"",
      user:{},
      userLoggedIn: false,
      userLoginOpen:false,
      userRegisterOpen:false,
      // articles: []
    }
  }

  checkLoginStatus = () => {
    fetch(baseUrl+"/user/logged_is_user", {
      credentials:"include"
    })
    .then(res => {
      console.log(res)
      if (res.status === 200){
        res.json()
        
        .then(body => {
          console.log(body)
          console.log(body.data)
          this.setState({
            user: body.data,
            userLoggedIn: true
          })
          this.getPosts()
          return res
        })
      }
      else {
        console.log("Nobody is logged in")
        this.setState({
          userLoggedIn:false
        })
      }
  })
  .catch(error => {
    console.log("check login error", error)
  })
  }

  getPosts = () => {
    fetch(baseUrl + "/",{
      "access-control-allow-origin" : "*",
      "Content-type": "application/json"
    })
    .then(res => {
      if(res.status === 200){
        return res.json()
      } else {
        return []
      }
    }).then(data => {
      this.setState({
        posts:data["data"]
      })
    })
  }

  getMyPosts = () => {
    fetch(baseUrl + "/my_posts",{
      credentials:"include"
    })
    .then(res => {
      if(res.status === 200){
        return res.json()
      } else {
        return []
      }
    }).then(data => {
      this.setState({
        posts:data["data"]
      })
    })
  }

  // getNews = () => {
  //   fetch("https://newsapi.org/v2/everything?q=bitcoin&apiKey=061f7b5de4d040b3a441ee17a36b3d0d", {
  //     "Content-Security-Policy": "upgrade-insecure-requests"
  //   })
  //   .then(res => {
  //     if(res.status === 200){
  //       return res.json()
  //     } else {
  //       return []
  //     }
  //   }).then(data => {
  //     console.log(data["articles"])
  //     this.setState({articles:data["articles"]})
  //   })
  // }

  createPost = (newPost) => {
    const copyPosts = [...this.state.posts]
    copyPosts.push(newPost)
    this.setState({
      posts:copyPosts
    })
  }

  loginUser = async (e) => {
    e.preventDefault()
    const url = baseUrl + '/user/login'
    const loginBody = {
      email: e.target.email.value,
      password: e.target.password.value
    }
    console.log(loginBody)
    try {

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(loginBody),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include"
      })

      console.log(response)
      console.log("BODY: ",response.body)

      if (response.status === 200) {
        this.checkLoginStatus()
        this.getPosts()
        this.setState({
          userLoginOpen:false
        })
        console.log(this.state)
      }
    }
    catch (err) {
      console.log('Error => ', err);
    }
  }


  handleSubmitPost = async (event) => {
    event.preventDefault()
    const postBody ={
      text: event.target.text.value,
      user: this.state.user
    }
    console.log(postBody)
    try{
      const res = await fetch(baseUrl,{
        method:"POST",
        body:JSON.stringify(postBody),
        headers:{
          'Content-Type': 'application/json'
        },
        credentials: "include"
      })

      if(res.status === 200) {
        const copyPosts = [...this.state.posts]
        copyPosts.push(postBody)
        this.setState({
          posts:copyPosts
        })
      }
    }
    catch(err) {
      console.log('Error => ',err)
    }
  }

  register = async (e) => {
    e.preventDefault()
    const url = baseUrl + '/user/register'
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
          email: e.target.email.value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        this.getPosts()
        
      }
    }
    catch (err) {
      console.log('Error => ', err);
    }
  }

  logoutUser = () => {
    fetch(`${baseUrl}/user/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then (response => {
      console.log('Logout successful!')
      this.setState({
        userLoggedIn: false
      })
    })
  }


  deletePost = (id) => {
    fetch(baseUrl + `/` + id, {
    method: 'DELETE',
    // credentials: "include"
  }).then( res => {
    const findIndex = this.state.posts.findIndex(post => post["id"] === id)
    console.log(findIndex)
    const copyPosts = [...this.state.posts]
    copyPosts.splice(findIndex, 1)
    this.setState({
      posts: copyPosts
    })
  })
  }


  showEditForm = (post)=>{
    this.setState({
      modalOpen:true,
      text: post.text,
      postToBeEdited:post
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const url = baseUrl + '/' + this.state.postToBeEdited["id"]
    try{
      const response = await fetch( url , {
        method: 'PUT',
        body: JSON.stringify({
          text: e.target.text.value
        }),
        headers: {
          'Content-Type' : 'application/json'
        },
        credentials: 'include'
      })

      if (response.status === 200){
        const updatedPost = await response.json()
        const findIndex = this.state.posts.findIndex(post => post["id"] === updatedPost["id"])
        const copyPosts = [...this.state.posts]
        copyPosts[findIndex] = updatedPost
        this.setState({
          posts: copyPosts,
          modalOpen:false
        })
      }
    }
    catch(err){
      console.log('Error => ', err);
    }
  }

  handleChange = (e)=>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async componentDidMount() {
    this.checkLoginStatus()
    this.getPosts()
    // this.getNews()
    console.log(this.state)
  }

  showLoginForm = () => {
    this.setState({
      userLoginOpen:true
    })
  }

  closeLoginForm = () => {
    this.setState({
      userLoginOpen:false
    })
  }

  showRegisterForm = () => {
    this.setState({
      userRegisterOpen:true
    })
  }

  closeRegisterForm = () => {
    this.setState({
      userRegisterOpen:false
    })
  }

  render() {
    return (
      <div className="App">
          <div className="sidebar">
              <h2> Hello {this.state.user.username} </h2>
              { this.state.userLoggedIn === true &&
              <div className="option">
                <h3 onClick={() => {this.getMyPosts()}}>My posts</h3>
              </div>
              }
              <div className="option">
                <h3 onClick={() => {this.getPosts()}}>Home</h3>
              </div>
              { this.state.userLoggedIn === false &&
              <div className="option">
                <h3 onClick={() => { this.showLoginForm()}}>Login</h3>
              </div>
              }
              { this.state.userLoggedIn === false &&
              <div className="option">
                <h3 onClick={() => { this.showRegisterForm()}}>Register</h3>
              </div>
              }
              { this.state.userLoggedIn && 
              <div className="option">
                <h3 onClick={() => { this.logoutUser()}}>Logout</h3>
              </div>
              }
              {
                this.state.userLoginOpen &&

                <form onSubmit={this.loginUser}>
                  <strong>Login </strong><br/>
                  <label htmlFor="name">Email: </label>
                  <input autoComplete="off" type="text" id="name" name="email"/><br/>
                  <label htmlFor="name">Password: </label>
                  <input autoComplete="off" type="text" id="password" name="password"/><br/>
                  <input type="submit" value="login" /><br/>
                </form>

              }

              {
                this.state.userRegisterOpen &&
                <form onSubmit={this.register}>
                  <strong>Register </strong><br/>
                    <label htmlFor="name">Username: </label>
                    <input autoComplete="off" type="text" id="name" name="username"/><br/>
                    <label htmlFor="name">Password: </label>
                    <input autoComplete="off" type="text" id="password" name="password"/><br/>
                    <label htmlFor="name">Email: </label>
                    <input autoComplete="off" type="text" id="email" name="email"/><br/>
                    <input type="submit" value="signup" /><br/>
                 </form>
              }

              {
                this.state.modalOpen &&
                  <div>
                    <form onSubmit={this.handleSubmit}>
                      <label>Text: </label>
                      <input autoComplete="off" name="text" type="text"  value={this.state.text} onChange={this.handleChange}/>
                      <button>Submit</button>
                    </form>
                  </div>
              }
          </div>


          <div className="feed">
            <h2> Home </h2>
              <div className="post">
                <form onSubmit={this.handleSubmitPost}>
                    <div className="submit">
                        <input autoComplete="off" type="text"  name="text" onChange={ (e) => this.handleChange(e)} value={this.state.text} placeholder="What's up ..." />
                    </div>
                    <button className="button" type="submit">
                            Post
                    </button>
                </form>
            </div>
            { this.state.posts.map((post, i) => {
                return (
                  <><div className="postFeed" key={i}>
                    <div className="body">
                      <div className="header">
                        <div className="text">
                          <h3>
                            {post.user.username}
                          </h3>
                        </div>
                        <div className="Description">
                          <p>{post.text}</p>
                        </div>
                      </div>
                      <div className="footer">
                        <button>Comment</button>
                        <button>Like</button>
                        <button onClick={() => { this.showEditForm(post); } }>Edit</button>
                        <button onClick={() => { this.deletePost(post["id"]); } }className="delete">Delete</button>
                      
                      </div>
                    </div>
                  </div>
                  </>
                )
              })
            }
            </div>

            <div className="news">

              <div className="news_container">
                  <h2>What's happening in the world</h2>
              
              {/* { this.state.articles.map((article, i) => {
                return(
                  <div className="article">
                    <a href={article.url}><h3>{article.title}</h3></a>
                    <p>{article.description}</p>
                  </div>
                )
              })
              } */}
              </div>
            </div>

      </div>
    );
  }

}
export default App;