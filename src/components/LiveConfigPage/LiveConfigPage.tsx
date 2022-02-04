import React, {useEffect, useState} from 'react'

import './LiveConfigPage.css'

const LiveConfigPage = () => {
    const [twitch] = useState((window as any).Twitch ? (window as any).Twitch.ext : null);
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // do config page setup as needed here
        if (twitch) {
            twitch.onAuthorized(() => {
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

    if (finishedLoading) {
        return (
            <div className="LiveConfigPage">
                <div className={theme === 'light' ? 'LiveConfigPage-light' : 'LiveConfigPage-dark'}>
                    <p>Hello world!</p>
                    <p>This is the live config page! </p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="LiveConfigPage">
            </div>
        )
    }
}

export default LiveConfigPage;
