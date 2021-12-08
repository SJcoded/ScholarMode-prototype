/* global chrome */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import ScholarModeButton from './components/ScholarModeButton'
import { Viewport } from './components/Viewport'



const renderScholarmode = async() => {
    try{
        if(!document.getElementById('center')){
            renderScholarmode()
        }else{
        const insertionPoint = document.createElement('div')
        insertionPoint.id = 'insertion-point'

        const searchDiv = await document.querySelector('#center');
        await searchDiv.appendChild(insertionPoint)


        const renderToggle = ReactDOM.render(
            <React.StrictMode>
                <ScholarModeButton />
            </React.StrictMode>,
            document.getElementById('insertion-point')
            )
        }
    } 
    catch(err){
        console.log(err)
    }
} 


const createViewportDiv = async() => {
    //create div for viewport
    const beforeVideos = document.createElement('div')
    beforeVideos.id = 'prevideos'
    beforeVideos.style.display = 'none'

    return beforeVideos
}

const placeViewportDiv = async(beforeVideos) => {
    //check for recommended videos and place div before videos
    const secondary = document.querySelector('#secondary')
    secondary.insertAdjacentElement('afterbegin', beforeVideos)

    return beforeVideos
}

const renderViewport = async() => {
    // render discussion into hidden div
    ReactDOM.render(
        <React.StrictMode>
            <Viewport />
        </React.StrictMode>,
        document.getElementById('prevideos')
    )
}

const toggleVideos = async(beforeVideos) => {
    //find recommended videos
    const videos = document.getElementById('secondary-inner')

    //find toggle to know the state
    const toggle = document.querySelector('.sc-bdvvtL')

    //observe when toggle changes
    const toggleObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.classList[2] === 'active') {
                beforeVideos.style.display = 'block'
                videos.style.display = 'none'
            } else {
                beforeVideos.style.display = 'none'
                videos.style.display = 'block'
            }
        })
    })

    toggleObserver.observe(toggle, {
        childList: false,
        attributes: true,
    })
}



const triggerViewport = async() => {
    try{
        // if(window.location.pathname === '/watch'){
            
            if(window.localStorage.getItem('scholarmode') === 'true'){
                triggerViewport()
            }else{
                let beforeVideos = await createViewportDiv()
                let div = await placeViewportDiv(beforeVideos)
                await renderViewport()
                await toggleVideos(div)
            }
        // }
    }
    catch(err){
        console.log(err)
    }
}


// nothing loads if the page navigates from home-page to video
// a refresh solves that problem in the short-term 
const refreshPageFromYTNavigateEvent = () => {
    if(window.location.pathname === '/watch'){
        window.location.reload()
        document.removeEventListener('yt-navigate-finish', refreshPageFromYTNavigateEvent)
    }
}


//if User is on the YouTube homepage then trigger a refresh on navigate
if(window.location.pathname === '/'){
    document.addEventListener('yt-navigate-finish', refreshPageFromYTNavigateEvent)
}



const renderApp = async() =>{
    await renderScholarmode()
    triggerViewport()
}

if(document.body){
    renderApp()
}else{
    document.addEventListener('DOMContentLoaded', renderApp )
}

