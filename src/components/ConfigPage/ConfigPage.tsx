import React, {useEffect, useState} from 'react'

import './Config.css'
import jwt from "jsonwebtoken";

const ConfigPage = () => {
    const [twitch] = useState((window as any).Twitch ? (window as any).Twitch.ext : null);
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const [isMod, setIsMod] = useState(false);

    useEffect(() => {
        // do config page setup as needed here
        if (twitch) {
            twitch.onAuthorized((auth: { token: any; }) => {
                setAuthorization(auth.token);
                if (!finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    setFinishedLoading(true);
                }
            })

            twitch.onContext((context: any, delta: any) => {
                contextUpdate(context, delta)
            })
        }
    }, []);

    const contextUpdate = (context: { theme: React.SetStateAction<string>; }, delta: string | string[]) => {
        if (delta.includes('theme')) {
            setTheme(context.theme);
        }
    }

    const setAuthorization = (token: any) => {
        try {
            let decoded = jwt.decode(token)
            if(decoded === null || typeof decoded === 'string') {
                return;
            }
            if (decoded.role === 'broadcaster' || decoded.role === 'moderator') {
                setIsMod(true);
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (finishedLoading && isMod) {
        return (
            <div className="Config">
                <div className={theme === 'light' ? 'Config-light' : 'Config-dark'}>
                    There is no configuration needed for this extension!
                </div>
            </div>
        )
    } else {
        return (
            <div className="Config">
                <div className={theme === 'light' ? 'Config-light' : 'Config-dark'}>
                    Loading...
                </div>
            </div>
        )
    }
}

export default ConfigPage;
