import {OPEN,open,MESSAGE,message,CLOSE,close,ONOPEN,onopen,ONMESSAGE,onmessage,ONCLOSE,onclose,ONERROR,onerror} from "../src/action"

describe('Action', () => {
	//define 
	const id='test';
	const url='ws://localhost:30000';
	const data='test data';

	describe('open',()=>{
		const action=open(id,url);
  	it('payload', () => {
  		expect(action.payload).toEqual({id,url});
  	});
  	it('type',()=>{
  		expect(action.type).toMatch(OPEN);
  	});
	});

	describe('message',()=>{
		const action=message(id,data);
		it('payload',()=>{
			expect(action.payload).toEqual({id,data});
		});
		it('type',()=>{
			expect(action.type).toMatch(MESSAGE);
		});
	});

	describe('close',()=>{
		const action=close(id);
		it('payload',()=>{
			expect(action.payload).toEqual({id});
		});
		it('type',()=>{
			expect(action.type).toMatch(CLOSE);
		});
	});

	describe('onopen',()=>{
		const event =new Event('open');
		const action=onopen(id,event);
		it('payload',()=>{
			expect(action.payload).toEqual({id,event});
		});
		it('type',()=>{
			expect(action.type).toMatch(ONOPEN);
		});
	});
	describe('onmessage',()=>{
		const event=new MessageEvent('message');
		const action=onmessage(id,event);
		it('payload',()=>{
			expect(action.payload).toEqual({id,event});
		});
		it('type',()=>{
			expect(action.type).toMatch(ONMESSAGE);
		})
	});
	describe('onclose',()=>{
		const event=new CloseEvent('close');
		const action=onclose(id,event);
		it('payload',()=>{
			expect(action.payload).toEqual({id,event});
		});
		it('type',()=>{
			expect(action.type).toMatch(ONCLOSE)
		});
	});
	describe('onerror',()=>{
		const event=new Event('error');
		const action=onerror(id,event);
		it('payload',()=>{
			expect(action.payload).toEqual({id,event});
		});
		it('type',()=>{
			expect(action.type).toMatch(ONERROR);
		})
	})
});
