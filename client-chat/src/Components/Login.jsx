import React from 'react';
import { useState } from 'react';
import { userApi } from '../API/userSlice/userApi';
import { HiOutlineArrowRight } from 'react-icons/hi'
import '../App.css'
import { useEffect } from 'react';

const Login = ({mood, setMood}) => {
    const [loginFunc, {data, error, isLoading, isSuccess}] = userApi.useLoginMutation()

    const [emile, setEmile] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        if(isSuccess){
            setMood(0)
        }
    }, [isSuccess])

    let base

    if(isLoading){
        base = <>
            <h3>Loading</h3>
        </>
    }
    else if(error){
        base = <>
            <h3>{error.data.message}</h3>
        </>
    }

    return (
        <>
        {
        mood === 12345?
            <div onClick={(ev) => ev.stopPropagation()} className="modal">
                <div className='top__modal'>
                    <h3>Login</h3>
                    <span onClick={() => setMood(0)} className="icon__close"><HiOutlineArrowRight/></span>
                </div>
                <input type="text" placeholder='Emile' value={emile} onChange={ev => setEmile(ev.target.value)}/>
                <input type="text" placeholder='Password' value={password} onChange={ev => setPassword(ev.target.value)}/>
                <button onClick={() => loginFunc({emile, password})}>Apply</button>
                {base}
            </div>
            :null
        }
        </>
    );
}

export default Login;
