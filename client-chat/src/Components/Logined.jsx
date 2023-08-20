import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserPlus } from 'react-icons/fa'
import { RxExit } from 'react-icons/rx'
import { MdOutlineMail } from 'react-icons/md'
import '../Public/logined.css'
import { userApi } from '../API/userSlice/userApi';
import { middleApi } from '../API/middleSlice/middleApi';
import { BsThreeDotsVertical, BsCheck2 } from 'react-icons/bs'
import { clearSelect, select, getChat } from '../API/topSlice/topSlice';
import { GoMute, GoUnmute } from 'react-icons/go'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { topApi } from '../API/topSlice/topApi';
import { Back, Login, StatusOn, StatusOff } from '../API/userSlice/userSlice';

const Logined = ({mood, setMood, change, setChange, searchMood, setSearchMood}) => {
    const dispatch = useDispatch()
    const [socket, setSocket] = useState(new WebSocket('ws://localhost:3500'))

    const {friends, strangers, user} = useSelector(state => state.userSlice)
    const { selected } = useSelector(state => state.topSlice)
    const { messages } = useSelector(state => state.topSlice)


    const [logoutFunc, other3] = userApi.useLazyLogoutQuery()
    const [acceptFunc, other2] = middleApi.useAcceptMutation()
    const [rejectFunc, other1] = middleApi.useLazyRejectQuery()
    const [requestFunc, otherOptions] = middleApi.useRequestMutation()
    const [muteFunc, otherOptions2] = middleApi.useLazyMuteQuery()
    const [statusFunc, otherOptions1] = middleApi.useLazyStatusQuery()

    const [chatFunc, other4] = topApi.useLazyGetChatQuery()
    const [msgFunc, {data: resultMsg}] = topApi.useSendMsgMutation()
    const [deleteMsgFunc, otherOptions5] = topApi.useDeleteMsgMutation()

    const [onlineFunc, {data: result}] = middleApi.useOnlineMutation()

    const [search, setSearch] = useState('')
    const [msg, setMsg] = useState('')
    const [status, setStatus] = useState(false)

    function getChatFunc(item){
        dispatch(StatusOff())
        chatFunc({chatId: item.chatId})
        dispatch(select(item))
        setSearchMood(6789)
        onlineFunc({current: user.userUnique, userUnique: item.userUnique, mood: true, lastUser: selected.userUnique?selected.userUnique:''})
    }
    function socketControll(){
        socket.send(JSON.stringify({status: 'disconnect', current: user.userUnique, userUnique: selected.userUnique, mood: false}))
        socket.close(1000, 'disconnection')
    }

    socket.onopen = () => {
        socket.send(JSON.stringify({status: "user", userUnique: user.userUnique, friends}))
        console.log('Connected!')
    }
    socket.onmessage = (ev) => {
        const event = JSON.parse(ev.data)
        if(event.status === 'enter'){
            dispatch(Login(event))
        }
        else if(event.status === 'back'){
            dispatch(Back(event))
        }
        else if(event.status === 'disconnect'){
            dispatch(StatusOn())
            setStatus(true)
            onlineFunc({current: event.current, userUnique: event.userUnique, mood: false}) 
        }
        else if(event.status === 'message' && event.otherUserOnline){
            dispatch(getChat(event.chatPret))
        }
        else if(event.status === 'message' && !event.otherUserOnline){
            dispatch(Back({friends: event.otherFriends}))
        }
    }
    socket.onclose = (ev) => {
        dispatch(clearSelect())
    }

    useEffect(() => {
        if(result){
            if(!status){
                socket.send(JSON.stringify({status: 'onEnter', ...result, chatId: selected.chatId?selected.chatId:''}))
            }
        }
        else if(result && status){
            if(status){
                setStatus(false)
            }
        }
    }, [result])

    useEffect(() => {
        if(resultMsg){
            console.log(resultMsg.otherPret.emile)
            socket.send(JSON.stringify({status: 'message', chatPret: resultMsg.chatPret, otherPret: resultMsg.otherPret, otherFriends: resultMsg.otherFriends, otherUserOnline: resultMsg.otherUserOnline}))
        }
    }, [resultMsg])

    return (
    <>
        {
            mood === 34567?<div className='modal' onClick={(ev) => ev.stopPropagation()}>
                {
                    user.requestsRecieved?user.requestsRecieved.map((item, index) => {
                        return <div className='elem__request' key={index}>
                            <h3>{item.emile}</h3>
                            <div>
                                <button onClick={() => acceptFunc({emile: item.emile, userId: item.userId, userUnique: item.userUnique})}>Accept</button>
                                <button onClick={() => rejectFunc({unique: item.userUnique})}>Cancel</button>
                            </div>
                        </div>
                    }):null
                }
            </div>:null
        }
        <div className='base'>
            <div className='friends'>
                <h3>{user.emile}</h3>
                {
                    friends?friends.map((item, index) => {
                        if(item.status){
                            return <div className='best__friend' key={index} onClick={() => getChatFunc(item)}>
                                <h3>{item.emile}</h3>
                                {item.unread?<span>{item.unread}</span>:null}
                                {item.mute && <span className='icon'><GoMute/></span>}
                                {item.online && <span className='icon'><BsCheck2/></span>}
                                
                            </div>
                        }
                        else{
                           return <div className='simple__friend' key={index} onClick={() => getChatFunc(item)}>
                                <h3>{item.emile}</h3>
                                {item.unread?<span>{item.unread}</span>:null}
                                {item.mute && <span className='icon'><GoMute/></span>}
                                {item.online && <span className='icon'><BsCheck2/></span>}
                            </div> 
                        }
                    }):null
                }     
            </div>

            <div className='middle'>
                <div className='header'>
                    {
                        selected?.userUnique?
                        <>
                            <div className={selected.status?"name__header best__header":"name__header simple__header"}>
                                <span className='text'>{selected.emile}</span>
                                {selected.mute && <span className='icon'><GoMute/></span>}
                            </div>
                            
                            <span className='menu__icon' onClick={(ev) => {
                                ev.stopPropagation()
                                setChange({first: change.first, second: !change.second})}
                            }>
                                <BsThreeDotsVertical/>
                            </span>
                            <div onClick={ev => ev.stopPropagation()} className={change.second?"basic  active":'basic  inactive'}>
                                <span onClick={() => statusFunc({unique: selected.userUnique})} className='mood  mood__inactive'>{selected.status?'Make Simple':"Make Best"}</span>
                                <span onClick={() => muteFunc({unique: selected.userUnique})} className='mood  mood__inactive'>{selected.mute?"Unmute":"Mute"}</span>
                                <span onClick={() => {
                                    dispatch(StatusOff())
                                    setChange({first: false, second: false})
                                    setSearchMood(5678)
                                    onlineFunc({userUnique: selected.userUnique?selected.userUnique:'null', mood: false, current: user.userUnique})
                                    dispatch(clearSelect())    
                                }}><HiOutlineArrowRight/></span>
                            </div>
                        </>:
                        <>
                        <div>
                            <input type="text" placeholder="Search" value={search} onChange={ev => setSearch(ev.target.value)}/>
                        </div>
                        <span className='menu__icon' onClick={(ev) => {
                            ev.stopPropagation()
                            setChange({first: !change.first, second: change.second})}}><BsThreeDotsVertical/></span>
                        <div onClick={ev => ev.stopPropagation()} className={change.first?"basic  active":'basic  inactive'}>
                            <span onClick={() => setSearchMood(3456)} className={searchMood === 3456?'mood  mood__active': 'mood  mood__inactive'}>Friends</span>
                            <span onClick={() => setSearchMood(5678)} className={searchMood === 5678?'mood  mood__active': 'mood  mood__inactive'}>Strangers</span>
                        </div>
                        </>
                    }   
                </div>
                <div className='content'>
                    {   searchMood === 5678?
                        strangers?strangers.map((item, index) => {
                            if(item.emile.toLowerCase().includes(search.toLowerCase())){
                                return <div key={index} className="user" onClick={() => requestFunc({emile: item.emile, userId: item._id, userUnique: item.userUnique})}>
                                    <h3>{item.emile}</h3>
                                    <span><FaUserPlus/></span>    
                                </div>
                            }

                        }):null:
                        searchMood === 3456?
                        friends?friends.map((item, index) => {
                            if(item.emile.toLowerCase().includes(search.toLowerCase())){
                                return <div key={index} className="user" onClick={() => requestFunc({emile: item.emile, userId: item._id, userUnique: item.userUnique})}>
                                    <h3>{item.emile}</h3>   
                               </div>
                            }
                        }):null:
                        searchMood === 6789?
                        messages.length !== 0?messages.map((item, index) => {
                            if(item.from === user._id){
                                return <div className='mine' key={index}>
                                    <div className='mine__msg'>
                                        <span className='text'>{item.what}</span>
                                        <button onClick={() => deleteMsgFunc({chatId: selected.chatId, msgId: item.msgId})}>Delete</button>
                                    </div>
                                </div>
                            }
                            else{
                                return <div className='other' key={index}>
                                    <div className='other__msg'>
                                        <span className='text'>{item.what}</span>
                                        <button onClick={() => deleteMsgFunc({chatId: selected.chatId, msgId: item.msgId})}>Delete</button>
                                    </div>
                                </div>
                            }
                        }):null:null
                    }
                </div>
                <div className='bottom'>
                    <input type="text" placeholder='Message' value={msg} onChange={ev => setMsg(ev.target.value)}/>
                    <button onClick={() => msgFunc({chatId: selected.chatId, body: {what: msg}})}>Send</button>
                </div>
            </div>

            <div className='controller'>
                <div className='logout' onClick={() => {
                    if(selected.userUnique){
                        socketControll()
                        setMood(0)
                        setChange({first: false, second: false})
                        setSearchMood(5678)
                        logoutFunc()
                    }
                    else{
                        setMood(0)
                        setChange({first: false, second: false})
                        setSearchMood(5678)
                        logoutFunc()
                        socket.close(1000, 'disconnection')
                    }
                    
                    }}>
                    <span><RxExit/></span>
                </div>
                <div className='request' onClick={(ev) => {
                    setMood(mood === 34567?0:mood === 0?34567:null)
                    ev.stopPropagation()
                    setChange({first: false, second: false})
                    }}>
                    <span><MdOutlineMail/></span>
                </div>
            </div>
        </div>
    </>
    );
}

export default Logined;
