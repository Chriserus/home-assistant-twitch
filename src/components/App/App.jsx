import React, {useEffect, useState} from 'react'

import './App.css'
import jwt from "jsonwebtoken";

const App = () => {
    const [twitch] = useState(window.Twitch ? window.Twitch.ext : null);
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const [isVisible, setIsVisible] = useState(true);
    const [token, setToken] = useState('');
    const [opaque_id, setOpaque_id] = useState('');
    const [isMod, setIsMod] = useState(false);
    const [user_id, setUser_id] = useState("");


    useEffect(() => {
        if (twitch) {
            twitch.onAuthorized((auth) => {
                setAuthorization(auth.token, auth.userId);
                if (!finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    setFinishedLoading(true);
                }
            })

            twitch.listen('broadcast', (target, contentType, body) => {
                twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
                // now that you've got a listener, do something with the result...

                // do something...

            })

            twitch.onVisibilityChanged((isVisible, _c) => {
                visibilityChanged(isVisible)
            })

            twitch.onContext((context, delta) => {
                contextUpdate(context, delta)
            })
        }
    }, []);


    useEffect(() => {
        return () => {
            if (twitch) {
                twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
            }
        }
    }, [])

    const setAuthorization = (token, opaque_id) => {
        try {
            let decoded = jwt.decode(token)
            if (decoded.role === 'broadcaster' || decoded.role === 'moderator') {
                setIsMod(true);
            }
            setUser_id(decoded.user_id);
        } catch (e) {
            setToken('');
            setOpaque_id('');
        }
        setToken(token);
        setOpaque_id(opaque_id);
    }

    const contextUpdate = (context, delta) => {
        if (delta.includes('theme')) {
            setTheme(context.theme);
        }
    }

    const visibilityChanged = (isVisible) => {
        setIsVisible(isVisible);
    }

    if (finishedLoading && isVisible) {
        return (
            <div className="App">
                <div className={theme === 'light' ? 'App-light' : 'App-dark'}>
                    <p>Hello world!</p>
                    <p>My token is: {token}</p>
                    <p>My opaque ID is {opaque_id}.</p>
                    <div>{isMod ? <p>I am currently a mod, and here's a special mod button <input value='mod button'
                                                                                                  type='button'/>
                    </p> : 'I am currently not a mod.'}</div>
                    <p>I have {!!user_id ? `shared my ID, and my user_id is ${user_id}` : 'not shared my ID'}.</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="App">
            </div>
        )
    }
}

export default App;
