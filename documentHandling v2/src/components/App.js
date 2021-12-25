import { Tabs, Tab } from 'react-bootstrap'
import React, { Component } from 'react';
import Migrations from '../abis/Migrations.json'
import DocumentHandling from '../abis/DocumentHandling.json'
import Web3 from 'web3';
import './App.css';

class App extends Component {

  // async componentWillMount() {
  //   await this.loadBlockchainData(this.props.dispatch)
  // }

  async loadBlockchainData(dispatch) {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
      
      //load balance
      if(typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})
      } else {
        window.alert('Please login with MetaMask')
      }

      //load contracts
      try {
        const migrations = new web3.eth.Contract(Migrations.abi, Migrations.networks[netId].address)
        const documentHandling = new web3.eth.Contract(DocumentHandling.abi, DocumentHandling.networks[netId].address)
        this.setState({migrations, documentHandling})
      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }

    } else {
      window.alert('Please install MetaMask')
    }
  }

  async updateAccount() {
    const web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    this.setState({ account: accounts[0] })
    
    this.getDocumentsByOwner(this.state.account).then(result => {
      this.setState({ documentIds: result })
      console.log(this.state.documentIds)
    })
    
    var documents = []
    console.log(this.state.documentIds.length)
    for (var i = 0; i < this.state.documentIds.length; i++) {
      this.getDocumentsDetails(this.state.documentIds[i]).then(document => {
        if (document !== 0) {
          documents.push(document)
          console.log(document)
          console.log("hello")
          this.setState({documents: documents})
        }
        
      })
    }

    //console.log(zombies)
    console.log(this.state.documents)
  }

  async checkOwner() {
    if(this.state.documentHandling!=='undefined'){
      try{
        return this.state.documentHandling.methods.isOwner().call().then(result => { return result })
      } catch (e) {
        console.log('Error, checkOwner: ', e)
      }
    }
  }

