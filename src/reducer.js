import {createReducer} from 'redux-act';
import {onopen,onclose,onmessage,onerror,remove} from './action';

 export const STATE_UNINITIALIZED='uninitialized';
 export const STATE_ONOPEN='onopen';
 export const STATE_ONCLOSE='onclose';
 export const STATE_ONMESSAGE='onmessage';
 export const STATE_ONERROR='onerror';


export const initialState={
	websocket:{}
};
function updateStateCreator(eventType){
	return (state,payload)=>{
		const update={};
		update.websocket={};
		update.websocket[payload.id]={
			state:eventType,
			event:payload.event
		};
		return Object.assign({},state,update);
	}
}
export default createReducer({
	[onopen]:updateStateCreator(STATE_ONOPEN),
	[onclose]:updateStateCreator(STATE_ONCLOSE),
	[onmessage]:updateStateCreator(STATE_ONMESSAGE),
	[onerror]:updateStateCreator(STATE_ONERROR),
	[remove]:(state,payload)=>{
		const update=Object.assign({},state);
		delete update.websocket[payload.id];
		return update;
	}
},initialState);
