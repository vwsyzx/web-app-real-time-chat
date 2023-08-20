import React from 'react';
import { useState } from 'react';
import { userApi } from '../API/userSlice/userApi';
import { HiOutlineArrowRight } from 'react-icons/hi'

const Regis = ({mood, setMood}) => {
    const [regisFunc, {data, error, isLoading, isSuccess}] = userApi.useRegisMutation()

    const [emile, setEmile] = useState('')
    const [password, setPassword] = useState('')

    let base

    if(isLoading){
        base = <>
            <h3>Loading</h3>
        </>
    }
    else if(isSuccess){
        base = <>
            <h3>User Successfuly Registered</h3>
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
            mood === 23456?
            <div className='modal' onClick={ev => ev.stopPropagation()}>
                <div className='top__modal'>
                    <h3>Regis</h3>
                    <span className='icon__close' onClick={() => setMood(0)}><HiOutlineArrowRight/></span>
                </div>
                <input type="text" placeholder='Emile' value={emile} onChange={ev => setEmile(ev.target.value)}/>
                <input type="text" placeholder='Password' value={password} onChange={ev => setPassword(ev.target.value)}/>
                <button onClick={() => regisFunc({emile, password})}>Apply</button>
                {base}
            </div>:null
        }
        </>
    );
}

export default Regis;