//   async ownerFunctions() {
//   if (this.state.isOwner === true) {
//     return <Tab eventKey="create" title="Create Zombie">
//                   <div>
//                   <br></br>
//                     Create a zombie
//                     <br></br>
//                     (This function can only be used once per user)
//                     <br></br>
//                     <form onSubmit={(e) => {
//                       e.preventDefault()
//                       let name = this.zombieName.value
//                         console.log(name)
//                         this.createRandomZombie(name)
//                     }}>
//                       <div className='form-group mr-sm-2'>
//                       <br></br>
//                         <input
//                           id='zombieName'
//                           type='text'
//                           ref={(input) => { this.zombieName = input }}
//                           className="form-control form-control-md"
//                           placeholder='name...'
//                           required />
//                         </div>
//                         <br></br>
//                       <button type='submit' className='btn btn-primary'>Create Zombie</button>
//                     </form>
//                   </div>
//                 </Tab>
//   }
// }

  async getDocumentsByOwner(owner) {
    if(this.state.documentHandling!=='undefined'){
      try{
        return this.state.documentHandling.methods.getDocumentsByOwner(owner).call().then(result => { return result })
      } catch (e) {
        console.log('Error, getDocumentsByOwner: ', e)
      }
    }
  }
  
  async getDocumentsDetails(id) {
    if(this.state.documentHandling!=='undefined'){
      try{
        return this.state.documentHandling.methods.documents(id).call().then(result => { return result })
      } catch (e) {
        console.log('Error, getDocumentsDetails: ', e)
      }
    }
  }

  componentDidMount() {
    this.loadBlockchainData(this.props.dispatch)
    this.interval = setInterval(() => this.updateAccount(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async createDocument(name, age) {
    if(this.state.documentHandling!=='undefined'){
      try {
        console.log(this.state.account)
        this.getDocumentsByOwner(this.state.account).then(function (result) {
          console.log(result)
        })
        await this.state.documentHandling.methods.createDocument(name, age)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })
        this.getDocumentsByOwner(this.state.account).then(function (result) {
          console.log(result)
        })

      } catch (e) {
        console.log('Error, creation: ', e)
      }
    }
  }

  async changeName(id, name) {
    if(this.state.documentHandling!=='undefined'){
      try {
        await this.state.documentHandling.methods.changeName(id, name)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })
      } catch (e) {
        console.log('Error, changeName: ', e)
      }
    }
  }

  async changeAge(id, age) {
    if(this.state.documentHandling!=='undefined'){
      try {
        await this.state.documentHandling.methods.changeAge(id, age)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })
      } catch (e) {
        console.log('Error, changeAge: ', e)
      }
    }
  }
  
  async transferFrom(account, id) {
    if(this.state.documentHandling!=='undefined'){
      try {
        await this.state.documentHandling.methods.transferFrom(this.state.account, account, id)
        .send({ from: this.state.account })
        .on("receipt", function (receipt) {
          console.log("success")
        })
        .on("error", function(error) {
          console.log("failed")
        })
      } catch (e) {
        console.log('Error, transferFrom: ', e)
      }
    }
  }

  constructor(props) {
    
    super(props)
    this.state = {
      interval: null,
      migrations: null,
      documentHandling: null,
      web3: 'undefined',
      documentIds: [],
      documents: [],
      account: '',
      balance: 0,
      isOwner: false
    }
  }
  
  render() {
    //  const renderTest = () => {
    //   if (this.state.isOwner) {
    //     return <h1> hi </h1>
    //   } else {
    //     return <h1> bye </h1>
    //   }
    // }
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
          <b>Document Handling</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Document Stuff</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="create" title="Create Document">
                  <div>
                  <br></br>
                    Create a document
                    <br></br>
                    (Enter your name and age)
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                        let name = this.name.value
                        let age = this.age.value
                        console.log(name)
                        this.createDocument(name, age)
                    }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='Name'
                          type='text'
                          ref={(input) => { this.name = input }}
                          className="form-control form-control-md"
                          placeholder='name...'
                          required />
                        </div>
                        <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='Age'
                          type='number'
                          ref={(input) => { this.age = input }}
                          className="form-control form-control-md"
                          placeholder='age...'
                          required />
                        </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Create Document</button>
                    </form>
                  </div>
                </Tab>
                  <Tab eventKey="changeName" title="Change Name">
                  <div>
                  <br></br>
                    Change the name of a document
                    <br></br>
                    (Enter the document ID and new name)
                    <br></br>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                      let id = this.changeNameDocumentId.value
                        let name = this.newName.value
                        console.log(id)
                        console.log(name)
                        this.changeName(id, name)
                      }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='id'
                          type='number'
                          ref={(input) => { this.changeNameDocumentId = input }}
                          className="form-control form-control-md"
                          placeholder='document Id...'
                          required />
                      </div>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='name'
                          type='text'
                          ref={(input) => { this.newName = input }}
                          className="form-control form-control-md"
                          placeholder='New name...'
                          required />
                      </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Change Name</button>
                    </form>
                  </div>
                  </Tab>
                  <Tab eventKey="changeAge" title="Change Age">
                  <div>
                  <br></br>
                    Change the Age
                    <br></br>
                    (Enter the document ID and new age)
                    <br></br>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        let id = this.changeAgeDocumentId.value
                        let age = this.newAge.value
                        console.log(id)
                        console.log(age)
                        this.changeAge(id, age)
                      }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='id'
                          type='number'
                          ref={(input) => { this.changeAgeDocumentId = input }}
                          className="form-control form-control-md"
                          placeholder='document Id...'
                          required />
                      </div>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='age'
                          type='number'
                          ref={(input) => { this.newAge = input }}
                          className="form-control form-control-md"
                          placeholder='New age...'
                          required />
                      </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Change Age</button>
                    </form>
                  </div>
                  </Tab>
                <Tab eventKey="transfer" title="Transfer Document Ownership">
                  <div>
                  <br></br>
                    Transfer your document to someone else
                    <br></br>
                    (Please enter the address you want to send it to and the documentId you want to send)
                    <br></br>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        let sendAccount = this.sendAccount.value
                        let id = this.sendDocumentId.value
                        console.log(sendAccount)
                        console.log(id)
                        this.transferFrom(sendAccount, id)
                      }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='account'
                          type='text'
                          ref={(input) => { this.sendAccount = input }}
                          className="form-control form-control-md"
                          placeholder='Transfer to this account...'
                          required />
                      </div>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='id'
                          type='number'
                          ref={(input) => { this.sendDocumentId = input }}
                          className="form-control form-control-md"
                          placeholder='document Id...'
                          required />
                      </div>
                        <br></br>
                      <button type='submit' className='btn btn-primary'>Transfer Document</button>
                    </form>
                  </div>
                  </Tab>
                </Tabs>
                <div id="documents">
                  {this.state.documents.map(document => (
                    <ul key={document.name}>
                      <li>name:{document.name}</li>
                      <li>age: {document.age}</li>
                    </ul>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
