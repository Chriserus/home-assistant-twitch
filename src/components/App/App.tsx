import React, {useEffect, useState} from 'react'

import './App.css'
import jwt from "jsonwebtoken";
import axios from "axios";

const App = () => {
    const [twitch] = useState((window as any).Twitch ? (window as any).Twitch.ext : null);
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const [isVisible, setIsVisible] = useState(true);
    const [token, setToken] = useState('');
    const [opaque_id, setOpaque_id] = useState('');
    const [isMod, setIsMod] = useState(false);
    const [user_id, setUser_id] = useState("");


    useEffect(() => {
        if (twitch) {
            twitch.onAuthorized((auth: { token: any; userId: any; }) => {
                setAuthorization(auth.token, auth.userId);
                if (!finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    setFinishedLoading(true);
                }
            })

            twitch.listen('broadcast', (target: any, contentType: any, body: any) => {
                twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
                // now that you've got a listener, do something with the result...

                // do something...

            })

            twitch.onVisibilityChanged((isVisible: any, _c: any) => {
                visibilityChanged(isVisible)
            })

            twitch.onContext((context: any, delta: any) => {
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

    const setAuthorization = (token: string, opaque_id: string) => {
        try {
            let decoded = jwt.decode(token)

            // @ts-ignore
            if (decoded.role === 'broadcaster' || decoded.role === 'moderator') {
                setIsMod(true);
            }
            // @ts-ignore
            setUser_id(decoded.user_id);
        } catch (e) {
            setToken('');
            setOpaque_id('');
        }
        setToken(token);
        setOpaque_id(opaque_id);
    }

    const contextUpdate = (context: { theme: React.SetStateAction<string>; }, delta: string | string[]) => {
        if (delta.includes('theme')) {
            setTheme(context.theme);
        }
    }

    const visibilityChanged = (isVisible: boolean | ((prevState: boolean) => boolean)) => {
        setIsVisible(isVisible);
    }

    const requestFrom = () => {
        axios.get('http://localhost:8081')
            .then((response) => {
                console.log(response.data);
                (window as any).Twitch.ext.rig.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (finishedLoading && isVisible) {
        return (
            <div className="App">
                <div className={theme === 'light' ? 'App-light' : 'App-dark'}>
                    <p>Hello world!</p>
                    <p>My token is: {token}</p>
                    <p>My opaque ID is {opaque_id}.</p>
                    <div>{isMod ? <p>I am currently a mod, and here's a special mod button <input value='mod button'
                                                                                                  type='button' onClick={requestFrom}/>
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
