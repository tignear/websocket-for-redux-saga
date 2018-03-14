# websocket-for-redux-saga
Websocket for redux-saga.It has an API similar to the browser's API
## Install
```npm i -S websocket-for-redux-saga```
## Build
```git clone https://github.com/tignear/websocket-for-redux-saga.git```  
```npm run build```
## Testing
```npm run test```

## Example
with React.
```
import React from 'react';
import { connect } from 'react-redux';
import { open,close,message } from 'websocket-for-redux-saga/action';
import {STATE_ONCLOSE,STATE_ONOPEN,STATE_ONERROR,STATE_ONMESSAGE} from 'websocket-for-redux-saga/reducer'

const wsid='wsid';
class WebSoketEcho extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      messagearea:'',
      addressarea:''
    };
  }
  sendHandle(){
    this.props.dispatch(message(wsid,this.state.messagearea));
    this.setState({messagearea:''});
  }
  closeHandle(){
    this.props.dispatch(close(wsid,false,{code:1000,reason:'text'}));
  }
  openHandle(){
    this.props.dispatch(close(wsid));
    this.props.dispatch(open(wsid,this.state.addressarea));
  }
  componentWillUnmount(){
    this.closeHandle();
  }
  render(){
    const ws=this.props.websocket;
    const {state='',event=null}=ws[wsid]?ws[wsid]:{};
    let viewValue='';
    switch(state){
      case STATE_ONOPEN:
      case STATE_ONERROR:
        break;
      case STATE_ONMESSAGE:
        viewValue=event.data;
        break;
      case STATE_ONCLOSE:
        viewValue=event.code+":"+event.reason;
        break;
    }
    return (
      <div>
        <p>state:{state}</p>
        <p>value:{viewValue}</p>
        <button type="button" onClick={()=>this.openHandle()}>Open</button>
        <button type="button" onClick={()=>this.closeHandle()}>Close</button><br/>
        <input type="text" value={this.state.addressarea} onChange={(e)=>this.setState({addressarea:e.target.value})} placeholder="input address" /><br/>
        <textarea name="messagearea" value={this.state.messagearea} onChange={(e) => this.setState({messagearea: e.target.value})} placeholder="input your text"></textarea>
        <button type="button" onClick={()=>this.sendHandle()}>Send</button>
      </div>
    );
  }
}
function mapStateToProps(state){
  return state;
}
function mapDispatchToProps(dispatch){
  return {
    dispatch
  };
}
export default connect(mapStateToProps,mapDispatchToProps)(WebSoketEcho);
```
