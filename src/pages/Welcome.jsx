import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import CopyClipboard from '../components/CopyClipboard'
import { baseUrlClient, generatePrivateShortUrl } from '../../utils/apiUrls'
import Spinner from '../components/Spinner'
import { useUrlContext } from '../../context/urlContext'

const Welcome = () => {
    const { url, setUrl, spinner, setSpinner, shortUrl, setShortURL, available, setAvailable, err, setErr } = useUrlContext();

    const navigate = useNavigate()
    const user = Cookies.get().user
    const token = user ? JSON.parse(user).token : undefined

    const generateShortenUrl = async () => {
        try {
            if (url) {
                setSpinner(true)
                const getShortUrl = await fetch(generatePrivateShortUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ original_url: url })
                })

                const response = await getShortUrl.json()
                if (response.error) {
                    setErr(true)
                    setSpinner(false)
                    setTimeout(() => {
                        setErr(false)
                    }, 5000)
                } else {
                    setShortURL(`${baseUrlClient}${response.response}`)
                    setAvailable(true)
                    setSpinner(false)
                    setUrl("")
                }

            }


        } catch (err) {
            console.log(err)
            setSpinner(false)
        }

    }

    useEffect(() => {
        if (token === undefined) {
            navigate('/')
        }
    }, [])
    return (
        <div className=' bg-orange-100 p-3 md:px-16 xl:px-32 flex justify-center items-center'>
            <div className='w-full bg-white rounded-2xl py-12 px-4 sm:px-14 md:px-20 flex flex-col gap-6 justify-center shadow-md shadow-orange-200 '>
                <h1 className='text-center text-2xl font-semibold transition-transform duration-1000'>Experience the Ease of URL Shortening!</h1>
                <div className='transition-all duration-1000'>
                    <div>
                        <label htmlFor="hs-trailing-button-add-on" className="sr-only">Label</label>
                        <div className="flex rounded-xl shadow-sm">
                            <input onChange={(e) => {
                                setUrl(e.target.value)
                            }} type="url" placeholder='Enter your long URL...' name="hs-trailing-button-add-on" className={`py-3 px-4 block w-full border ${err ? "border-red-200" : "border-orange-200"} rounded-s-lg text-sm focus:z-10 focus:border-orange-500 focus:ring-orange-500 disabled:opacity-50 outline-none disabled:pointer-events-none`} />
                            <button onClick={() => {
                                generateShortenUrl(url)

                            }} type="button" className={`w-[33%] sm:w-[25%] md:w-[16%] py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent ${err ? "bg-red-400 hover:bg-red-500" : "bg-orange-400 hover:bg-orange-500"} text-white disabled:opacity-50 disabled:pointer-events-none`}>
                                {spinner ? <Spinner /> : err ? "Invalid" : "Short it!"}

                            </button>
                        </div>
                    </div>
                </div>
                {available ? <CopyClipboard newUrl={shortUrl} bg={"orange"} /> : ""}
            </div>
        </div>
    )
}

export default Welcome