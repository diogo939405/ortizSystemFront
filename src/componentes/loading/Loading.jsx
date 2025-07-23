import React from 'react'
import './Loading.css'
export default function Loading() {
    return (
        <div className='loading-container'>
            <div class="loader">
                <div class="load-inner load-one"></div>
                <div class="load-inner load-two"></div>
                <div class="load-inner load-three"></div>
                <span class="text">Carregando</span>
            </div>
        </div>

    )
}
