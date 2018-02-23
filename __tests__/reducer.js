import reducer,{initialState,STATE_ONOPEN,STATE_ONCLOSE,STATE_ONMESSAGE,STATE_ONERROR} from '../src/reducer'
import {onopen,onclose,onmessage,onerror} from '../src/action'


describe('reducer',()=>{
	const id='test';
	describe('onopen',()=>{
		const event=new Event('open');
		const newState=reducer(initialState,onopen(id,event));
		it('clone',()=>{
				expect(newState).not.toBe(initialState);
		});
		it('id',()=>{
			expect(newState.websocket[id]).toBeDefined();
		});
		it('state',()=>{
			expect(newState.websocket[id].state).toBe(STATE_ONOPEN);
		});
		it('event',()=>{
			expect(newState.websocket[id].event).toBe(event);
		});
	});
	describe('onclose',()=>{
		const event=new CloseEvent('close');
		const newState=reducer(initialState,onclose(id,event));
		it('close',()=>{
			expect(newState).not.toBe(initialState);
		});
		it('id',()=>{
			expect(newState.websocket[id]).toBeDefined();
		});
		it('state',()=>{
			expect(newState.websocket[id].state).toBe(STATE_ONCLOSE);
		});
		it('event',()=>{
			expect(newState.websocket[id].event).toBe(event);
		});
	});
	describe('onmessage',()=>{
		const event= new MessageEvent('message');
		const newState=reducer(initialState,onmessage(id,event));
		it('close',()=>{
			expect(newState).not.toBe(initialState);
		});
		it('id',()=>{
			expect(newState.websocket[id]).toBeDefined();
		});
		it('state',()=>{
			expect(newState.websocket[id].state).toBe(STATE_ONMESSAGE);
		});
		it('event',()=>{
			expect(newState.websocket[id].event).toBe(event);
		});
	});
});