import saga from '../src/saga';
import * as actions from '../src/action'
import * as m from 'redux-saga-test-plan/matchers';
import {call} from 'redux-saga/effects'
import {eventChannel,END} from 'redux-saga';
import { expectSaga } from 'redux-saga-test-plan';

class DummyWS{
	constructor(){
		this.listeners={};
	}
	addEventListener(type,listener,option={}){
		if(!(this.listeners[type])){
			this.listeners[type]=[];
		}
		this.listeners[type].push(listener);
	}
	dispatchEvent(event){
		const arr=this.listeners[event.type];
		if(!arr) return;
		arr.forEach(val=>val(event));
	}
	send(data){
	}
	close(code=1005,reason=''){
		this.dispatchEvent(new CloseEvent('close'));
	}
}
describe('saga',()=>{
	const id='test';
	const url='ws://example.com';

	describe('open',()=>{
		it('success',()=>{
			return expectSaga(saga)
			.provide({
				call(effect,next){
					if(effect.fn.name==='connect'){
						const ws=new DummyWS();
						setTimeout(()=>ws.dispatchEvent(new Event('open')), 100);
						return ws;
					}
					return next();
				}
			})
			.put.like({action:{type:`${actions.onopen}`,payload:{id}}})
			.dispatch(actions.open(id,url))
			.run(2000);
		});
		it('fail',()=>{
			return expectSaga(saga)
			.provide({
				call(effect,next){
					if(effect.fn.name==='connect'){
						const ws= new DummyWS();
						setTimeout(()=>ws.dispatchEvent(new Event('error')), 100);
						setTimeout(()=>ws.dispatchEvent(new CloseEvent('close')),200);
						return ws;
					}
					return next();
				},
			})
			.put.like({action:{type:`${actions.onerror}`,payload:{id}}})
			.put.like({action:{type:`${actions.onclose}`,payload:{id}}})
			.dispatch(actions.open(id,url))
			.run(2000);
		});
	});
	describe('close',()=>{
		it('active',()=>{
			const ws= new DummyWS();
			return expectSaga(saga)
			.provide({
				call(effect,next){
					if(effect.fn.name==='getSocket'||effect.fn.name==='connect'){
						return ws;
					}
					return next();
				},
			})
			.put.like({action:{type:`${actions.onclose}`,payload:{id}}})
			.dispatch(actions.open(id,url))
			.dispatch(actions.close(id))
			.run(2000);
		})
	});

	describe('message',()=>{
		it('passive',()=>{
			const ws=new DummyWS();
			return expectSaga(saga)
			.provide({
				call(effect,next){
					if(effect.fn.name==='getSocket'){
						return ws;
					}
					if(effect.fn.name==='connect'){
						setTimeout(()=>ws.dispatchEvent(new MessageEvent('message')), 200);
						return ws;
					}
					return next();
				}
			})
			.put.like({action:{type:`${actions.onmessage}`}})
			.dispatch(actions.open(id,url))
			.run(2000);
		});
	});
});