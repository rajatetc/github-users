import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  const [requests, setRequests] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ show: false, msg: '' })

  const searchGithubUser = async (user) => {
    toggleError() // we already have default values
    setIsLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    )

    // if we just add await in front of both requests, then followers will only be fetched when repos is settled making things slow
    if (response) {
      setGithubUser(response.data)
      const { login, followers_url } = response.data
      // // repos - we can also use repos_url
      // .then((response) => {
      //   setRepos(response.data)
      // })
      // // followers
      // .then((response) => {
      //   setFollowers(response.data)
      // })
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results
          const status = 'fulfilled'
          if (repos.status === status) {
            setRepos(repos.value.data)
          }
          if (followers.status === status) {
            setFollowers(followers.value.data)
          }
        })
        .catch((err) => console.log(err))
    } else {
      toggleError(true, 'there is no user with that username')
    }
    checkRequests()
    setIsLoading(false)
  }

  // check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data
        setRequests(remaining)
        if (remaining === 0) {
          toggleError(true, 'sorry, you have exceeded your hourly rate limit')
        }
      })
      .catch((err) => console.log(err))
  }

  // error
  function toggleError(show = false, msg = '') {
    setError({ show, msg })
  }

  useEffect(checkRequests, [])

  return (
    <GithubContext.Provider
      value={{
        githubUser: githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export { GithubProvider, GithubContext }
