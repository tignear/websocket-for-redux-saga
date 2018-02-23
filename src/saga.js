import { eventChannel,END} from 'redux-saga';
import { fork, take, call, put, cancel,takeEvery} from "redux-saga/effects";
import {onopen,onmessage,onclose,onerror,open,message,close} from "./action";
/**
 * https://github.com/kuy/redux-saga-chat-example/blob/master/src/client/sagas.js
 */

const sockets={};
function getSocket(id){
	return sockets[id];
}
function setSocket(id,socket){
	sockets[id]=socket;
}
function deleteSocket(id){
	delete sockets[id];
}
/**
 * [connect description]
 * @param  {string} url    url
 * @param  {Object} option protocol,binaryType
 * @return {WebSocket} socket 
 */
function connect(id,url,option={}){
	if(!getSocket(id)){
			const socket=new WebSocket(url,option.protocol);
			socket.binaryType=option.binaryType?option.binaryType:socket.binaryType;
			setSocket(id,socket);
			return socket;
	}
	return null;
}
function* read(socket,id){
	const channel = yield call(subscribe, socket,id);
	while(true){
		const action=yield take(channel);
		yield put(action);
	}
	//yield takeEvery(channel,put); 
	//This is not supported by redux-saga-test-plan 3.5.0. If redux-saga-test-plan will support this in the future, It can use this.
}

/**
 * 
 * @param  {WebSocket} socket [description]
 * @return {[type]}        [description]
 */
function subscribe(socket,id){
	return eventChannel(emitter=>{
		socket.addEventListener('open',event=>{
			emitter(onopen(id,event));
		});
		socket.addEventListener('error',event=>{
			emitter(onerror(id,event));
		});
		socket.addEventListener('close',event=>{
			emitter(onclose(id,event));
			emitter(END);
			deleteSocket(id);
		});
		socket.addEventListener('message',event=>{
			emitter(onmessage(id,event));
		});
		return ()=>{};
	});
}

function* messageWatcher(){
		yield takeEvery(`${message}`,messageWorker);
}

function* messageWorker(action){
	const {id,data,option={}}=action.payload;
	const socket=yield call(getSocket,id);
	if(socket){
			socket.binaryType=option.binaryType?option.binaryType:socket.binaryType;
			yield call(socket.send.bind(socket),data);
	}
}
function* closeWatcher(){
	yield takeEvery(`${close}`,closeWorker);
}
function* closeWorker(action){
	const {id,option={}}=action.payload;
	const socket=yield call(getSocket,id);
	if(socket){
		yield call(socket.close.bind(socket),option.code,option.reason);
		yield call(deleteSocket,id);
	}
}
function* openWatcher(){
	yield takeEvery(`${open}`,openWorker);
}
function* openWorker(action){
	const {id,url,option={}}=action.payload;
	const socket=yield call(connect,id,url,option);
	if(socket){
		yield fork(read,socket,id);
	}
}
export default function* wsStart(){
	yield fork(openWatcher);
	yield fork(closeWatcher);
	yield fork(messageWatcher);
}
