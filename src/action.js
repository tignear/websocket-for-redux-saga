import {createAction} from 'redux-act';
const WSHEADER='@@redux-saga-websocket-';

export const OPEN=WSHEADER+'open';
export const MESSAGE=WSHEADER+'message';
export const CLOSE=WSHEADER+'close';
export const ONOPEN=WSHEADER+'onopen';
export const ONMESSAGE=WSHEADER+'onmessage';
export const ONCLOSE=WSHEADER+'onclose';
export const ONERROR=WSHEADER+'onerror';

export const open=createAction(OPEN,(id,url,option)=>({id,url,option}));
export const message=createAction(MESSAGE,(id,data,option)=>({id,data,option}));
export const close=createAction(CLOSE,(id,option)=>({id,option}));
export const onopen=createAction(ONOPEN,(id,event)=>({id,event}));
export const onmessage=createAction(ONMESSAGE,(id,event)=>({id,event}));
export const onclose=createAction(ONCLOSE,(id,event)=>({id,event}));
export const onerror=createAction(ONERROR,(id,event)=>({id,event}));
